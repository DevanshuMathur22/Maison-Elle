"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X, Sparkles } from "lucide-react";
import { enquiry } from "@/data/jewellery";

const links = [
  { name:"Home", href:"/" },
  { name:"Collections", href:"/collections" },
  { name:"Our Story", href:"/our-story" },
  { name:"Contact", href:"/contact" }
];

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const [open,setOpen] = useState(false);
  const [scrolled,setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 35);
    update();
    window.addEventListener("scroll",update,{passive:true});
    return () => window.removeEventListener("scroll",update);
  },[]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  },[open]);

  useEffect(() => { setOpen(false); },[pathname]);

  return <>
    <div className={`lux-nav-wrap ${scrolled ? "is-scrolled" : ""}`}>
      <motion.header
        className="lux-nav"
        initial={{opacity:0,y:-25}}
        animate={{opacity:1,y:0}}
        transition={{duration:.7,ease:"easeOut"}}
      >
        <Link prefetch={true} href="/" className="lux-logo" onClick={()=>setOpen(false)}>
          <span>MAISON <em>ÉLLE</em></span>
          <small>OBJECTS OF AFFECTION</small>
        </Link>

        <nav className="lux-links" aria-label="Main navigation">
          {links.map(link=>{
            const active = link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
            return <Link prefetch={true}
              key={link.href}
              href={link.href}
              className={active ? "lux-link active" : "lux-link"}
              aria-current={active ? "page" : undefined}
            >
              {link.name}
              {active && <motion.span layoutId="nav-active" className="lux-active-line"/>}
            </Link>;
          })}
        </nav>

        <div className="lux-actions">
          <a href={enquiry()} target="_blank" rel="noopener noreferrer" className="lux-whatsapp">
            <Sparkles size={15}/>
            <span>Let's Connect</span>
            <ArrowUpRight size={16}/>
          </a>
          <button
            className="lux-menu-button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="lux-mobile-navigation"
            onClick={()=>setOpen(v=>!v)}
          >
            {open ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </motion.header>
    </div>

    <AnimatePresence>
      {open && <motion.div
        id="lux-mobile-navigation"
        className="lux-mobile-panel"
        initial={{opacity:0,y:-15}}
        animate={{opacity:1,y:0}}
        exit={{opacity:0,y:-15}}
        transition={{duration:.25}}
      >
        <span className="lux-mobile-caption">EXPLORE THE MAISON</span>
        <nav aria-label="Mobile navigation">
          {links.map((link,i)=><motion.div
            key={link.href}
            initial={{opacity:0,x:-15}}
            animate={{opacity:1,x:0}}
            transition={{delay:i*.06}}
          >
            <Link prefetch={true} href={link.href} onClick={()=>setOpen(false)}>
              <span>{link.name}</span><ArrowUpRight size={20}/>
            </Link>
          </motion.div>)}
        </nav>
        <div className="lux-mobile-bottom">LITTLE TREASURES · LASTING FEELINGS</div>
      </motion.div>}
    </AnimatePresence>

    {children}

    <footer className="site-footer">
      <div>
        <Link prefetch={true} href="/" className="brand">MAISON <span>ÉLLE</span><small>OBJECTS OF AFFECTION</small></Link>
        <p>Little treasures. Lasting feelings.</p>
      </div>
      <div className="site-footer-links">
        {links.map(link=><Link prefetch={true} key={link.href} href={link.href}>{link.name}</Link>)}
      </div>
      <p className="site-footer-note">Thoughtfully curated jewellery. Prices available on enquiry.</p>
    </footer>
  </>;
}
