export default function Loading(){
  return <main className="min-h-screen bg-[#211b18] px-[6%] pt-44 text-[#e3d6c4]">
    <div className="mx-auto max-w-7xl">
      <div className="h-3 w-32 animate-pulse rounded bg-[#c5a572]/20 motion-reduce:animate-none"/>
      <div className="mt-7 h-16 max-w-xl animate-pulse rounded bg-[#c5a572]/10 motion-reduce:animate-none"/>
      <div className="mt-6 h-4 max-w-md animate-pulse rounded bg-[#c5a572]/10 motion-reduce:animate-none"/>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({length:4},(_,i)=><div key={i} className="aspect-[4/5] animate-pulse bg-[#302824] motion-reduce:animate-none"/>)}
      </div>
    </div>
  </main>;
}
