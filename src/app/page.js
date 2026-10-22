import { Suspense } from "react";
import { getProducts } from "@/lib/studio-products";
import HomeClient from "./HomeClient";

async function FeaturedHome(){
  const featured=(await getProducts())
    .filter(p=>p.status==="published"&&p.featured&&p.image)
    .slice(0,6)
    .map(p=>({slug:p.slug,code:p.code,name:p.name,category:p.category,image:p.image}));
  return <HomeClient featured={featured}/>;
}

export default function Home(){
  return <Suspense fallback={<HomeClient/>}><FeaturedHome/></Suspense>;
}
