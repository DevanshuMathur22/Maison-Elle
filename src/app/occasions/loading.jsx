export default function Loading(){
  return <main className="min-h-[65vh] bg-[#211b18] px-[6%] pb-24 pt-36 text-[#e3d6c4]">
    <div className="mx-auto max-w-7xl animate-pulse motion-reduce:animate-none">
      <div className="h-3 w-32 rounded bg-[#c5a572]/30"/>
      <div className="mt-7 h-12 w-64 max-w-full rounded bg-[#c5a572]/15"/>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({length:4},(_,i)=>
          <div key={i}>
            <div className="aspect-[4/5] rounded bg-[#302824]"/>
            <div className="mt-4 h-3 w-20 rounded bg-[#c5a572]/20"/>
            <div className="mt-3 h-5 w-32 max-w-full rounded bg-[#c5a572]/15"/>
          </div>
        )}
      </div>
    </div>
  </main>;
}
