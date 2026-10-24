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
    <section className="relative overflow-hidden px-[6%] pb-10 pt-28 sm:pt-32 md:pb-14 md:pt-36">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#c5a572]/10 blur-[110px]"/>
      <div className="relative mx-auto max-w-7xl">
        <p className="text-[10px] uppercase tracking-[.35em] text-[#c5a572]">CURATED FOR YOUR MOMENTS</p>
        <h1 className="mt-4 font-serif text-[clamp(30px,4vw,48px)] leading-[1.08]">
          The Occasion<br/><em className="font-normal text-[#c5a572]">Edit.</em>
        </h1>
        <p className="mt-4 max-w-xl text-[13px] leading-6 text-[#b7b2ac]">
          Every celebration has a story. Discover thoughtfully selected details for the moments that matter.
        </p>
      </div>
    </section>
    <div className="mx-auto max-w-7xl px-[6%] pb-16 md:pb-20">
      {visible.length===0&&<section className="border-t border-[#c5a572]/20 py-12 text-center md:py-16">
        <h2 className="font-serif text-[clamp(25px,3vw,36px)] leading-tight italic">Something beautiful is coming.</h2>
        <p className="mt-3 text-[13px] leading-6 text-[#b7b2ac]">Explore our collections while we curate the occasion edit.</p>
        <Link href="/collections" className="mt-5 inline-flex items-center gap-2 text-[13px] text-[#c5a572]">
          Browse Collections <ArrowUpRight size={16}/>
        </Link>
      </section>}
      {visible.map((occasion,i)=>{
        const selected=(occasion.productSlugs||[]).map(slug=>published.get(slug)).filter(Boolean);
        return <section key={occasion.slug} id={occasion.slug} className="scroll-mt-24 border-t border-[#c5a572]/20 py-10 md:py-14">
          <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
            <div className={i%2?"md:order-2":""}>
              <Image src={occasion.coverImage} alt={occasion.name} loading="lazy" decoding="async"
                className="h-[260px] w-full bg-[#302824] object-cover sm:h-[320px] md:h-[380px] transition-transform duration-700 ease-out motion-reduce:transition-none hover:scale-[1.015]" width={900} height={1125} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[.3em] text-[#c5a572]">THE OCCASION EDIT / {String(i+1).padStart(2,"0")}</p>
              <h2 className="mt-4 font-serif text-[clamp(27px,3.5vw,44px)] leading-tight">{occasion.name}</h2>
              {occasion.subtitle&&<p className="mt-3 font-serif text-lg italic text-[#c5a572]">{occasion.subtitle}</p>}
              {occasion.description&&<p className="mt-4 max-w-lg text-[13px] leading-6 text-[#b7b2ac]">{occasion.description}</p>}
              <a href={`#products-${occasion.slug}`} className="mt-5 inline-flex items-center gap-2 border-b border-[#c5a572]/50 pb-2 text-xs text-[#c5a572]">
                Discover the edit <ArrowUpRight size={16}/>
              </a>
            </div>
          </div>
          {selected.length>0&&<div id={`products-${occasion.slug}`} className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {selected.map(p=><Link key={p.slug} href={`/jewellery/${p.slug}`} className="group transition-transform duration-500 ease-out motion-reduce:transition-none hover:-translate-y-1 motion-reduce:hover:translate-y-0">
              <div className="h-[180px] overflow-hidden bg-[#302824] sm:h-[220px] md:h-[260px]">
                <Image src={p.image} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out motion-reduce:transition-none motion-reduce:group-hover:scale-100 group-hover:scale-105" width={900} height={1125} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-widest text-[#c5a572]">{p.category}</p>
              <h3 className="mt-2 font-serif text-base md:text-lg">{p.name}</h3>
            </Link>)}
          </div>}
        </section>;
      })}
      <section className="border border-[#c5a572]/25 bg-[#302824] px-5 py-10 text-center md:py-12">
        <p className="text-[10px] tracking-[.3em] text-[#c5a572]">PERSONAL ENQUIRIES</p>
        <h2 className="mt-4 font-serif text-[clamp(26px,3vw,38px)] leading-tight italic">Something special in mind?</h2>
        <a href="https://wa.me/919530079054?text=Hello%20Vrinda%20%C3%89lle%2C%20I%20would%20like%20to%20enquire%20about%20an%20occasion."
          target="_blank" rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 bg-[#c5a572] px-7 py-4 text-sm text-[#211b18]">
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
