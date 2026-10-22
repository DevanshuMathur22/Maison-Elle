"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Menu, X, Camera, Heart } from "lucide-react";

const pieces = [
  { id: "01", name: "The Golden Hour", type: "Statement Earrings", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=900&q=85" },
  { id: "02", name: "A Little Romance", type: "Delicate Necklace", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=85" },
  { id: "03", name: "Afterglow", type: "Everyday Essentials", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&q=85" }
];
const fade = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: .48, ease: [0.22,1,0.36,1] } };
const whatsapp = (name) => `https://wa.me/919530079054?text=${encodeURIComponent(`Hello, I'm interested in ${name}. Please share the price, availability and ordering details.`)}`;

export default function Home() {
  const [menu, setMenu] = useState(false);
  return <main>


    <section className="hero">
      <div className="hero-glow"/>
      <motion.div className="hero-copy" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,ease:[.22,1,.36,1]}}>
        <div className="eyebrow"><span/> A LITTLE LUXURY, EVERY DAY</div>
        <h1>Beautiful things<br/>for <em>beautiful</em><br/>moments<span className="period">.</span></h1>
        <p>Thoughtfully chosen adornments for the moments that become memories. A little sparkle, a lot of soul.</p>
        <a className="primary-button" href="/collections">Explore the collection <ArrowUpRight size={17}/></a>
      </motion.div>
      <motion.div className="hero-visual" initial={{opacity:0,scale:1.035}} animate={{opacity:1,scale:1}} transition={{duration:.75,ease:[.22,1,.36,1]}}>
        <img loading="eager" fetchPriority="high" decoding="async" src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1400&q=90" alt="Gold jewellery editorial"/>
        <div className="hero-image-label"><span>01 / 03</span><span>THE ART OF ADORNMENT</span></div>
      </motion.div>
      <div className="hero-side">TIMELESS PIECES · MODERN ROMANCE</div>
      <div className="hero-bottom">SCROLL TO DISCOVER <span>↓</span></div>
    </section>

    <section className="intro" id="collections">
      <motion.div {...fade}><span className="section-kicker">THE MAISON PHILOSOPHY</span><h2>Not just jewellery.<br/><em>A feeling you keep.</em></h2></motion.div>
      <motion.p {...fade}>For slow mornings, spontaneous evenings, and everything in between. Discover pieces that feel like they were always meant to be yours.</motion.p>
    </section>

    <section className="collections">
      <motion.a {...fade} href="/collections" className="collection-card collection-large">
        <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1400&q=85" alt="Curated jewellery"/>
        <div className="collection-overlay"><span>01 — CURATED WITH LOVE</span><h3>The Everyday<br/><em>Edit</em></h3><span className="circle-arrow"><ArrowUpRight/></span></div>
      </motion.a>
      <motion.a {...fade} href="/collections" className="collection-card collection-small">
        <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1000&q=85" alt="Statement jewellery"/>
        <div className="collection-overlay"><span>02 — FOR THE EXTRAORDINARY</span><h3>Little<br/><em>Statements</em></h3><span className="circle-arrow"><ArrowUpRight/></span></div>
      </motion.a>
    </section>

    <section className="pieces" id="pieces">
      <motion.div {...fade} className="section-heading"><div><span className="section-kicker">HANDPICKED FOR YOU</span><h2>Currently <em>adored.</em></h2></div><span className="heading-note">A FEW OF OUR FAVOURITES —</span></motion.div>
      <div className="product-grid">
        {pieces.map((p,i)=><article key={p.id} className="product">
          <div className="product-image"><img loading="lazy" decoding="async" src={p.image} alt={p.name}/><span className="product-index">{p.id}</span><a aria-label={`Enquire about ${p.name}`} href={whatsapp(`${p.name} (Product ${p.id})`)} target="_blank" rel="noreferrer" className="product-heart"><Heart size={18}/></a></div>
          <div className="product-info"><div><span>{p.type}</span><h3>{p.name}</h3></div></div>
          <a className="product-link" href={whatsapp(`${p.name} (Product ${p.id})`)} target="_blank" rel="noreferrer">Enquire on WhatsApp <ArrowUpRight size={15}/></a>
        </article>)}
      </div>
    </section>

    <section className="story" id="story">
      <div className="story-photo"><img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=85" alt="Jewellery close-up"/></div>
      <motion.div {...fade} className="story-copy"><span className="section-kicker">A NOTE FROM THE MAISON</span><h2>Made for the<br/><em>little things.</em></h2><p>Some pieces are more than accessories. They're the finishing touch before a special evening, the everyday favourite, the tiny detail that makes you feel like yourself.</p><p>We believe beauty should feel personal, effortless, and a little magical.</p><a href={whatsapp("Maison Elle jewellery")} target="_blank" rel="noreferrer" className="text-link">Find your piece <ArrowRight size={18}/></a></motion.div>
    </section>

    <section className="closing"><span className="section-kicker">SOMETHING BEAUTIFUL AWAITS</span><h2>Let's find your<br/><em>next favourite.</em></h2><a className="primary-button" href={whatsapp("your jewellery collection")} target="_blank" rel="noreferrer">Chat with us on WhatsApp <ArrowUpRight size={17}/></a></section>

  </main>;
}
