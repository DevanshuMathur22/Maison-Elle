import "server-only";
import { del } from "@vercel/blob";
import { products as originals } from "@/data/jewellery";

const validSlug=s=>typeof s==="string"&&s.length<=80&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);

function ownedUrl(url,slug){
  if(!validSlug(slug)||typeof url!=="string")return false;
  try{
    const parsed=new URL(url);
    return parsed.protocol==="https:"&&
      /^[a-z0-9-]+\\.public\\.blob\\.vercel-storage\\.com$/i.test(parsed.hostname)&&
      parsed.pathname.startsWith(`/vrinda-elle/products/${slug}/`)&&
      parsed.pathname.endsWith(".webp")&&
      !parsed.search&&!parsed.hash;
  }catch{return false}
}

export async function cleanupProductImages(database,slug){
  if(!validSlug(slug))throw new Error("Invalid product");

  const queue=database.collection("studio_blob_cleanup");
  const uploads=database.collection("studio_uploads");
  const records=database.collection("studio_products");
  const jobs=await queue.find({slug,status:"pending"}).toArray();

  let deleted=0,retained=0,pending=0;

  for(const job of jobs){
    const url=job.url;

    const [owned,otherOwner,shared,otherQueued]=await Promise.all([
      uploads.findOne({slug,url}),
      uploads.findOne({slug:{$ne:slug},url}),
      records.findOne({
        slug:{$ne:slug},
        $or:[{image:url},{images:url}]
      }),
      queue.findOne({
        slug:{$ne:slug},
        url,
        status:{$ne:"deleted"}
      })
    ]);

    const bundled=originals.some(p=>
      p.image===url||(Array.isArray(p.images)&&p.images.includes(url))
    );

    const protectedImage=
      !owned||
      !ownedUrl(url,slug)||
      !!otherOwner||
      !!shared||
      !!otherQueued||
      bundled;

    if(protectedImage){
      await queue.updateOne(
        {_id:job._id,status:"pending"},
        {$set:{
          status:"retained",
          reason:"unverified_or_shared_image",
          updatedAt:new Date()
        }}
      );
      retained++;
      continue;
    }

    if(!process.env.BLOB_READ_WRITE_TOKEN){
      pending++;
      continue;
    }

    try{
      await del(url);

      await queue.updateOne(
        {_id:job._id,status:"pending"},
        {$set:{status:"deleted",updatedAt:new Date()}}
      );

      await uploads.updateMany(
        {slug,url},
        {$set:{deletedAt:new Date()}}
      );

      deleted++;
    }catch{
      await queue.updateOne(
        {_id:job._id,status:"pending"},
        {
          $set:{lastAttemptAt:new Date()},
          $inc:{attempts:1}
        }
      );
      pending++;
    }
  }

  return {deleted,retained,pending};
}
