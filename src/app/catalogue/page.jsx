"use client";
import Image from "next/image";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MessageCircle, Sparkles } from "lucide-react";

const products = [
  ["CJ-001","Flower Tea Candle Holders","Festive Décor","flower-tealight-duo"],
  ["CJ-002","Orange Floral Tea Candle Holder","Festive Décor","orange-flower-tealight"],
  ["CJ-003","Shubh Labh Floral Hanging","Festive Décor","shubh-labh-hanging"],
  ["CJ-004","Floral Handheld Candle Holder","Festive Décor","floral-tealight-handheld"],
  ["CJ-005","Shubh Labh Pearl Hangings","Festive Décor","shubh-labh-blue-hangings"],
  ["CJ-006","Pink Floral Hairband","Hair Accessories","pink-floral-hairband"],
  ["CJ-007","Floral Pearl Jewellery Set","Floral Jewellery","floral-pearl-jewellery-set"],
  ["CJ-008","Rose Pearl Bangles","Floral Jewellery","rose-pearl-bangles"],
  ["CJ-009","Pearl Phone Charm","Accessories","pearl-phone-charm"],
  ["CJ-010","Beach Pearl Necklace","Pearl Jewellery","beach-pearl-necklace"],
  ["CJ-011","Korean Bow Pearl Necklace","Pearl Jewellery","korean-bow-pearl-necklace"]
];

const categories = ["All","Festive Décor","Hair Accessories","Floral Jewellery","Pearl Jewellery","Accessories"];

const whatsapp = (p) => {
  const message = `Hello Vrinda Élle, I'm interested in ${p[1]} (Product Code: ${p[0]}). Please share its price, availability and ordering details.`;
  return `https://wa.me/919530079054?text=${encodeURIComponent(message)}`;
};

export default function Catalogue() {
  const [active,setActive] = useState("All");
  const reduced = useReducedMotion();
  const visible = products.filter(p=>active==="All"||p[2]===active);

  return (
    <main className="min-h-screen bg-[#211b18] text-[#e3d6c4]">
      <section className="relative overflow-hidden px-[6%] pb-12 pt-28 md:pt-36">
        <div className="pointer-events-none absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-[#c5a572]/10 blur-[120px]"/>
        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-3 text-[11px] tracking-[.3em] text-[#c5a572]">
            <Sparkles size={15}/> THE CURATED EDIT
          </div>
          <h1 className="mt-7 max-w-4xl font-serif text-[clamp(32px,4.5vw,56px)] leading-[.98] tracking-tight">
            Little details.<br/>
            <em className="font-normal text-[#c5a572]">Beautiful stories.</em>
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-8 text-[#b7b2ac]">
            Explore our jewellery, handmade accessories and festive décor.
            Discover something special for every occasion.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-[6%] pb-16">
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

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p,i)=>(
            <motion.article key={p[0]}
              initial={reduced?false:{opacity:0,y:30}}
              whileInView={reduced?undefined:{opacity:1,y:0}}
              viewport={{once:true,amount:.12}}
              transition={{duration:.55,delay:(i%3)*.08}}
              className="group min-w-0">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#302824]">
                <Image src={`/products/${p[3]}.webp`}
                  alt={p[1]}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.045]" width={900} height={1125} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
                <span className="absolute left-4 top-4 bg-[#211b18]/90 px-3 py-2 text-[10px] tracking-widest text-[#c5a572]">
                  {p[0]}
                </span>
                <a href={whatsapp(p)} target="_blank" rel="noopener noreferrer"
                  aria-label={`Enquire about ${p[1]}`}
                  className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#c5a572] text-[#211b18] transition-transform hover:scale-110">
                  <ArrowUpRight size={20}/>
                </a>
              </div>
              <div className="pt-6">
                <span className="text-[10px] uppercase tracking-[.23em] text-[#c5a572]">{p[2]}</span>
                <h2 className="mt-3 font-serif text-[clamp(24px,2.3vw,32px)] leading-tight">{p[1]}</h2>
                <a href={whatsapp(p)} target="_blank" rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-3 border-b border-[#c5a572]/50 pb-2 text-xs tracking-wider text-[#c5a572] transition-colors hover:text-[#e3d6c4]">
                  <MessageCircle size={16}/> Enquire on WhatsApp <ArrowUpRight size={15}/>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
