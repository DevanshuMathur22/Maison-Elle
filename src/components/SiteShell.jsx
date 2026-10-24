"use client";

import Link from "next/link";
import ScrollToTop from "./ScrollToTop";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X, Sparkles } from "lucide-react";
import { enquiry } from "@/data/jewellery";

const links = [
  { name:"Home", href:"/" },
  { name:"Collections", href:"/collections" },
  { name:"Occasions", href:"/occasions" },
  { name:"Our Story", href:"/our-story" },
  { name:"Contact", href:"/contact" }
];

function VrindaFloatingCTA() {
  const [vrindaFloatingVisible,setVrindaFloatingVisible]=useState(true);
  const previousScroll=useRef(0);

  useEffect(()=>{
    previousScroll.current=window.scrollY;

    const onScroll=()=>{
      const current=window.scrollY;
      const difference=current-previousScroll.current;

      if(Math.abs(difference)>5){
        setVrindaFloatingVisible(current<100||difference<0);
        previousScroll.current=current;
      }
    };

    window.addEventListener("scroll",onScroll,{passive:true});
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);

  return (
    <aside
      className="vrinda-floating-cta"
      aria-label="Quick actions"
      style={{
        position:"fixed",
        top:"auto",
        bottom:"24px",
        right:"14px",
        left:"auto",
        transform:vrindaFloatingVisible?"translateY(0)":"translateY(110px)",
        opacity:vrindaFloatingVisible?1:0,
        pointerEvents:vrindaFloatingVisible?"auto":"none",
        zIndex:999,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        gap:"10px",
        width:"auto",
        height:"auto",
        transition:"transform .25s ease, opacity .25s ease"
      }}
    >
      {[
        {
          label:"Enquire on WhatsApp",
          href:enquiry(),
          icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20.5l1.5-5.1a8.5 8.5 0 1 1 16-3.9Z"/><path d="M8.5 8.5c.4 3.1 2.9 5.6 6 6l1.4-1.4 2 1"/></svg>
        },
        {
          label:"Follow on Instagram",
          href:"https://www.instagram.com/vrindajewels8/",
          icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>
        },
        {
          label:"Explore Collections",
          href:"/collections",
          icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg>
        }
      ].map(item=>(
        <a
          key={item.label}
          href={item.href}
          target={item.href.startsWith("http")?"_blank":undefined}
          rel={item.href.startsWith("http")?"noopener noreferrer":undefined}
          aria-label={item.label}
          title={item.label}
          style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            width:"42px",
            height:"42px",
            flexShrink:0,
            border:"1px solid #c5a572",
            borderRadius:"50%",
            background:"#302824",
            color:"#c5a572",
            boxShadow:"0 5px 20px #0006"
          }}
        >
          <span style={{display:"flex",width:"20px",height:"20px"}}>
            {item.icon}
          </span>
        </a>
      ))}
    </aside>
  );
}

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
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = event => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown",onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown",onKeyDown);
    };
  },[open]);

  

  if (pathname.startsWith("/studio")) return <><ScrollToTop/>
    {children}</>;

  return <>
    <div className={`lux-nav-wrap ${scrolled ? "is-scrolled" : ""}`}>
      <motion.header
        className="lux-nav"
        initial={{opacity:0,y:-25}}
        animate={{opacity:1,y:0}}
        transition={{duration:.7,ease:"easeOut"}}
      >
        <Link prefetch={true} href="/" className="lux-logo" onClick={()=>setOpen(false)}>
          <span>VRINDA <em>ÉLLE</em></span>
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
            <span>Let&apos;s Connect</span>
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
        <span className="lux-mobile-caption">EXPLORE VRINDA ÉLLE</span>
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

    <VrindaFloatingCTA />
      <footer className="site-footer">
      <div>
        <Link prefetch={true} href="/" className="brand">VRINDA <span>ÉLLE</span><small>OBJECTS OF AFFECTION</small></Link>
        <p>Little treasures. Lasting feelings.</p>
        <div className="vrinda-follow-cta">
          <span className="vrinda-follow-kicker">STAY INSPIRED</span>
          <h3>Follow Our <em>Journey.</em></h3>
          <p>Discover new collections, jewellery inspiration and little moments of elegance.</p>
          <a href="https://www.instagram.com/vrindajewels8/" target="_blank" rel="noopener noreferrer">
            Follow VRINDA ÉLLE <ArrowUpRight size={16}/>
          </a>
        </div>
        <div className="vrinda-social-links" aria-label="Follow Vrinda Élle">
          <a href="https://www.instagram.com/vrindajewels8/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1" fill="currentColor" stroke="none"/></svg></a>
          <a href="https://www.facebook.com/share/1DrCpuq1DN/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8.5h3l.5-4h-3.5V7c0-1.2.4-2 2-2H17V1.4A23 23 0 0 0 14.3 1C11.5 1 9.5 2.7 9.5 6v3.5H7v4h2.5V22z"/></svg></a>
          <a href="https://youtube.com/@vrindajewllerycreation?si=8tz5j7KpUwi0nuqn" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"/></svg></a>
        </div>
      </div>
      <div className="site-footer-links">
        {links.map(link=><Link prefetch={true} key={link.href} href={link.href}>{link.name}</Link>)}
      </div>
      <p className="site-footer-note">Thoughtfully curated jewellery. Prices available on enquiry.</p>
    </footer>
  </>;
}
