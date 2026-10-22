"use client";

// COZY_COLLECTION_ENHANCEMENTS_V1
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Gift, Heart, MessageCircle, Sparkles } from "lucide-react";

const whatsapp = "https://wa.me/919530079054?text=" + encodeURIComponent(
  "Hello Maison Élle, I've explored your featured collection. Please share more available designs and ordering details."
);

const moments = [
  {icon:Gift,title:"Thoughtful Gifting",description:"Discover charming pieces for birthdays, celebrations and meaningful little surprises."},
  {icon:Sparkles,title:"Festive Celebrations",description:"Explore decorative details and accessories that bring warmth to special occasions."},
  {icon:Heart,title:"Everyday Elegance",description:"Find delicate jewellery and accessories to complement your personal style."}
];

const steps = [
  {number:"01",title:"Explore",description:"Browse our featured creations and find something you love."},
  {number:"02",title:"Enquire",description:"Send us a WhatsApp message with the product name or code."},
  {number:"03",title:"Confirm",description:"Discuss availability, pricing and ordering details directly with us."}
];

const faqs = [
  {q:"Are these all your available products?",a:"No. Our website features a selection of creations. Contact us on WhatsApp to explore more available designs."},
  {q:"How do I enquire about a product?",a:"Tap the WhatsApp enquiry button on a product. Its name and code can be included in your message."},
  {q:"Where can I find prices?",a:"Please contact us directly for current prices and availability."},
  {q:"Can I ask about other colours or designs?",a:"Yes, you can enquire about additional colours and designs. Availability will be confirmed directly."},
  {q:"How do I place an order?",a:"Start a WhatsApp conversation and confirm your chosen design, availability and ordering details."}
];

function Reveal({children,delay=0,className=""}) {
  const reduced=useReducedMotion();
  return <motion.div
    initial={reduced?false:{opacity:0,y:25}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true,amount:.12}}
    transition={{duration:.65,delay,ease:[.22,1,.36,1]}}
    className={className}
  >{children}</motion.div>;
}

export default function CollectionEnhancements() {
  const [active,setActive]=useState(null);

  return <div className="mx-auto max-w-[1500px] px-[6%] pb-24 text-[#e3d6c4]">
    <section className="border-t border-[#c5a572]/20 py-20 md:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] uppercase tracking-[.3em] text-[#c5a572]">BEYOND THE EVERYDAY</p>
        <h2 className="mt-5 font-serif text-[clamp(38px,5vw,68px)] leading-[1.1]">
          Made for <em className="text-[#c5a572]">your moments.</em>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-[#b7b2ac]">
          From celebrations to everyday details, discover creations that make moments feel special.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {moments.map((item,i)=>{
          const Icon=item.icon;
          return <Reveal key={item.title} delay={i*.08}
            className="group border border-[#c5a572]/20 bg-[#211b18] p-8 transition-colors duration-300 hover:border-[#c5a572]/60 hover:bg-[#2b211c] md:p-10">
            <div className="flex h-12 w-12 items-center justify-center border border-[#c5a572]/30 text-[#c5a572] transition-transform duration-300 group-hover:-translate-y-1">
              <Icon size={22} strokeWidth={1.5}/>
            </div>
            <h3 className="mt-8 font-serif text-3xl">{item.title}</h3>
            <p className="mt-4 text-sm leading-8 text-[#b7b2ac]">{item.description}</p>
          </Reveal>;
        })}
      </div>
    </section>

    <section className="border-t border-[#c5a572]/20 py-20 md:py-28">
      <Reveal className="text-center">
        <p className="text-[10px] uppercase tracking-[.3em] text-[#c5a572]">SIMPLE & PERSONAL</p>
        <h2 className="mt-5 font-serif text-[clamp(38px,5vw,68px)]">How to <em className="text-[#c5a572]">enquire.</em></h2>
      </Reveal>
      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {steps.map((step,i)=><Reveal key={step.number} delay={i*.08} className="border-t border-[#c5a572]/40 pt-6">
          <span className="font-serif text-5xl text-[#c5a572]/65">{step.number}</span>
          <h3 className="mt-6 font-serif text-3xl">{step.title}</h3>
          <p className="mt-4 max-w-sm text-sm leading-8 text-[#b7b2ac]">{step.description}</p>
        </Reveal>)}
      </div>
      <Reveal className="mt-12 text-center">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#c5a572] px-7 py-4 text-xs font-medium text-[#211b18] transition-all hover:-translate-y-1 hover:bg-[#e3d6c4]">
          <MessageCircle size={17}/> Explore More on WhatsApp <ArrowRight size={16}/>
        </a>
      </Reveal>
    </section>

    <section className="border-t border-[#c5a572]/20 py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[.3em] text-[#c5a572]">GOOD TO KNOW</p>
          <h2 className="mt-5 font-serif text-[clamp(38px,5vw,62px)] leading-[1.1]">
            A few <em className="text-[#c5a572]">little answers.</em>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-8 text-[#b7b2ac]">
            Everything you need to know before exploring more of our creations.
          </p>
        </Reveal>
        <div className="border-t border-[#c5a572]/25">
          {faqs.map((faq,i)=><Reveal key={faq.q}>
            <div className="border-b border-[#c5a572]/25">
              <button type="button" onClick={()=>setActive(active===i?null:i)}
                aria-expanded={active===i}
                className="flex w-full items-center justify-between gap-5 py-6 text-left font-serif text-lg text-[#e3d6c4] transition-colors hover:text-[#c5a572] sm:text-xl">
                {faq.q}
                <ChevronDown size={19} className={`shrink-0 text-[#c5a572] transition-transform duration-300 ${active===i?"rotate-180":""}`}/>
              </button>
              {active===i&&<motion.p initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}}
                className="max-w-xl pb-7 text-sm leading-8 text-[#b7b2ac]">{faq.a}</motion.p>}
            </div>
          </Reveal>)}
        </div>
      </div>
    </section>
  </div>;
}
