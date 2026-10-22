import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import sharp from "sharp";
import { currentUser } from "@/lib/studio-auth";
import { db } from "@/lib/mongodb";
import { getProducts, MAX_IMAGES, MAX_UPLOADS_PER_DAY, MAX_BLOB_BYTES } from "@/lib/studio-products";

const error=(message,status=400)=>NextResponse.json({error:message},{status});
const day=()=>new Date().toISOString().slice(0,10);

export async function POST(req){
  const user=await currentUser();
  if(!user || user.role !== "super_admin") return error("Unauthorized",401);
  const origin=req.headers.get("origin");
  if(!origin || new URL(origin).origin!==new URL(req.url).origin) return error("Invalid origin",403);
  if(!process.env.BLOB_READ_WRITE_TOKEN) return error("Blob storage not configured",503);
  if(Number(req.headers.get("content-length")||0)>8*1024*1024) return error("File too large",413);

  let data;
  try{data=await req.formData()}catch{return error("Invalid upload")}
  const slug=String(data.get("slug")||"");
  const file=data.get("file");
  const replaceIndex=data.get("replaceIndex");
  const replacing=replaceIndex!==null;
  const index=replacing?Number(replaceIndex):-1;
  if(replacing&&(!Number.isInteger(index)||index<0||index>=MAX_IMAGES))
    return error("Invalid replacement position");
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return error("Invalid product");
  if(!file || typeof file.arrayBuffer!=="function") return error("Select an image");
  if(!["image/jpeg","image/png","image/webp"].includes(file.type)) return error("JPG, PNG or WebP only");
  if(file.size>5*1024*1024 || file.size<100) return error("Image must be under 5MB");

  const database=await db();
  const locks=database.collection("studio_write_locks");
  const lockOwner=crypto.randomUUID();
  const lock=await locks.findOneAndUpdate(
    {
      _id:"products",
      $or:[
        {until:{$lt:new Date()}},
        {until:{$exists:false}}
      ]
    },
    {$set:{
      until:new Date(Date.now()+300000),
      owner:lockOwner
    }},
    {returnDocument:"after"}
  );
  if(!lock) return error("Another update is in progress",409);

  try{
    const products=await getProducts();
    const product=products.find(p=>p.slug===slug);
    if(!product) return error("Save product details before uploading",404);
    if(replacing&&index>=(product.images||[]).length)
      return error("Photo no longer exists",409);
    if(!replacing&&(product.images||[]).length>=MAX_IMAGES)
      return error("Maximum 2 images per product",409);

    const uploads=database.collection("studio_uploads");
    const used=await uploads.countDocuments({day:day()});
    if(used>=MAX_UPLOADS_PER_DAY) return error("Daily upload limit reached",429);

    const previous=await uploads.aggregate([{$match:{deletedAt:{$exists:false}}},{$group:{_id:null,total:{$sum:"$bytes"}}}]).toArray();
    if((previous[0]?.total||0)>=MAX_BLOB_BYTES) return error("Image storage limit reached",409);

    let buffer;
    try{
      buffer=await sharp(Buffer.from(await file.arrayBuffer()),{limitInputPixels:20000000})
        .rotate().resize({width:1400,height:1400,fit:"inside",withoutEnlargement:true})
        .webp({quality:78}).toBuffer();
    }catch{return error("Invalid or unsupported image")}

    if((previous[0]?.total||0)+buffer.length>MAX_BLOB_BYTES)
      return error("Image storage limit exceeded",409);

    const blob=await put(`vrinda-elle/products/${slug}/${Date.now()}.webp`,buffer,{
      access:"public",contentType:"image/webp",addRandomSuffix:true
    });

    try{
      const images=[...(product.images||[])];
      if(replacing)images[index]=blob.url;
      else images.push(blob.url);
      await database.collection("studio_products").updateOne(
        {slug},
        {$set:{images,image:images[0],updatedAt:new Date(),updatedBy:user.email},
         $setOnInsert:{createdAt:new Date()}},
        {upsert:true}
      );
      await uploads.insertOne({slug,url:blob.url,bytes:buffer.length,day:day(),at:new Date(),actor:user.email});
      await database.collection("studio_audit").insertOne({
        action:replacing?"product.image_replaced":"product.image_uploaded",slug,actor:user.email,at:new Date()
      });
      return NextResponse.json({success:true,images});
    }catch(e){
      await del(blob.url).catch(()=>{});
      throw e;
    }
  }finally{
    await locks.updateOne(
      {_id:"products",owner:lockOwner},
      {$set:{until:new Date(0)},$unset:{owner:""}}
    );
  }
}
