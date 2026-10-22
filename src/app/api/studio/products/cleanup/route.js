import {NextResponse} from "next/server";
import {currentUser} from "@/lib/studio-auth";
import {db} from "@/lib/mongodb";
import {cleanupProductImages} from "@/lib/studio-blob-cleanup";

export async function POST(req){
  const user=await currentUser();
  if(!user||user.role!=="super_admin")
    return NextResponse.json({error:"Unauthorized"},{status:401});
  if(req.headers.get("origin")!==new URL(req.url).origin)
    return NextResponse.json({error:"Invalid origin"},{status:403});
  let body;
  try{body=await req.json()}catch{return NextResponse.json({error:"Invalid JSON"},{status:400})}
  const slug=body?.slug;
  if(typeof slug!=="string"||slug.length>80||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    return NextResponse.json({error:"Invalid slug"},{status:400});
  const database=await db();
  const deleted=await database.collection("studio_deleted_slugs").findOne({_id:slug});
  if(!deleted)return NextResponse.json({error:"Product is not deleted"},{status:409});
  const locks=database.collection("studio_write_locks");
  const owner=crypto.randomUUID();
  const lock=await locks.findOneAndUpdate(
    {_id:"products",$or:[{until:{$lt:new Date()}},{until:{$exists:false}}]},
    {$set:{until:new Date(Date.now()+300000),owner}},
    {upsert:false,returnDocument:"after"}
  );
  if(!lock)return NextResponse.json({error:"Another update is in progress"},{status:409});
  try{
    const result=await cleanupProductImages(database,slug);
    return NextResponse.json({success:true,imagesCleanup:result});
  }finally{
    await locks.updateOne({_id:"products",owner},{$set:{until:new Date(0)},$unset:{owner:""}});
  }
}
