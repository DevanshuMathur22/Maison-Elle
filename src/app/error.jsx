"use client";
import {useEffect} from "react";

export default function ErrorPage({error,reset}){
  useEffect(()=>{console.error(error);},[error]);
  return <main className="flex min-h-screen items-center justify-center bg-[#211b18] px-6 text-center text-[#e3d6c4]">
    <div>
      <h1 className="font-serif text-4xl">Connection interrupted</h1>
      <p className="mt-4 text-sm text-[#b7b2ac]">This page could not load. Please check your connection and try again.</p>
      <button onClick={reset} className="mt-7 rounded bg-[#c5a572] px-6 py-3 text-sm text-[#211b18]">Try again</button>
    </div>
  </main>;
}
