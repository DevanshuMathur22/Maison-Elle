import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/lib/studio-auth";
import { db } from "@/lib/mongodb";
import { getProducts, counts, categories, MAX_ACTIVE, MAX_FEATURED } from "@/lib/studio-products";

const schema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  code: z.string().trim().min(2).max(30),
  name: z.string().trim().min(2).max(120),
  category: z.enum(categories),
  description: z.string().trim().max(1500),
  material: z.string().trim().max(500),
  status: z.enum(["draft","published","archived"]),
  featured: z.boolean()
}).strict();

function sameOrigin(req) {
  try {
    const origin = new URL(req.headers.get("origin"));
    const url = new URL(req.url);
    return origin.host === url.host && origin.protocol === url.protocol;
  } catch {
    return false;
  }
}

async function authorised() {
  const user = await currentUser();
  return user && user.role === "super_admin" ? user : null;
}

export async function GET() {
  if (!await authorised()) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  const products = await getProducts();
  return NextResponse.json({ products, counts:counts(products) }, {
    headers: { "Cache-Control":"no-store" }
  });
}

export async function DELETE(req) {
  const user=await authorised();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  if(!sameOrigin(req))return NextResponse.json({error:"Invalid origin"},{status:403});
  let body;
  try{body=await req.json()}catch{return NextResponse.json({error:"Invalid JSON"},{status:400})}
  const slug=body?.slug;
  if(typeof slug!=="string"||slug.length>80||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    return NextResponse.json({error:"Invalid product"},{status:400});

  const database=await db();
  const locks=database.collection("studio_write_locks");
  const owner=crypto.randomUUID();
  const lock=await locks.findOneAndUpdate(
    {_id:"products",$or:[{until:{$lt:new Date()}},{until:{$exists:false}}]},
    {$set:{until:new Date(Date.now()+300000),owner}},
    {upsert:false,returnDocument:"after"}
  );
  if(!lock)return NextResponse.json({error:"Another update is in progress"},{status:409});

  try{
    const product=(await getProducts()).find(p=>p.slug===slug);
    if(!product)return NextResponse.json({error:"Product not found"},{status:404});
    const originals=(await import("@/data/jewellery")).products;
    const isOriginal=originals.some(p=>p.slug===slug);
    const now=new Date();
    const records=database.collection("studio_products");
    const tombstones=database.collection("studio_deleted_slugs");
    const queue=database.collection("studio_blob_cleanup");
    const uploads=await database.collection("studio_uploads").find({slug}).toArray();
    const urls=[...new Set(uploads.map(x=>x.url).filter(x=>typeof x==="string"))];

    for(const url of urls){
      await queue.updateOne(
        {_id:slug+":"+url},
        {$setOnInsert:{slug,url,status:"pending",attempts:0,createdAt:now}},
        {upsert:true}
      );
    }

    await tombstones.updateOne(
      {_id:slug},
      {$setOnInsert:{slug,code:product.code,deletedAt:now,deletedBy:user.email}},
      {upsert:true}
    );

    if(isOriginal){
      await records.updateOne(
        {slug},
        {$set:{deletedAt:now,deletedBy:user.email,status:"archived",featured:false}},
        {upsert:true}
      );
    }else{
      await records.deleteOne({slug});
    }

    await database.collection("studio_audit").insertOne({
      action:"product.permanently_deleted",slug,code:product.code,actor:user.email,at:now
    });

    const {cleanupProductImages}=await import("@/lib/studio-blob-cleanup");
    let imagesCleanup;
    try{
      imagesCleanup=await cleanupProductImages(database,slug);
    }catch{
      imagesCleanup={
        deleted:0,
        retained:0,
        pending:await queue.countDocuments({slug,status:"pending"})
      };
    }
    return NextResponse.json({success:true,imagesCleanup});
  }finally{
    await locks.updateOne({_id:"products",owner},{$set:{until:new Date(0)},$unset:{owner:""}});
  }
}

export async function POST(req) {
  const user = await authorised();
  if (!user) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  if (!sameOrigin(req)) return NextResponse.json({ error:"Invalid origin" }, { status:403 });

  let parsed;
  try { parsed = schema.safeParse(await req.json()); }
  catch { return NextResponse.json({ error:"Invalid JSON" }, { status:400 }); }
  if (!parsed.success) return NextResponse.json({ error:"Invalid product details" }, { status:400 });

  const input = parsed.data;
  if(input.status==="published" && !input.slug)
    return NextResponse.json({error:"Invalid product"},{status:400});
  const database = await db();
  const locks = database.collection("studio_write_locks");
  const lockOwner=crypto.randomUUID();
  const lock = await locks.findOneAndUpdate(
    { _id:"products", $or:[{ until:{$lt:new Date()} },{ until:{$exists:false} }] },
    { $set:{ until:new Date(Date.now()+300000),owner:lockOwner } },
    { upsert:false, returnDocument:"after" }
  );
  if (!lock) return NextResponse.json({ error:"Another update is in progress. Retry." }, { status:409 });

  try {
    const permanentlyDeleted = await database.collection("studio_deleted_slugs").findOne({_id:input.slug});
    if(permanentlyDeleted)
      return NextResponse.json({error:"This product was permanently deleted. Its slug cannot be reused."},{status:409});
    const deleted = await database.collection("studio_products").findOne({
      slug: input.slug,
      deletedAt: { $exists: true }
    });
    if (deleted)
      return NextResponse.json({
        error: "This product was permanently deleted. Its slug cannot be reused."
      }, { status: 409 });

    const products = await getProducts();
    const existing = products.find(p => p.slug === input.slug);
    if (!existing && products.some(p => p.code.toLowerCase() === input.code.toLowerCase()))
      return NextResponse.json({ error:"Product code already exists" }, { status:409 });
    if (existing && existing.code.toLowerCase() !== input.code.toLowerCase() &&
        products.some(p => p.slug !== input.slug && p.code.toLowerCase() === input.code.toLowerCase()))
      return NextResponse.json({ error:"Product code already exists" }, { status:409 });

    const next = existing
      ? products.map(p => p.slug === input.slug ? { ...p, ...input } : p)
      : [...products, { ...input, images:[], image:"", collection:input.category }];

    const stats = counts(next);
    const target = next.find(p=>p.slug===input.slug);
    if(input.status==="published" && !(target.images?.length || target.image))
      return NextResponse.json({error:"Upload an image before publishing"},{status:400});
    if (stats.active > MAX_ACTIVE)
      return NextResponse.json({ error:"Maximum 40 active products allowed" }, { status:409 });
    if (stats.featured > MAX_FEATURED)
      return NextResponse.json({ error:"Maximum 6 published featured products allowed" }, { status:409 });
    if (input.featured && input.status !== "published")
      return NextResponse.json({ error:"Only published products can be featured" }, { status:400 });

    await database.collection("studio_products").updateOne(
      { slug:input.slug },
      {
        $set:{
          ...input,
          collection:input.category,
          updatedAt:new Date(),
          updatedBy:user.email
        },
        $setOnInsert:{
          images:existing?.images || [],
          image:existing?.image || "",
          createdAt:new Date()
        }
      },
      { upsert:true }
    );
    await database.collection("studio_audit").insertOne({
      action:existing ? "product.updated" : "product.created",
      slug:input.slug,
      actor:user.email,
      at:new Date()
    });
    return NextResponse.json({ success:true });
  } finally {
    await locks.updateOne({_id:"products",owner:lockOwner},{$set:{until:new Date(0)},$unset:{owner:""}});
  }
}
