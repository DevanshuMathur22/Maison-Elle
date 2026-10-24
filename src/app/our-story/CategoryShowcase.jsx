"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Crown, Gem, Heart, Hand, CircleDot, Footprints, ArrowUpRight
} from "lucide-react";

const categories = [
  { number:"01", title:"Head Adornments", subtitle:"THE BEGINNING OF BEAUTY", description:"Maang tikka, matha patti and statement head jewellery.", icon:Crown },
  { number:"02", title:"Earrings & Nose Jewellery", subtitle:"LITTLE DETAILS, BIG IMPACT", description:"Jhumkas, chandbalis, studs, hoops and nose pins.", icon:Gem },
  { number:"03", title:"Neck & Shoulder", subtitle:"A SIGNATURE STATEMENT", description:"Chokers, necklaces, haar sets and layered statement pieces.", icon:Heart },
  { number:"04", title:"Hands & Wrists", subtitle:"EVERY GESTURE MATTERS", description:"Bangles, kadas, bracelets, haath phool and rings.", icon:Hand },
  { number:"05", title:"Waist Jewellery", subtitle:"THE ART OF ADORNMENT", description:"Kamarbandh and occasion-inspired waist accessories.", icon:CircleDot },
  { number:"06", title:"Feet & Ankles", subtitle:"THE FINAL TOUCH", description:"Payal, anklets and toe rings for the finishing touch.", icon:Footprints }
];

export default function CategoryShowcase(){
  const reduced = useReducedMotion();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((item,i)=>{
        const Icon = item.icon;
        return (
          <motion.article
            key={item.number}
            initial={reduced ? false : {opacity:0,y:35}}
            whileInView={reduced ? undefined : {opacity:1,y:0}}
            viewport={{once:true,amount:0.15}}
            transition={{duration:0.65,delay:reduced ? 0 : (i%3)*0.1}}
            className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-[3px] border border-[#c5a572]/20 bg-[#211b18]/75 p-8 transition-colors duration-500 hover:border-[#c5a572]/60 hover:bg-[#302824] md:p-7"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#c5a572]/0 blur-[70px] transition-colors duration-500 group-hover:bg-[#c5a572]/10"/>
            <div className="relative flex items-start justify-between">
              <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full border border-[#c5a572]/30 bg-[#c5a572]/10 transition-all duration-500 group-hover:scale-110 group-hover:border-[#c5a572]/70">
                <Icon size={27} strokeWidth={1.2} className="text-[#c5a572]"/>
              </div>
              <span className="text-[11px] tracking-[3px] text-[#c5a572]/65">{item.number} / 06</span>
            </div>
            <div className="relative mt-9">
              <span className="text-[9px] font-medium tracking-[2.5px] text-[#c5a572]">{item.subtitle}</span>
              <h3 className="mt-3 font-serif text-[clamp(23px,2.5vw,30px)] leading-[1.15] text-[#e3d6c4]">{item.title}</h3>
              <p className="mt-4 max-w-[310px] text-[13px] leading-[1.9] text-[#b7b2ac]">{item.description}</p>
            </div>
            <Link href="/collections" className="relative mt-auto flex items-center justify-between border-t border-[#c5a572]/20 pt-5 text-[11px] tracking-[1px] text-[#c5a572] transition-colors hover:text-[#e3d6c4]">
              Explore collection
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"/>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}
