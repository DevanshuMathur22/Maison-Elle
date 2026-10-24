import { Suspense } from "react";
import { getProducts } from "@/lib/studio-products";
import HomeClient from "./HomeClient";
import LuxuryLookbook from "@/components/home/LuxuryLookbook";
import CustomerReviews from "@/components/home/CustomerReviews";

async function FeaturedHome(){
  const featured=(await getProducts())
    .filter(p=>p.status==="published"&&p.featured&&p.image)
    .slice(0,6)
    .map(p=>({slug:p.slug,code:p.code,name:p.name,category:p.category,image:p.image}));
  const lookbook=(await getProducts()).filter(p=>p.status==="published"&&p.image).slice(0,5).map(p=>({slug:p.slug,name:p.name,category:p.category,image:p.image}));
  return <><HomeClient featured={featured}/><LuxuryLookbook products={lookbook}/></>;
}

export default function Home(){
  return <>
    <Suspense fallback={<HomeClient/>}>
      <FeaturedHome/>
    </Suspense>
    <CustomerReviews/>
  </>;
}
