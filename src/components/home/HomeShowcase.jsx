"use client";
import NetworkImage from "@/components/NetworkImage";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MessageCircle, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products, enquiry } from "@/data/jewellery";

const categories = [
  {name:"Head Jewellery",detail:"Maang tikka · Matha patti",image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=85"},
  {name:"Earrings",detail:"Jhumkas · Chandbalis · Studs",image:"https://images.unsplash.com/photo-1630019852942-f89202989a59?w=900&q=85"},
  {name:"Neck Jewellery",detail:"Chokers · Necklaces · Haar sets",image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&q=85"},
  {name:"Hand Jewellery",detail:"Bangles · Bracelets · Rings",image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=85"},
  {name:"Waist Jewellery",detail:"Kamarbandh · Statement pieces",image:"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=85"},
  {name:"Foot Jewellery",detail:"Anklets · Payal · Toe rings",image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&q=85"}
];

const occasions = [
  {name:"The Bridal Edit",caption:"FOR YOUR MOST MEMORABLE MOMENTS",image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&q=85"},
  {name:"Festive Expressions",caption:"A LITTLE MORE CELEBRATION",image:"https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1200&q=85"},
  {name:"Everyday Elegance",caption:"THE BEAUTY OF EVERY DAY",image:"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=85"}
];

const heading = "font-serif text-[clamp(30px,4vw,52px)] leading-[1.08] tracking-[-2px] text-[#e3d6c4]";
const kicker = "text-[10px] uppercase tracking-[3px] text-[#c5a572]";

function Reveal({children,className="",delay=0}){
  const reduced=useReducedMotion();
  return <motion.div
    className={className}
    initial={reduced?false:{opacity:0,y:30}}
    whileInView={reduced?undefined:{opacity:1,y:0}}
    viewport={{once:true,amount:0.12}}
    transition={{duration:.65,delay}}
  >{children}</motion.div>;
}

export default function HomeShowcase(){
  return <>
    <section className="bg-[#211b18] px-[6%] py-14 md:py-20">
      <Reveal className="mb-14 flex flex-col justify-between gap-7 md:flex-row md:items-end">
        <div>
          <span className={kicker}>FROM HEAD TO TOE</span>
          <h2 className={`${heading} mt-5`}>Find your <em className="text-[#c5a572]">adornment.</em></h2>
        </div>
        <p className="max-w-[350px] text-sm leading-8 text-[#b7b2ac]">A world of artificial jewellery for every detail, occasion and personal expression.</p>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
        {categories.map((item,i)=><Reveal key={item.name} delay={(i%3)*.08}>
          <Link href="/collections" className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#302824]">
              <NetworkImage src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover brightness-[.82] transition-transform duration-700 group-hover:scale-105" width={900} height={1125} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#211b18]/80 via-transparent to-transparent"/>
              <span className="absolute bottom-4 left-4 text-[10px] tracking-[2px] text-[#e3d6c4]/80 md:bottom-6 md:left-6">0{i+1} / COLLECTION</span>
            </div>
            <div className="flex items-start justify-between gap-2 pt-5">
              <div>
                <h3 className="font-serif text-xl text-[#e3d6c4] md:text-3xl">{item.name}</h3>
                <p className="mt-2 text-[11px] leading-5 text-[#b7b2ac]">{item.detail}</p>
              </div>
              <ArrowUpRight size={19} className="shrink-0 text-[#c5a572] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/>
            </div>
          </Link>
        </Reveal>)}
      </div>
    </section>

    <section className="bg-[#302824] px-[6%] py-14 md:py-20">
      <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className={kicker}>THE JEWELLERY EDIT</span>
          <h2 className={`${heading} mt-5`}>Currently <em className="text-[#c5a572]">adored.</em></h2>
        </div>
        <Link href="/collections" className="inline-flex items-center gap-3 border-b border-[#c5a572] pb-2 text-xs text-[#c5a572]">View all jewellery <ArrowUpRight size={17}/></Link>
      </Reveal>
      <div className="grid grid-cols-1 gap-8 min-[390px]:grid-cols-2 lg:grid-cols-3">
        {products.slice(0,6).map((product,i)=><Reveal key={product.slug} delay={(i%3)*.08}>
          <ProductCard product={product}/>
        </Reveal>)}
      </div>
    </section>

    <section className="bg-[#211b18] px-[6%] py-14 md:py-20">
      <Reveal className="mb-14">
        <span className={kicker}>MADE FOR THE MOMENT</span>
        <h2 className={`${heading} mt-5`}>Every occasion <em className="text-[#c5a572]">has a story.</em></h2>
      </Reveal>
      <div className="grid gap-5 md:grid-cols-3">
        {occasions.map((item,i)=><Reveal key={item.name} delay={i*.1}>
          <Link href="/collections" className="group relative block aspect-[4/5] overflow-hidden bg-[#34372e]">
            <NetworkImage src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover brightness-75 transition-transform duration-700 group-hover:scale-105" width={900} height={1125} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#110e0c]/90 via-transparent to-transparent"/>
            <div className="absolute bottom-7 left-6 right-6">
              <span className="text-[9px] tracking-[2px] text-[#c5a572]">{item.caption}</span>
              <div className="mt-3 flex items-end justify-between gap-3">
                <h3 className="font-serif text-3xl text-[#e3d6c4]">{item.name}</h3>
                <ArrowUpRight className="shrink-0 text-[#c5a572]"/>
              </div>
            </div>
          </Link>
        </Reveal>)}
      </div>
    </section>

    <section className="bg-[radial-gradient(ellipse_at_center,#45382e,#211b18_70%)] px-[7%] py-16 text-center md:py-24">
      <Reveal className="mx-auto flex max-w-[780px] flex-col items-center">
        <Sparkles size={29} strokeWidth={1.2} className="mb-8 text-[#c5a572]"/>
        <span className={kicker}>SOMETHING SPECIAL IN MIND?</span>
        <h2 className={`${heading} mt-6`}>Your next favourite <em className="text-[#c5a572]">piece awaits.</em></h2>
        <p className="mt-7 max-w-[500px] text-sm leading-8 text-[#b7b2ac]">Explore designs, ask about availability or enquire about a particular jewellery piece. We are just a message away.</p>
        <a href={enquiry()} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex items-center gap-4 bg-[#c5a572] px-7 py-5 text-xs font-medium text-[#211b18] transition-colors hover:bg-[#e3d6c4]">
          <MessageCircle size={18}/> Enquire on WhatsApp <ArrowUpRight size={17}/>
        </a>
      </Reveal>
    </section>
  </>;
}
