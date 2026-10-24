"use client";
import Image from "next/image";
import CollectionEnhancements from "@/components/CollectionEnhancements";

import { useState } from "react";
import Link from "next/link";
import {Search,X} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MessageCircle, Sparkles } from "lucide-react";



const whatsapp = (p) => {
  const message = `Hello Vrinda Élle, I'm interested in ${p.name} (Product Code: ${p.code}). Please share its price, availability and ordering details.`;
  return `https://wa.me/919530079054?text=${encodeURIComponent(message)}`;
};

export default function Catalogue({products=[]}) {
  const [active,setActive] = useState("All");
  const [search,setSearch] = useState("");
  const categories=["All",...new Set(products.map(p=>p.category).filter(Boolean))];
  const reduced = useReducedMotion();
  const visible=products.filter(p=>(active==="All"||p.category===active)&&`${p.name} ${p.code} ${p.category}`.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <main className="min-h-screen bg-[#211b18] text-[#e3d6c4]">
      <section className="relative overflow-hidden px-[6%] pb-20 pt-44 md:pt-56">
        <div className="pointer-events-none absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-[#c5a572]/10 blur-[120px]"/>
        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-3 text-[11px] tracking-[.3em] text-[#c5a572]">
            <Sparkles size={15}/> THE CURATED EDIT
          </div>
          <h1 className="mt-7 max-w-4xl font-serif text-[clamp(42px,5.5vw,76px)] leading-[.98] tracking-tight">
            Little details.<br/>
            <em className="font-normal text-[#c5a572]">Beautiful stories.</em>
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-8 text-[#b7b2ac]">
            Explore our jewellery, handmade accessories and festive décor.
            Discover something special for every occasion.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-[6%] pb-28">
        <div className="relative mb-7 max-w-xl">
          <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#c5a572]"/>
          <input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search designs, product names or codes..." aria-label="Search collections" className="w-full rounded-lg border border-[#c5a572]/30 bg-[#302824] py-4 pl-12 pr-5 text-sm text-[#e3d6c4] outline-none placeholder:text-[#b7b2ac] focus:border-[#c5a572]"/>
        </div>
        <div className="mb-9 flex flex-wrap items-center gap-3 border-b border-[#c5a572]/20 pb-8">
          {categories.map(c=>(
            <button key={c} onClick={()=>setActive(c)}
              aria-pressed={active===c}
              className={`rounded-full border px-5 py-3 text-xs transition-all duration-300 ${
                active===c
                  ?"border-[#c5a572] bg-[#c5a572] text-[#211b18]"
                  :"border-[#c5a572]/25 text-[#e3d6c4] hover:border-[#c5a572]"
              }`}>
              {c}
            </button>
          ))}
        </div>

        <div className="mb-6 flex justify-between text-[11px] tracking-[.2em] text-[#b7b2ac]">
          <span>DISCOVER THE COLLECTION</span>
          <span>{visible.length} PIECES</span>
        </div>

        {!visible.length&&<div className="mb-8 border border-[#c5a572]/20 bg-[#302824] p-8 text-center">
          <p className="font-serif text-2xl">No matching pieces found.</p>
          <button type="button" onClick={()=>{setSearch("");setActive("All");}} className="mt-4 inline-flex items-center gap-2 text-sm text-[#c5a572]"><X size={15}/> Clear filters</button>
        </div>}
        <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-5">
          {visible.map((p,i)=>(
            <motion.article key={p.slug}
              initial={reduced?false:{opacity:0,y:30}}
              whileInView={reduced?undefined:{opacity:1,y:0}}
              viewport={{once:true,amount:.12}}
              transition={{duration:.55,delay:(i%3)*.08}}
              className="group min-w-0">
              <Link href={`/jewellery/${p.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#302824]" aria-label={`View ${p.name}`}>
                <Image data-uniform-product-image="true" src={p.image} alt={p.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.045]" width={900} height={1125} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
              </Link>
              <div className="pt-6">
                <span className="text-[9px] uppercase tracking-[.12em] text-[#c5a572]">{p.category}</span>
                <h2 className="mt-3 font-serif italic font-normal tracking-[-0.035em] text-[clamp(12px,1.5vw,19px)] leading-tight">{p.name}</h2>
                <a href={whatsapp(p)} target="_blank" rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-3 border-b border-[#c5a572]/50 pb-2 text-xs tracking-wider text-[#c5a572] transition-colors hover:text-[#e3d6c4]">
                  <MessageCircle size={16}/> Enquire on WhatsApp <ArrowUpRight size={15}/>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    
      {/* COZY_FEATURED_COLLECTION_NOTE_V1 */}
      <section className="relative mx-auto my-16 max-w-6xl overflow-hidden border border-[#c5a572]/25 bg-[#211b18] px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-72 -translate-x-1/2 rounded-full bg-[#c5a572]/10 blur-[75px]"/>
        <div className="relative">
          <p className="mb-5 text-[10px] uppercase tracking-[.3em] text-[#c5a572]">
            BEYOND THE FEATURED EDIT
          </p>
          <h2 className="font-serif text-[clamp(30px,3.5vw,48px)] leading-tight text-[#e3d6c4]">
            Love what you see?
            <br/>
            <em className="font-normal text-[#c5a572]">There&apos;s more to explore.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#b7b2ac]">
            These are just a few of our creations. Contact us to discover
            more jewellery, handmade accessories, festive décor and custom designs.
          </p>
          <a
            href="https://wa.me/919530079054?text=Hello%20Vrinda%20%C3%89lle%2C%20I%20have%20explored%20your%20featured%20collection.%20Please%20share%20more%20available%20designs%20and%20ordering%20details."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center justify-center gap-3 bg-[#c5a572] px-8 py-4 text-xs font-medium tracking-wide text-[#211b18] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e3d6c4]"
          >
            Explore More on WhatsApp
            <span aria-hidden="true">↗</span>
          </a>
          <p className="mt-6 text-[10px] tracking-[.14em] text-[#b7b2ac]/70">
            MORE DESIGNS AVAILABLE ON ENQUIRY
          </p>
        </div>
      </section>

    <CollectionEnhancements/>
    </main>
  );
}
