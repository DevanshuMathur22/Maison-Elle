import { Suspense } from "react";
import { getProducts } from "@/lib/studio-products";
import CollectionsClient from "./CollectionsClient";

async function PublishedCollections() {
  const products = (await getProducts())
    .filter(p => p.status === "published" && p.image)
    .map(p => ({
      slug:p.slug,
      code:p.code,
      name:p.name,
      category:p.category,
      image:p.image
    }));
  return <CollectionsClient products={products}/>;
}

export default function CollectionsPage() {
  return <Suspense fallback={
    <main className="min-h-screen bg-[#211b18] px-[6%] pt-44 text-[#e3d6c4]">
      <p className="font-serif text-4xl italic">Loading collections...</p>
    </main>
  }>
    <PublishedCollections/>
  </Suspense>;
}
