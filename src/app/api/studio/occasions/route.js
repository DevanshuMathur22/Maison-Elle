import {NextResponse} from "next/server";
import {z} from "zod";
import {currentUser} from "@/lib/studio-auth";
import {db} from "@/lib/mongodb";
import {getProducts} from "@/lib/studio-products";
import {getOccasions} from "@/lib/studio-occasions";

const schema=z.object({
  slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  name:z.string().trim().min(2).max(100),
  subtitle:z.string().trim().max(160),
  description:z.string().trim().max(800),
  status:z.enum(["draft","published"]),
  order:z.number().int().min(0).max(9999),
  productSlugs:z.array(z.string().max(80)).max(40)
}).strict();

const response=(error,status)=>NextResponse.json({error},{status});
const authorised=async()=>{const u=await currentUser();return u?.role==="super_admin"?u:null;};
const sameOrigin=req=>{
  try{return new URL(req.headers.get("origin")).origin===new URL(req.url).origin;}
  catch{return false;}
};

export async function GET(){
  if(!await authorised())return response("Unauthorized",401);
  return NextResponse.json({occasions:await getOccasions()},{headers:{"Cache-Control":"no-store"}});
}

export async function POST(req){
  const user=await authorised();
  if(!user)return response("Unauthorized",401);
  if(!sameOrigin(req))return response("Invalid origin",403);
  let parsed;
  try{parsed=schema.safeParse(await req.json());}
  catch{return response("Invalid JSON",400);}
  if(!parsed.success)return response("Invalid occasion details",400);
  const input=parsed.data;
  if(new Set(input.productSlugs).size!==input.productSlugs.length)
    return response("Duplicate products selected",400);
  const products=await getProducts();
  const known=new Set(products.map(p=>p.slug));
  if(input.productSlugs.some(s=>!known.has(s)))return response("Unknown product selected",400);
  const database=await db();
  const collection=database.collection("studio_occasions");
  const existing=await collection.findOne({slug:input.slug});
  if(input.status==="published"&&!existing?.coverImage)
    return response("Upload a cover image before publishing",400);
  const now=new Date();
  await collection.updateOne({slug:input.slug},{
    $set:{...input,updatedAt:now,updatedBy:user.email},
    $setOnInsert:{coverImage:"",createdAt:now}
  },{upsert:true});
  await database.collection("studio_audit").insertOne({
    action:existing?"occasion.updated":"occasion.created",
    slug:input.slug,actor:user.email,at:now
  });
  return NextResponse.json({success:true});
}

export async function DELETE(req){
  const user=await authorised();
  if(!user)return response("Unauthorized",401);
  if(!sameOrigin(req))return response("Invalid origin",403);
  let body;
  try{body=await req.json();}catch{return response("Invalid JSON",400);}
  if(typeof body?.slug!=="string"||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug))
    return response("Invalid occasion",400);
  const database=await db();
  const result=await database.collection("studio_occasions").deleteOne({slug:body.slug});
  if(!result.deletedCount)return response("Occasion not found",404);
  await database.collection("studio_audit").insertOne({
    action:"occasion.deleted",slug:body.slug,actor:user.email,at:new Date()
  });
  return NextResponse.json({success:true});
}
