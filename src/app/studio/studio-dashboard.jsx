"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import {useRouter} from "next/navigation";
import {Check,ChevronDown,ImagePlus,LoaderCircle,LogOut,Pencil,Plus,Save,Search,Star,X} from "lucide-react";

const categories=["Festive Décor","Hair Accessories","Floral Jewellery","Pearl Jewellery","Accessories"];
const blank={slug:"",code:"",name:"",category:categories[0],description:"",material:"",status:"draft",featured:false};
const field="w-full min-h-10 rounded-lg border border-[#b99a6e]/25 bg-[#211b18] px-3 py-2 text-sm text-[#f2e7d7] outline-none focus:border-[#c5a572]";
const btn="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40";

const slugify=s=>s.toLowerCase().normalize("NFKD").replace(/[\\u0300-\\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70);

function nextCode(products){
  const used=new Set(products.map(p=>p.code?.toUpperCase()));
  let n=12;
  for(const p of products){
    const m=/^CJ-(\\d+)$/i.exec(p.code||"");
    if(m)n=Math.max(n,Number(m[1])+1);
  }
  while(used.has(`CJ-${String(n).padStart(3,"0")}`))n++;
  return `CJ-${String(n).padStart(3,"0")}`;
}

function uniqueSlug(name,products){
  const base=slugify(name)||"new-product";
  const used=new Set(products.map(p=>p.slug));
  let value=base,n=2;
  while(used.has(value))value=`${base.slice(0,65)}-${n++}`;
  return value;
}

export default function StudioDashboard({user}){
  const router=useRouter();
  const editor=useRef(null);
  const [products,setProducts]=useState([]);
  const [stats,setStats]=useState({});
  const [form,setForm]=useState(null);
  const [editing,setEditing]=useState(false);
  const [saved,setSaved]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  const [advanced,setAdvanced]=useState(false);
  const [storage,setStorage]=useState(null);

  async function load(){
    const r=await fetch("/api/studio/products",{cache:"no-store"});
    if(!r.ok)throw new Error("Unable to load products");
    const data=await r.json();
    setProducts(data.products||[]);
    setStats(data.counts||{});
    fetch("/api/studio/storage",{cache:"no-store"})
      .then(r=>r.ok?r.json():null)
      .then(setStorage).catch(()=>{});
    return data.products||[];
  }

  useEffect(()=>{load().catch(e=>setMessage(e.message));},[]);

  const active=stats.active??products.filter(p=>p.status!=="archived").length;
  const code=useMemo(()=>nextCode(products),[products]);
  const current=products.find(p=>p.slug===form?.slug);
  const images=current?.images||(current?.image?[current.image]:[]);
  const filtered=products.filter(p=>
    (filter==="all"||p.status===filter)&&
    `${p.name} ${p.code} ${p.category}`.toLowerCase().includes(search.toLowerCase())
  );

  function scrollEditor(){
    requestAnimationFrame(()=>editor.current?.scrollIntoView({behavior:"smooth",block:"start"}));
  }

  function add(){
    if(active>=40){
      setMessage("Maximum 40 active products allowed.");
      return;
    }
    setForm({...blank,code});
    setEditing(false);
    setSaved(false);
    setAdvanced(false);
    setMessage("");
    scrollEditor();
  }

  function edit(p){
    setForm({
      slug:p.slug,code:p.code,name:p.name,category:p.category,
      description:p.description||"",material:p.material||"",
      status:p.status,featured:!!p.featured
    });
    setEditing(true);
    setSaved(true);
    setAdvanced(false);
    setMessage("");
    scrollEditor();
  }

  function changeName(name){
    setForm(prev=>({...prev,name,slug:editing?prev.slug:uniqueSlug(name,products)}));
    setSaved(false);
  }

  async function save(status){
    if(!form?.name.trim())return setMessage("Enter product name.");
    if(status==="published"&&!images.length)
      return setMessage("Save Draft and upload a photo before publishing.");

    setBusy(true);
    setMessage("");
    try{
      const payload={
        slug:form.slug||uniqueSlug(form.name,products),
        code:form.code,
        name:form.name.trim(),
        category:form.category,
        description:form.description,
        material:form.material,
        status,
        featured:status==="published"&&form.featured
      };
      const r=await fetch("/api/studio/products",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||"Save failed");
      await load();
      setForm(payload);
      setEditing(true);
      setSaved(true);
      setMessage(status==="published"?"Product published successfully.":"Draft saved successfully.");
    }catch(e){setMessage(e.message)}
    finally{setBusy(false)}
  }

  
async function preparePhoto(file){
  if(!file)return null;
  if(file.size>5*1024*1024)
    throw new Error("Maximum photo size is 5 MB.");

  const heic=/\\.(heic|heif)$/i.test(file.name)||
    ["image/heic","image/heif","image/heic-sequence","image/heif-sequence"].includes(file.type);

  if(!heic)return file;

  const makeFile=blob=>{
    if(!blob||blob.size<100)throw new Error("Converted photo is empty.");
    if(blob.size>5*1024*1024)throw new Error("Converted photo exceeds 5 MB.");
    return new File([blob],file.name.replace(/\\.(heic|heif)$/i,"")+".jpg",{type:"image/jpeg"});
  };

  try{
    const bitmap=await createImageBitmap(file);
    try{
      const canvas=document.createElement("canvas");
      const scale=Math.min(1,1400/Math.max(bitmap.width,bitmap.height));
      canvas.width=Math.max(1,Math.round(bitmap.width*scale));
      canvas.height=Math.max(1,Math.round(bitmap.height*scale));
      canvas.getContext("2d").drawImage(bitmap,0,0,canvas.width,canvas.height);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",0.82));
      return makeFile(blob);
    }finally{
      bitmap.close();
    }
  }catch(nativeError){
    try{
      const {default:heic2any}=await import("heic2any");
      const result=await heic2any({blob:file,toType:"image/jpeg",quality:0.75});
      return makeFile(Array.isArray(result)?result[0]:result);
    }catch(e){
      throw new Error("HEIC conversion unsupported in this browser: "+(e?.message||"Unknown error"));
    }
  }
}

async function upload(file,replaceIndex=null){
    if(!file)return;
    if(!form?.slug||(!editing&&!saved)){
      setMessage("Save product details before uploading.");
      return;
    }
    if(busy)return;
    setBusy(true);
    setMessage("Preparing photo...");
    try{
      const prepared=await preparePhoto(file);
      setMessage("Uploading photo...");
      const data=new FormData();
      data.append("slug",form.slug);
      data.append("file",prepared);
      if(replaceIndex!==null)data.append("replaceIndex",String(replaceIndex));
      const r=await fetch("/api/studio/products/upload",{method:"POST",body:data});
      const result=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(result.error||`Upload failed (${r.status})`);
      await load();
      setMessage("Photo uploaded successfully.");
    }catch(e){
      console.error("Studio photo upload:",e);
      setMessage(e?.message||"Photo upload failed. Please try again.");
    }finally{
      setBusy(false);
    }
  }

  async function removePhoto(url){
    if(!form||!saved||busy)return;
    if(!window.confirm("Remove this photo from the product? The stored file will be retained for safety."))return;
    setBusy(true);
    setMessage("");
    try{
      const r=await fetch("/api/studio/products/images",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({slug:form.slug,url})
      });
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||"Unable to remove photo");
      await load();
      setMessage("Photo removed from product. Stored file retained.");
    }catch(e){setMessage(e.message)}
    finally{setBusy(false)}
  }

  async function deleteProduct(p){
    if(busy)return;
    if(!window.confirm(
      `Delete "${p.name}" (${p.code})?\\n\\n`+
      "This permanently deletes the product. This action cannot be undone."
    ))return;
    setBusy(true);
    setMessage("Deleting product...");
    try{
      const r=await fetch("/api/studio/products",{
        method:"DELETE",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({slug:p.slug})
      });
      const result=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(result.error||"Delete failed");
      if(form?.slug===p.slug){
        setForm(null);
        setEditing(false);
        setSaved(false);
      }
      await load();
      const pending=result.imagesCleanup?.pending||0;
      const retained=result.imagesCleanup?.retained||0;
      const deleted=result.imagesCleanup?.deleted||0;
      setMessage(pending
        ? `Product ${p.code} removed. ${pending} photo cleanup(s) pending retry.`
        : `Product ${p.code} removed. ${deleted} uploaded photo(s) deleted, ${retained} protected.`);
    }catch(e){
      setMessage(e?.message||"Delete failed");
    }finally{
      setBusy(false);
    }
  }

  async function updateProduct(p,changes){
    if(busy)return;
    setBusy(true);
    setMessage("");
    try{
      const payload={
        slug:p.slug,code:p.code,name:p.name,category:p.category,
        description:p.description||"",material:p.material||"",
        status:p.status,featured:!!p.featured,...changes
      };
      if(payload.status!=="published")payload.featured=false;
      const r=await fetch("/api/studio/products",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||"Update failed");
      await load();
      if(form?.slug===p.slug){
        setForm(payload);
        setSaved(true);
      }
      setMessage("Product updated successfully.");
    }catch(e){setMessage(e.message)}
    finally{setBusy(false)}
  }

  async function logout(){
    const r=await fetch("/api/studio/logout",{method:"POST"});
    if(r.ok){
      router.replace("/studio/login");
      router.refresh();
    }
  }

  return <main className="min-h-screen bg-[#211b18] px-4 pb-20 text-[#e3d6c4] sm:px-6">
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c5a572]/20 py-4 sm:py-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#c5a572]">VRINDA ÉLLE · PRIVATE STUDIO</p>
          <h1 className="mt-1 font-serif text-2xl italic sm:text-3xl">Collection Studio</h1>
        </div>
        <button onClick={logout} className={btn+" border border-[#c5a572]/30"}>
          <LogOut size={15}/> Sign out
        </button>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {[
          ["Active",active,"/ 40"],
          ["Published",stats.published??0,""],
          ["Drafts",stats.drafts??0,""],
          ["Featured",stats.featured??0,"/ 6"]
        ].map(([label,value,max])=><div key={label} className="rounded-xl border border-[#c5a572]/15 bg-[#302824] px-4 py-3">
          <p className="text-[11px] text-[#b7b2ac]">{label}</p>
          <p className="mt-1 font-serif text-2xl">{value}<span className="ml-1 font-sans text-xs text-[#b7b2ac]">{max}</span></p>
        </div>)}
      </div>

      {storage&&<div className="mt-4 rounded-xl border border-[#c5a572]/20 bg-[#302824] p-4">
        <div className="flex flex-wrap justify-between gap-2 text-xs">
          <span>Daily uploads: {storage.today}/{storage.maxDaily}</span>
          <span>Tracked uploads: {(storage.bytes/1048576).toFixed(2)} / {(storage.maxBytes/1048576).toFixed(0)} MB</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#211b18]">
          <div className="h-full bg-[#c5a572]" style={{width:`${Math.min(100,storage.bytes/storage.maxBytes*100)}%`}}/>
        </div>
        <p className="mt-2 text-[11px] text-[#b7b2ac]">{storage.note}</p>
      </div>}

      <div className="mt-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl italic sm:text-3xl">Your Collections</h2>
          <p className="mt-1 text-xs text-[#b7b2ac]">40 products · 2 photos each · 6 featured</p>
        </div>
        <button onClick={add} disabled={busy||active>=40} className={btn+" bg-[#c5a572] text-[#211b18]"}>
          <Plus size={16}/> Add Product
        </button>
      </div>

      {message&&<div role="alert" className="fixed bottom-5 left-4 right-4 z-[100] mx-auto flex max-w-lg items-center gap-3 rounded-xl border border-[#c5a572]/50 bg-[#302824] p-4 text-sm text-[#f2e7d7] shadow-2xl">
          <span className="flex-1 break-words">{message}</span>
          <button type="button" aria-label="Close notification" onClick={()=>setMessage("")} className="rounded p-1 hover:bg-white/10"><X size={18}/></button>
        </div>}

      {form&&<section ref={editor} className="mx-auto mt-6 max-w-[880px] scroll-mt-5 overflow-hidden rounded-2xl border border-[#c5a572]/25 bg-[#302824]">
        <div className="flex items-center justify-between border-b border-[#c5a572]/15 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[.2em] text-[#c5a572]">PRODUCT EDITOR</p>
            <h3 className="mt-1 font-serif text-2xl italic">{editing?"Edit Product":"New Product"}</h3>
          </div>
          <button aria-label="Close editor" onClick={()=>setForm(null)} className="p-2 text-[#b7b2ac]"><X size={19}/></button>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          <label className="block text-xs">Product name *
            <input autoFocus value={form.name} maxLength={120}
              onChange={e=>changeName(e.target.value)}
              placeholder="e.g. Pearl Floral Jewellery Set"
              className={"mt-1.5 "+field}/>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs">Category
              <select className={"mt-1.5 "+field} value={form.category}
                onChange={e=>{setForm({...form,category:e.target.value});setSaved(false);}}>
                {categories.map(c=><option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="text-xs">Product code · automatic
              <input readOnly value={form.code} className={"mt-1.5 "+field+" opacity-80"}/>
            </label>
          </div>

          <div className="rounded-xl border border-dashed border-[#c5a572]/30 bg-[#211b18]/60 p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <ImagePlus size={21} className="text-[#c5a572]"/>
              <div className="flex-1">
                <p className="text-sm">Product photos</p>
                <p className="text-xs text-[#b7b2ac]">Maximum 5 MB per photo · 2 photos · JPG, PNG, WebP, HEIC, HEIF</p>
              </div>
              <span className="text-xs text-[#c5a572]">{images.length}/2</span>
            </div>
            {!!images.length&&<div className="mt-3 flex flex-wrap gap-2">
              {images.map((src,i)=><div key={src} className="w-24">
                <img src={src} alt={`Product ${i+1}`} className="h-20 w-24 rounded-lg object-cover"/>
                <div className="mt-1 flex gap-1">
                  <label className="flex flex-1 cursor-pointer justify-center rounded border border-[#c5a572]/30 py-1 text-[10px]">
                    Replace
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" className="sr-only"
                      disabled={busy} onChange={e=>{upload(e.target.files?.[0],i);e.target.value="";}}/>
                  </label>
                  <button type="button" disabled={busy} onClick={()=>removePhoto(src)}
                    className="rounded border border-[#c5a572]/30 px-2 text-[10px]">×</button>
                </div>
              </div>)}
            </div>}
            {(saved||editing)&&images.length<2?
              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#c5a572]/40 px-3 py-2.5 text-sm">
                <Plus size={16}/> Upload photo
                <input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" className="sr-only"
                  disabled={busy} onChange={e=>{upload(e.target.files?.[0]);e.target.value="";}}/>
              </label>:
              !saved&&<p className="mt-3 text-xs text-[#b7b2ac]">Save Draft first to upload photos.</p>}
          </div>

          <label className="block text-xs">Description
            <textarea rows={2} maxLength={1500} value={form.description}
              onChange={e=>{setForm({...form,description:e.target.value});setSaved(false);}}
              className={"mt-1.5 "+field}/>
          </label>

          <label className="block text-xs">Material / Details
            <textarea rows={2} maxLength={500} value={form.material}
              onChange={e=>{setForm({...form,material:e.target.value});setSaved(false);}}
              className={"mt-1.5 "+field}/>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured}
              onChange={e=>{setForm({...form,featured:e.target.checked});setSaved(false);}}/>
            <Star size={15} className="text-[#c5a572]"/> Feature on homepage
          </label>

          <div className="border-t border-[#c5a572]/15 pt-3">
            <button onClick={()=>setAdvanced(!advanced)} className="flex w-full items-center justify-between text-xs text-[#b7b2ac]">
              Advanced settings <ChevronDown size={15} className={advanced?"rotate-180":""}/>
            </button>
            {advanced&&<div className="mt-3 rounded-lg bg-[#211b18] p-3 text-sm">
              <p className="text-xs text-[#b7b2ac]">Product URL</p>
              <p className="mt-1 break-all">/jewellery/{form.slug||"new-product"}</p>
              {editing&&<select value={form.status} className={"mt-3 "+field}
                onChange={e=>{setForm({...form,status:e.target.value,featured:e.target.value==="published"?form.featured:false});setSaved(false);}}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>}
            </div>}
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-[#c5a572]/15 pt-4">
            <button disabled={busy||!form.name.trim()} onClick={()=>save(form.status==="archived"?"archived":"draft")}
              className={btn+" border border-[#c5a572]/40"}>
              {busy?<LoaderCircle size={16} className="animate-spin"/>:<Save size={16}/>}
              Save Draft
            </button>
            <button disabled={busy||!form.name.trim()||!images.length} onClick={()=>save("published")}
              className={btn+" bg-[#c5a572] text-[#211b18]"}>
              <Check size={16}/> Publish
            </button>
          </div>
          {!images.length&&<p className="text-center text-xs text-[#b7b2ac]">Upload a photo to enable publishing.</p>}
        </div>
      </section>}

      <div className="mt-7 flex flex-wrap gap-2">
        <div className="relative min-w-[190px] flex-1">
          <Search size={16} className="absolute left-3 top-3 text-[#b7b2ac]"/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search products..." className={field+" pl-9"}/>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className={field+" !w-auto"}>
          <option value="all">All products</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p=><article key={p.slug} className="overflow-hidden rounded-xl border border-[#c5a572]/20 bg-[#302824]">
          <div className="flex gap-3 p-3">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#211b18]">
              {p.image?<img src={p.image} alt={p.name} className="h-full w-full object-cover"/>:
                <div className="flex h-full items-center justify-center"><ImagePlus size={22}/></div>}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-[#c5a572]">{p.code} · {p.status}</p>
              <h3 className="mt-2 line-clamp-2 font-serif text-lg">{p.name}</h3>
              <p className="mt-1 text-xs text-[#b7b2ac]">{p.category}</p>
              <p className="mt-1 text-xs text-[#b7b2ac]">{(p.images||[]).length} photos</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1 border-t border-[#c5a572]/15 p-2">
              <button type="button" disabled={busy} onClick={()=>edit(p)}
                className="flex min-h-9 items-center justify-center gap-1 rounded text-xs hover:bg-white/5">
                <Pencil size={13}/> Edit
              </button>
              <button type="button" disabled={busy}
                onClick={()=>updateProduct(p,{status:p.status==="archived"?"draft":"archived"})}
                className="rounded text-xs hover:bg-white/5">
                {p.status==="archived"?"Restore":"Archive"}
              </button>
              <button type="button" disabled={busy||p.status!=="published"}
                onClick={()=>updateProduct(p,{featured:!p.featured})}
                className="flex items-center justify-center gap-1 rounded text-xs hover:bg-white/5">
                <Star size={13} fill={p.featured?"currentColor":"none"}/>
                {p.featured?"Unfeature":"Feature"}
              </button>
              <button type="button" disabled={busy}
                onClick={()=>deleteProduct(p)}
                className="rounded text-xs text-red-300 hover:bg-red-500/10">
                Delete
              </button>
            </div>
        </article>)}
      </div>
    </div>
  </main>;
}
