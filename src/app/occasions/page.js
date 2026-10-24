import Image from "next/image";
import {Suspense} from "react";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {getOccasions} from "@/lib/studio-occasions";
import {getProducts} from "@/lib/studio-products";

export const metadata={
  title:"The Occasion Edit | Vrinda Élle",
  description:"Thoughtfully curated jewellery, accessories and décor for special occasions."
};

async function OccasionContent(){
  const [occasions,products]=await Promise.all([getOccasions(),getProducts()]);
  const published=new Map(products.filter(p=>p.status==="published"&&p.image).map(p=>[p.slug,p]));
  const visible=occasions.filter(o=>o.status==="published"&&o.coverImage);
  return <main className="min-h-screen bg-[#211b18] text-[#e3d6c4]">
    <section className="relative overflow-hidden px-[6%] pb-20 pt-44 md:pb-28 md:pt-56">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#c5a572]/10 blur-[110px]"/>
      <div className="relative mx-auto max-w-7xl">
        <p className="text-[10px] uppercase tracking-[.35em] text-[#c5a572]">CURATED FOR YOUR MOMENTS</p>
        <h1 className="mt-6 font-serif text-[clamp(54px,8vw,112px)] leading-[.9]">
          The Occasion<br/><em className="font-normal text-[#c5a572]">Edit.</em>
        </h1>
        <p className="mt-9 max-w-xl text-sm leading-8 text-[#b7b2ac]">
          Every celebration has a story. Discover thoughtfully selected details for the moments that matter.
        </p>
      </div>
    </section>
    <div className="mx-auto max-w-7xl px-[6%] pb-28">
      {visible.length===0&&<section className="border-t border-[#c5a572]/20 py-24 text-center">
        <h2 className="font-serif text-4xl italic">Something beautiful is coming.</h2>
        <p className="mt-5 text-sm text-[#b7b2ac]">Explore our collections while we curate the occasion edit.</p>
        <Link href="/collections" className="mt-7 inline-flex items-center gap-2 text-sm text-[#c5a572]">
          Browse Collections <ArrowUpRight size={16}/>
        </Link>
      </section>}
      {visible.map((occasion,i)=>{
        const selected=(occasion.productSlugs||[]).map(slug=>published.get(slug)).filter(Boolean);
        return <section key={occasion.slug} id={occasion.slug} className="scroll-mt-28 border-t border-[#c5a572]/20 py-16 md:py-24">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
            <div className={i%2?"md:order-2":""}>
              <Image src={occasion.coverImage} alt={occasion.name} loading="lazy" decoding="async"
                className="aspect-[4/5] w-full bg-[#302824] object-cover transition-transform duration-700 ease-out motion-reduce:transition-none hover:scale-[1.015]" width={900} height={1125} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[.3em] text-[#c5a572]">THE OCCASION EDIT / {String(i+1).padStart(2,"0")}</p>
              <h2 className="mt-6 font-serif text-[clamp(40px,5vw,72px)] leading-none">{occasion.name}</h2>
              {occasion.subtitle&&<p className="mt-5 font-serif text-2xl italic text-[#c5a572]">{occasion.subtitle}</p>}
              {occasion.description&&<p className="mt-6 max-w-lg text-sm leading-8 text-[#b7b2ac]">{occasion.description}</p>}
              <a href={`#products-${occasion.slug}`} className="mt-8 inline-flex items-center gap-2 border-b border-[#c5a572]/50 pb-2 text-xs text-[#c5a572]">
                Discover the edit <ArrowUpRight size={16}/>
              </a>
            </div>
          </div>
          {selected.length>0&&<div id={`products-${occasion.slug}`} className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {selected.map(p=><Link key={p.slug} href={`/jewellery/${p.slug}`} className="group transition-transform duration-500 ease-out motion-reduce:transition-none hover:-translate-y-1 motion-reduce:hover:translate-y-0">
              <div className="aspect-[4/5] overflow-hidden bg-[#302824]">
                <Image src={p.image} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out motion-reduce:transition-none motion-reduce:group-hover:scale-100 group-hover:scale-105" width={900} height={1125} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-widest text-[#c5a572]">{p.category}</p>
              <h3 className="mt-2 font-serif text-xl">{p.name}</h3>
            </Link>)}
          </div>}
        </section>;
      })}
      <section className="border border-[#c5a572]/25 bg-[#302824] px-6 py-16 text-center">
        <p className="text-[10px] tracking-[.3em] text-[#c5a572]">PERSONAL ENQUIRIES</p>
        <h2 className="mt-5 font-serif text-5xl italic">Something special in mind?</h2>
        <a href="https://wa.me/919530079054?text=Hello%20Vrinda%20%C3%89lle%2C%20I%20would%20like%20to%20enquire%20about%20an%20occasion."
          target="_blank" rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 bg-[#c5a572] px-7 py-4 text-sm text-[#211b18]">
          Enquire on WhatsApp <ArrowUpRight size={17}/>
        </a>
      </section>
    </div>
  </main>;
}

export default function OccasionsPage(){
  return <Suspense fallback={<main className="min-h-screen bg-[#211b18] px-[6%] pt-44 text-[#e3d6c4]">
    <h1 className="font-serif text-5xl italic">The Occasion Edit...</h1>
  </main>}>
    <OccasionContent/>
  </Suspense>;
}
