import "server-only";
import { connection } from "next/server";
import { products as originals } from "@/data/jewellery";
import { db } from "@/lib/mongodb";

export const MAX_ACTIVE = 40;
export const MAX_FEATURED = 6;
export const MAX_IMAGES = 2;
export const MAX_UPLOADS_PER_DAY = 5;
export const MAX_BLOB_BYTES = 50 * 1024 * 1024;

export const categories = ["Festive Décor","Hair Accessories","Floral Jewellery","Pearl Jewellery","Accessories"];

export async function getProducts() {
  await connection();
  const database = await db();
  const overrides = await database.collection("studio_products").find({}).toArray();
  const tombstones = await database.collection("studio_deleted_slugs").find({}, {projection:{_id:1}}).toArray();
  const removed = new Set(tombstones.map(p=>p._id));
  const bySlug = new Map(overrides.map(p => [p.slug, p]));
  const initial = originals.map(p => ({
    ...p,
    status: "published",
    featured: false,
    images: [p.image],
    ...(bySlug.get(p.slug) || {}),
    source: "original"
  }));
  const extra = overrides.filter(p => !originals.some(x => x.slug === p.slug));
  return [...initial, ...extra].filter(p=>!p.deletedAt && !removed.has(p.slug)).map(p => ({
    ...p,
    _id: undefined,
    id: p.slug,
    images: p.images || (p.image ? [p.image] : [])
  }));
}

export function counts(products) {
  return {
    active: products.filter(p => p.status !== "archived").length,
    published: products.filter(p => p.status === "published").length,
    drafts: products.filter(p => p.status === "draft").length,
    archived: products.filter(p => p.status === "archived").length,
    featured: products.filter(p => p.featured && p.status === "published").length
  };
}
