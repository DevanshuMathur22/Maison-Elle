import {NextResponse} from "next/server";
import {currentUser} from "@/lib/studio-auth";
import {db} from "@/lib/mongodb";
import {getProducts} from "@/lib/studio-products";
import {products as originals} from "@/data/jewellery";

const error=(message,status=400)=>NextResponse.json({error:message},{status});

export async function POST(req){
  const user=await currentUser();
  if(!user||user.role !== "super_admin")return error("Unauthorized",401);
  if(req.headers.get("origin")!==new URL(req.url).origin)return error("Invalid origin",403);

  let body;
  try{body=await req.json()}catch{return error("Invalid request")}
  const {slug,url}=body||{};
  if(typeof slug!=="string"||typeof url!=="string")return error("Invalid image");

  const database=await db();
  const locks=database.collection("studio_write_locks");
  const owner=crypto.randomUUID();
  const lock=await locks.findOneAndUpdate(
    {_id:"products",$or:[{until:{$lt:new Date()}},{until:{$exists:false}}]},
    {$set:{until:new Date(Date.now()+300000),owner}},
    {returnDocument:"after"}
  );
  if(!lock)return error("Another update is in progress",409);

  try{
    const product=(await getProducts()).find(p=>p.slug===slug);
    if(!product)return error("Product not found",404);
    const current=product.images||[];
    if(!current.includes(url))return error("Photo no longer exists",409);
    const original=originals.find(p=>p.slug===slug);
    if(original?.image===url)return error("Bundled original photo cannot be removed",403);

    const images=current.filter(x=>x!==url);
    if(product.status==="published"&&!images.length)
      return error("Published products must keep at least one photo",409);

    await database.collection("studio_products").updateOne(
      {slug},
      {$set:{images,image:images[0]||"",updatedAt:new Date(),updatedBy:user.email},
       $setOnInsert:{createdAt:new Date()}},
      {upsert:true}
    );
    await database.collection("studio_audit").insertOne({
      action:"product.image_unlinked",slug,url,actor:user.email,at:new Date()
    });
    return NextResponse.json({success:true,images});
  }finally{
    await locks.updateOne({_id:"products",owner},{$set:{until:new Date(0)},$unset:{owner:""}});
  }
}
