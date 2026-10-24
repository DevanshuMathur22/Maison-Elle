"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { useState } from "react";

const reviews = [
  {
    title:"Elegant designs",
    text:"Such elegant designs! The jewellery looks beautiful with both traditional and modern outfits. Loved the collection.",
    name:"Aditi Sharma",
    occasion:"Sample · Jewellery Collection"
  },
  {
    title:"Absolutely gorgeous",
    text:"The earrings are absolutely gorgeous. The detailing is lovely and they add the perfect finishing touch to my festive look.",
    name:"Priya Mehta",
    occasion:"Sample · Festive Jewellery"
  },
  {
    title:"A classy collection",
    text:"I really liked the variety of designs. Everything feels thoughtfully selected and the collection has a very classy vibe.",
    name:"Riya Kapoor",
    occasion:"Sample · Jewellery Collection"
  },
  {
    title:"Beautiful statement pieces",
    text:"Beautiful jewellery for special occasions. I especially loved the statement pieces and the overall aesthetic.",
    name:"Neha Jain",
    occasion:"Sample · Occasion Jewellery"
  },
  {
    title:"So many pretty designs",
    text:"The collection is so pretty! I found several designs that would go perfectly with my ethnic outfits.",
    name:"Simran Arora",
    occasion:"Sample · Ethnic Jewellery"
  }
];

export default function CustomerReviews(){
  const [active,setActive]=useState(0);
  const reduced=useReducedMotion();
  const review=reviews[active];

  return <section className="overflow-hidden bg-[#29221e] px-[7%] py-14 md:py-20">
    <div className="mx-auto max-w-[1250px]">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-8">
        <div>
          <span className="text-[10px] tracking-[3px] text-[#c5a572]">WORDS THAT MATTER</span>
          <h2 className="mt-5 font-serif text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[-1px] text-[#e3d6c4]">
            Style inspirations.<br/><em className="text-[#c5a572]">Sample testimonials.</em>
          </h2>
        </div>
        <div className="flex gap-3">
          <button onClick={()=>setActive(v=>(v-1+reviews.length)%reviews.length)} aria-label="Previous review" className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c5a572]/40 text-[#c5a572] transition-colors hover:bg-[#c5a572] hover:text-[#211b18]"><ArrowLeft size={19}/></button>
          <button onClick={()=>setActive(v=>(v+1)%reviews.length)} aria-label="Next review" className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c5a572]/40 text-[#c5a572] transition-colors hover:bg-[#c5a572] hover:text-[#211b18]"><ArrowRight size={19}/></button>
        </div>
      </div>

      <div className="relative min-h-[280px] border border-[#c5a572]/20 bg-[#211b18] px-7 py-12 md:px-16 md:py-16">
        <Quote size={48} strokeWidth={1} className="absolute right-7 top-8 text-[#c5a572]/20 md:right-14"/>
        <motion.div
          key={active}
          initial={reduced?false:{opacity:0,y:15}}
          animate={{opacity:1,y:0}}
          transition={{duration:.4}}
          className="relative max-w-[850px]"
        >
          <div className="mb-7 flex gap-1 text-[#c5a572]" aria-label="Illustrative five-star design">
            {Array.from({length:5},(_,i)=><Star key={i} size={16} fill="currentColor"/>)}
          </div>
          <h3 className="font-serif text-[22px] leading-snug text-[#e3d6c4] md:text-[30px]">{review.title}</h3>
          <p className="mt-4 font-serif text-[15px] leading-[1.8] text-[#e3d6c4]/85 md:text-[19px]">“{review.text}”</p>
          <div className="mt-10 border-t border-[#c5a572]/20 pt-6">
            <p className="text-sm text-[#e3d6c4]">{review.name}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[2px] text-[#c5a572]">{review.occasion}</p>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-[11px] tracking-[2px] text-[#b7b2ac]">{String(active+1).padStart(2,"0")} / {String(reviews.length).padStart(2,"0")}</span>
        <div className="flex gap-2">
          {reviews.map((_,i)=><button key={i} onClick={()=>setActive(i)} aria-label={`Show review ${i+1}`} className={`h-[3px] transition-all duration-300 ${i===active?"w-10 bg-[#c5a572]":"w-5 bg-[#c5a572]/25"}`}/>)}
        </div>
      </div>
      <p className="mt-8 text-xs text-[#b7b2ac]">Illustrative testimonials featuring fictional names. Not verified customer reviews.</p>
    </div>
  </section>;
}
