import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { products as originals, enquiry } from "@/data/jewellery";
import { getProducts } from "@/lib/studio-products";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";

export function generateStaticParams() {
  return originals.map(p=>({slug:p.slug}));
}

export async function generateMetadata({params}) {
  const {slug}=await params;
  const p=(await getProducts()).find(x=>x.slug===slug && x.status==="published");
  return {title:p?`${p.name} | Vrinda Élle`:"Jewellery | Vrinda Élle"};
}

async function JewelleryDetailContent({params}) {
  const {slug}=await params;
  const products=(await getProducts()).filter(p=>p.status==="published");
  const product=products.find(p=>p.slug===slug);
  if(!product || !product.image) notFound();
  const similar=products.filter(p=>p.slug!==slug && p.image).slice(0,2);
  return <main className="inner-page">
    <div className="detail-breadcrumb"><Link href="/collections"><ArrowLeft size={15}/> All Collections</Link><span>/</span><span>{product.name}</span></div>
    <section className="detail-layout">
      <ProductGallery product={{name:product.name,image:product.image,images:product.images}}/>
      <div className="detail-content">
        <span className="section-kicker">{product.collection.toUpperCase()} / {product.code}</span>
        <h1>{product.name}</h1>
        <p className="detail-category">{product.category}</p>
        <p>{product.description}</p>
        <div className="detail-spec"><span>DETAILS</span><p>{product.material}</p></div>
        <div className="detail-spec"><span>PRICE & AVAILABILITY</span><p>Available upon enquiry</p></div>
        <a className="primary-button" href={enquiry(product)} target="_blank" rel="noopener noreferrer">Enquire on WhatsApp <ArrowUpRight size={18}/></a>
        <small className="detail-note">Mention product code {product.code} when enquiring.</small>
      </div>
    </section>
    <section className="similar-section">
      <div className="section-heading"><div><span className="section-kicker">KEEP EXPLORING</span><h2>You may also <em>love.</em></h2></div></div>
      <div className="jewel-grid">{similar.map(p=><ProductCard key={p.slug} product={p}/>)}</div>
    </section>
  </main>;
}


export default function JewelleryDetail({params}) {
  return (
    <Suspense fallback={
      <main className="inner-page" style={{padding:"160px 8%",minHeight:"75vh"}}>
        <span className="section-kicker">THE JEWELLERY EDIT</span>
        <h1 style={{fontFamily:"Georgia, serif",fontSize:"clamp(40px,6vw,72px)",marginTop:24}}>
          Discovering your piece...
        </h1>
      </main>
    }>
      <JewelleryDetailContent params={params}/>
    </Suspense>
  );
}
