import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
if (!uri) throw new Error("DATABASE_URL missing");

const globalClient = globalThis;
const clientPromise = globalClient.__maisonMongo || new MongoClient(uri, {
  serverSelectionTimeoutMS: 8000
}).connect();

if (process.env.NODE_ENV !== "production") globalClient.__maisonMongo = clientPromise;

export async function db() {
  return (await clientPromise).db("maison-elle");
}
