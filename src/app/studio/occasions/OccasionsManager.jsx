"use client";
import Image from "next/image";
import Link from "next/link";
import {useEffect,useState} from "react";
import {ArrowLeft,Plus,Save,ImagePlus,Trash2} from "lucide-react";

const empty={slug:"",name:"",subtitle:"",description:"",status:"draft",order:0,productSlugs:[]};
const field="w-full rounded-lg border border-[#c5a572]/30 bg-[#211b18] px-3 py-3 text-sm text-[#e3d6c4] outline-none focus:border-[#c5a572]";
const slugify=s=>s.toLowerCase().normalize("NFKD").replace(/[\\u0300-\\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70);

export default function OccasionsManager(){
  const [items,setItems]=useState([]);
  const [products,setProducts]=useState([]);
  const [form,setForm]=useState(null);
  const [saved,setSaved]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");

  async function load(){
    const [a,b]=await Promise.all([
      fetch("/api/studio/occasions",{cache:"no-store"}),
      fetch("/api/studio/products",{cache:"no-store"})
    ]);
    if(!a.ok||!b.ok)throw new Error("Unable to load Studio data");
    setItems((await a.json()).occasions||[]);
    setProducts((await b.json()).products||[]);
  }
  useEffect(()=>{Promise.resolve().then(()=>load()).catch(e=>setMessage(e.message));},[]);

  function edit(item){
    setForm({
      slug:item.slug,name:item.name,subtitle:item.subtitle||"",
      description:item.description||"",status:item.status,
      order:item.order||0,productSlugs:item.productSlugs||[]
    });
    setSaved(true);
    setMessage("");
  }

  async function save(status){
    if(!form?.name.trim())return setMessage("Enter occasion name");
    setBusy(true);
    try{
      const payload={...form,status,slug:form.slug||slugify(form.name)};
      const res=await fetch("/api/studio/occasions",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||"Save failed");
      setForm(payload);
      setSaved(true);
      await load();
      setMessage(status==="published"?"Occasion published":"Draft saved");
    }catch(e){setMessage(e.message)}
    finally{setBusy(false)}
  }

  async function upload(file){
    if(!file||!form?.slug||!saved)return;
    setBusy(true);
    try{
      const body=new FormData();
      body.append("slug",form.slug);
      body.append("file",file);
      const res=await fetch("/api/studio/occasions/upload",{method:"POST",body});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||"Upload failed");
      await load();
      setMessage("Cover image uploaded");
    }catch(e){setMessage(e.message)}
    finally{setBusy(false)}
  }

  async function remove(item){
    if(!confirm(`Delete occasion "${item.name}"? Products will not be deleted.`))return;
    setBusy(true);
    try{
      const res=await fetch("/api/studio/occasions",{
        method:"DELETE",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({slug:item.slug})
      });
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||"Delete failed");
      if(form?.slug===item.slug)setForm(null);
      await load();
      setMessage("Occasion deleted; products preserved");
    }catch(e){setMessage(e.message)}
    finally{setBusy(false)}
  }

  const current=items.find(x=>x.slug===form?.slug);
  return <main className="min-h-screen bg-[#211b18] px-4 pb-24 text-[#e3d6c4] sm:px-6">
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#c5a572]/20 py-6">
        <div>
          <Link href="/studio" className="inline-flex items-center gap-2 text-xs text-[#c5a572]"><ArrowLeft size={15}/> Collection Studio</Link>
          <h1 className="mt-4 font-serif text-4xl italic">Manage Occasions</h1>
          <p className="mt-2 text-xs text-[#b7b2ac]">Curate occasions, covers and existing products.</p>
        </div>
        <button disabled={busy} onClick={()=>{setForm({...empty});setSaved(false);setMessage("");}}
          className="inline-flex items-center gap-2 rounded-lg bg-[#c5a572] px-5 py-3 text-sm text-[#211b18]">
          <Plus size={16}/> Add Occasion
        </button>
      </header>

      {message&&<div role="status" aria-live="polite"
        className="fixed bottom-5 left-4 right-4 z-[100] mx-auto flex max-w-lg items-center gap-3 rounded-xl border border-[#c5a572]/50 bg-[#302824] p-4 text-sm text-[#e3d6c4] shadow-2xl">
        <span className="flex-1 break-words">{message}</span>
        <button type="button" onClick={()=>setMessage("")}
          aria-label="Dismiss notification"
          className="rounded-lg border border-[#c5a572]/30 px-3 py-1 text-xs">
          Close
        </button>
      </div>}

      {form&&<section className="mt-7 space-y-5 rounded-2xl border border-[#c5a572]/25 bg-[#302824] p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl italic">{saved?"Edit Occasion":"New Occasion"}</h2>
          <button onClick={()=>setForm(null)} className="text-xs text-[#c5a572]">Close</button>
        </div>
        <label className="block text-xs">Occasion name
          <input className={"mt-2 "+field} maxLength={100} value={form.name}
            onChange={e=>setForm({...form,name:e.target.value,slug:saved?form.slug:slugify(e.target.value)})}/>
        </label>
        <label className="block text-xs">Subtitle
          <input className={"mt-2 "+field} maxLength={160} value={form.subtitle}
            onChange={e=>setForm({...form,subtitle:e.target.value})}/>
        </label>
        <label className="block text-xs">Description
          <textarea className={"mt-2 "+field} rows={3} maxLength={800} value={form.description}
            onChange={e=>setForm({...form,description:e.target.value})}/>
        </label>
        <label className="block text-xs">Display order
          <input className={"mt-2 "+field} type="number" min="0" max="9999" value={form.order}
            onChange={e=>setForm({...form,order:Number(e.target.value)})}/>
        </label>
        <div className="rounded-xl border border-[#c5a572]/20 p-4">
          <p className="mb-3 text-sm">Cover image</p>
          {current?.coverImage&&<Image src={current.coverImage} alt="Occasion cover" className="mb-4 h-44 w-full max-w-sm rounded-lg object-cover" width={900} height={1125} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized/>}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#c5a572]/40 px-4 py-3 text-xs">
            <ImagePlus size={16}/> {current?.coverImage?"Replace cover":"Upload cover"}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only"
              disabled={busy||!saved} onChange={e=>{upload(e.target.files?.[0]);e.target.value="";}}/>
          </label>
          {!saved&&<p className="mt-2 text-xs text-[#b7b2ac]">Save draft first to upload cover.</p>}
        </div>
        <div>
          <p className="mb-3 text-sm">Assign products ({form.productSlugs.length})</p>
          <div className="grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">
            {products.filter(p=>p.status==="published"&&p.image).map(p=><label key={p.slug}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#c5a572]/15 p-2 text-xs">
              <input type="checkbox" checked={form.productSlugs.includes(p.slug)}
                onChange={e=>setForm({...form,productSlugs:e.target.checked?[...form.productSlugs,p.slug]:form.productSlugs.filter(x=>x!==p.slug)})}/>
              <Image src={p.image} alt="" className="h-12 w-12 rounded object-cover" width={900} height={1125} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized/>
              <span>{p.name}</span>
            </label>)}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button disabled={busy||!form.name.trim()} onClick={()=>save("draft")}
            className="inline-flex items-center gap-2 rounded-lg border border-[#c5a572]/40 px-5 py-3 text-sm">
            <Save size={16}/> Save Draft
          </button>
          <button disabled={busy||!form.name.trim()||!current?.coverImage} onClick={()=>save("published")}
            className="rounded-lg bg-[#c5a572] px-6 py-3 text-sm text-[#211b18]">Publish Occasion</button>
        </div>
      </section>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item=><article key={item.slug} className="overflow-hidden rounded-xl border border-[#c5a572]/20 bg-[#302824]">
          {item.coverImage?<Image src={item.coverImage} alt={item.name} className="aspect-[16/10] w-full object-cover" width={900} height={1125} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized/>:
            <div className="flex aspect-[16/10] items-center justify-center text-[#b7b2ac]">No cover image</div>}
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-widest text-[#c5a572]">{item.status} · Order {item.order}</p>
            <h3 className="mt-2 font-serif text-2xl">{item.name}</h3>
            <p className="mt-2 text-xs text-[#b7b2ac]">{item.productSlugs?.length||0} assigned products</p>
            <div className="mt-5 flex gap-2">
              <button disabled={busy} onClick={()=>edit(item)} className="flex-1 rounded border border-[#c5a572]/30 px-3 py-2 text-xs">Edit</button>
              <button disabled={busy} onClick={()=>remove(item)} aria-label={`Delete ${item.name}`}
                className="rounded border border-red-400/30 px-3 py-2 text-red-300"><Trash2 size={15}/></button>
            </div>
          </div>
        </article>)}
      </div>
    </div>
  </main>;
}
