"use client";
import NetworkImage from "@/components/NetworkImage";
import Link from "next/link";
import {motion,useReducedMotion} from "framer-motion";
import {ArrowUpRight} from "lucide-react";

export default function LuxuryLookbook({products=[]}){
  const reduced=useReducedMotion();
  const selected=products.filter(p=>p.image).slice(0,5);
  if(!selected.length)return null;
  return <section className="bg-[#211b18] px-[6%] py-24 text-[#e3d6c4] md:py-36">
    <div className="mx-auto max-w-7xl">
      <p className="text-[10px] uppercase tracking-[.3em] text-[#c5a572]">THE VRINDA ÉLLE EDITORIAL</p>
      <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
        <h2 className="mt-5 font-serif text-[clamp(44px,6vw,86px)] leading-none">The <em className="text-[#c5a572]">Lookbook.</em></h2>
        <Link href="/collections" className="inline-flex items-center gap-2 border-b border-[#c5a572] pb-2 text-xs text-[#c5a572]">Explore all pieces <ArrowUpRight size={17}/></Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-5">
        {selected.map((p,i)=><motion.div key={p.slug} initial={reduced?false:{opacity:0,y:24}} whileInView={reduced?undefined:{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5,delay:i*.06}} className={`${i===0?"col-span-2 md:col-span-4 md:row-span-2":"col-span-1 md:col-span-2"} min-w-0`}>
          <Link href={`/jewellery/${p.slug}`} className="group relative block h-full min-h-[230px] overflow-hidden bg-[#302824] md:min-h-[300px]">
            <NetworkImage src={p.image} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" width={900} height={1125} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#110e0c]/90 via-transparent to-transparent"/>
            <div className="absolute bottom-5 left-4 right-4 md:bottom-8 md:left-7">
              <p className="text-[9px] uppercase tracking-[.2em] text-[#c5a572]">{p.category}</p>
              <h3 className="mt-2 font-serif text-xl leading-tight md:text-3xl">{p.name}</h3>
              <span className="mt-3 inline-flex items-center gap-2 text-[10px] text-[#e3d6c4]">Discover piece <ArrowUpRight size={14}/></span>
            </div>
          </Link>
        </motion.div>)}
      </div>
    </div>
  </section>;
}
