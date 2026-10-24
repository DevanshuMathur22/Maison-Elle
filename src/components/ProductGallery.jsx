"use client";
import {useEffect,useState} from "react";
import NetworkImage from "@/components/NetworkImage";
import {ChevronLeft,ChevronRight,Maximize2,X} from "lucide-react";

export default function ProductGallery({product}){
  const images=[...new Set([product.image,...(Array.isArray(product.images)?product.images:[])].filter(Boolean))];
  const [index,setIndex]=useState(0);
  const [zoom,setZoom]=useState(false);
  const [start,setStart]=useState(null);
  const next=()=>setIndex(i=>(i+1)%images.length);
  const prev=()=>setIndex(i=>(i-1+images.length)%images.length);
  useEffect(()=>{
    if(!zoom)return;
    const key=e=>{
      if(e.key==="Escape")setZoom(false);
      if(e.key==="ArrowRight")setIndex(i=>(i+1)%images.length);
      if(e.key==="ArrowLeft")setIndex(i=>(i-1+images.length)%images.length);
    };
    document.addEventListener("keydown",key);
    const old=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return ()=>{document.removeEventListener("keydown",key);document.body.style.overflow=old;};
  },[zoom,images.length]);
  const swipe=e=>{
    if(start===null)return;
    const delta=e.changedTouches[0].clientX-start;
    if(Math.abs(delta)>45&&images.length>1)(delta<0?next:prev)();
    setStart(null);
  };
  return <div className="min-w-0">
    <div className="relative aspect-[4/5] overflow-hidden bg-[#302824]"
      onTouchStart={e=>setStart(e.touches[0].clientX)}
      onTouchEnd={swipe}>
      <NetworkImage src={images[index]} alt={`${product.name} — image ${index+1}`} fill unoptimized priority sizes="(max-width: 800px) 100vw, 55vw" className="object-contain"/>
      <button type="button" onClick={()=>setZoom(true)} aria-label="Zoom product image" className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#211b18]/85 text-[#e3d6c4]"><Maximize2 size={19}/></button>
      {images.length>1&&<>
        <button type="button" onClick={prev} aria-label="Previous image" className="absolute bottom-5 left-4 z-10 rounded-full bg-[#211b18]/85 p-3 text-[#e3d6c4]"><ChevronLeft/></button>
        <button type="button" onClick={next} aria-label="Next image" className="absolute bottom-5 right-4 z-10 rounded-full bg-[#211b18]/85 p-3 text-[#e3d6c4]"><ChevronRight/></button>
      </>}
    </div>
    {images.length>1&&<div className="mt-4 flex gap-3">
      {images.map((src,i)=><button key={src} type="button" onClick={()=>setIndex(i)} aria-label={`View image ${i+1}`} aria-pressed={index===i} className={`relative h-20 w-16 shrink-0 overflow-hidden border-2 ${index===i?"border-[#c5a572]":"border-transparent"}`}>
        <NetworkImage src={src} alt="" fill unoptimized loading="lazy" sizes="64px" className="object-cover"/>
      </button>)}
    </div>}
    {zoom&&<div role="dialog" aria-modal="true" aria-label={`${product.name} image viewer`} className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#110e0c]/98 p-5">
      <button type="button" onClick={()=>setZoom(false)} aria-label="Close image viewer" className="absolute right-5 top-5 z-20 rounded-full bg-[#302824] p-3 text-white"><X/></button>
      <div className="relative h-[80vh] w-full max-w-5xl" onTouchStart={e=>setStart(e.touches[0].clientX)} onTouchEnd={swipe}>
        <NetworkImage src={images[index]} alt={`${product.name} enlarged`} fill unoptimized sizes="100vw" className="object-contain"/>
      </div>
      {images.length>1&&<>
        <button type="button" onClick={prev} aria-label="Previous enlarged image" className="absolute bottom-6 left-6 z-20 rounded-full bg-[#302824] p-3 text-white"><ChevronLeft/></button>
        <span className="absolute bottom-9 text-xs text-[#e3d6c4]">{index+1} / {images.length}</span>
        <button type="button" onClick={next} aria-label="Next enlarged image" className="absolute bottom-6 right-6 z-20 rounded-full bg-[#302824] p-3 text-white"><ChevronRight/></button>
      </>}
    </div>}
  </div>;
}
