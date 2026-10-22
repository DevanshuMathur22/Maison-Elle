"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { enquiry } from "@/data/jewellery";

const links = [
  ["Home","/"],
  ["Collections","/collections"],
  ["Our Story","/our-story"],
  ["Contact","/contact"]
];

export default function SiteShell({children}) {
  const [open,setOpen] = useState(false);
  return <>
    <header className="site-nav">
      <Link href="/" className="brand">MAISON <span>ÉLLE</span><small>OBJECTS OF AFFECTION</small></Link>
      <nav className={open ? "site-links visible" : "site-links"}>
        {links.map(([name,path])=><Link key={path} href={path} onClick={()=>setOpen(false)}>{name}</Link>)}
      </nav>
      <a className="site-enquire" href={enquiry()} target="_blank" rel="noopener noreferrer">Enquire <ArrowUpRight size={16}/></a>
      <button className="site-menu" aria-label="Toggle navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    </header>
    {children}
    <footer className="site-footer">
      <div><Link href="/" className="brand">MAISON <span>ÉLLE</span><small>OBJECTS OF AFFECTION</small></Link><p>Little treasures. Lasting feelings.</p></div>
      <div className="site-footer-links">{links.map(([name,path])=><Link key={path} href={path}>{name}</Link>)}</div>
      <p className="site-footer-note">Thoughtfully curated jewellery. Prices available on enquiry.</p>
    </footer>
  </>;
}
