import {NextResponse} from "next/server";
import {currentUser} from "@/lib/studio-auth";
import {db} from "@/lib/mongodb";
import {MAX_UPLOADS_PER_DAY,MAX_BLOB_BYTES} from "@/lib/studio-products";

export async function GET(){
  const user=await currentUser();
  if(!user||user.role !== "super_admin")
    return NextResponse.json({error:"Unauthorized"},{status:401});
  const database=await db();
  const uploads=database.collection("studio_uploads");
  const day=new Date().toISOString().slice(0,10);
  const [today,total]=await Promise.all([
    uploads.countDocuments({day}),
    uploads.aggregate([{$match:{deletedAt:{$exists:false}}},{$group:{_id:null,bytes:{$sum:"$bytes"},count:{$sum:1}}}]).toArray()
  ]);
  return NextResponse.json({
    today,maxDaily:MAX_UPLOADS_PER_DAY,
    bytes:total[0]?.bytes||0,
    uploads:total[0]?.count||0,
    maxBytes:MAX_BLOB_BYTES,
    note:"Historical tracked uploads. Unlinked images may still occupy Blob storage."
  },{headers:{"Cache-Control":"no-store"}});
}
