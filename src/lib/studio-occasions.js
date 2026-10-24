import "server-only";
import {connection} from "next/server";
import {db} from "@/lib/mongodb";

export async function getOccasions(){
  await connection();
  const database=await db();
  const items=await database.collection("studio_occasions")
    .find({}).sort({order:1,createdAt:1}).toArray();
  return items.map(({_id,...item})=>({...item,id:String(_id)}));
}
