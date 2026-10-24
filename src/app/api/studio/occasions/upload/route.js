import {NextResponse} from "next/server";
import {put,del} from "@vercel/blob";
import sharp from "sharp";
import {currentUser} from "@/lib/studio-auth";
import {db} from "@/lib/mongodb";
import {MAX_UPLOADS_PER_DAY,MAX_BLOB_BYTES} from "@/lib/studio-products";

const error=(message,status=400)=>NextResponse.json({error:message},{status});

export async function POST(req){
  const user=await currentUser();
  if(user?.role!=="super_admin")return error("Unauthorized",401);
  try{
    if(new URL(req.headers.get("origin")).origin!==new URL(req.url).origin)
      return error("Invalid origin",403);
  }catch{return error("Invalid origin",403);}
  if(!process.env.BLOB_READ_WRITE_TOKEN)return error("Blob storage not configured",503);
  if(Number(req.headers.get("content-length")||0)>8*1024*1024)return error("File too large",413);

  let form;
  try{form=await req.formData();}catch{return error("Invalid upload");}
  const slug=String(form.get("slug")||"");
  const file=form.get("file");
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))return error("Invalid occasion");
  if(!file||typeof file.arrayBuffer!=="function")return error("Select a photo");
  if(!["image/jpeg","image/png","image/webp"].includes(file.type))
    return error("JPG, PNG or WebP only");
  if(file.size<100||file.size>5*1024*1024)return error("Image must be under 5MB");

  const database=await db();
  const occasions=database.collection("studio_occasions");
  const existing=await occasions.findOne({slug});
  if(!existing)return error("Save occasion draft before uploading",404);

  const uploads=database.collection("studio_uploads");
  const day=new Date().toISOString().slice(0,10);
  if(await uploads.countDocuments({day})>=MAX_UPLOADS_PER_DAY)
    return error("Daily upload limit reached",429);
  const totals=await uploads.aggregate([
    {$match:{deletedAt:{$exists:false}}},
    {$group:{_id:null,total:{$sum:"$bytes"}}}
  ]).toArray();

  let buffer;
  try{
    buffer=await sharp(Buffer.from(await file.arrayBuffer()),{limitInputPixels:20000000})
      .rotate().resize({width:1600,height:1600,fit:"inside",withoutEnlargement:true})
      .webp({quality:78}).toBuffer();
  }catch{return error("Invalid image");}
  if((totals[0]?.total||0)+buffer.length>MAX_BLOB_BYTES)
    return error("Storage limit reached",409);

  const blob=await put(`vrinda-elle/occasions/${slug}/${Date.now()}.webp`,buffer,{
    access:"public",contentType:"image/webp",addRandomSuffix:true
  });
  try{
    const updated=await occasions.updateOne({slug},{
      $set:{coverImage:blob.url,updatedAt:new Date(),updatedBy:user.email}
    });
    if(!updated.matchedCount)throw new Error("Occasion no longer exists");
    await uploads.insertOne({
      slug:`occasion:${slug}`,url:blob.url,bytes:buffer.length,day,
      at:new Date(),actor:user.email
    });
    await database.collection("studio_audit").insertOne({
      action:"occasion.cover_uploaded",slug,actor:user.email,at:new Date()
    });
    return NextResponse.json({success:true,coverImage:blob.url});
  }catch(e){
    await del(blob.url).catch(()=>{});
    return error("Unable to save cover image",500);
  }
}
