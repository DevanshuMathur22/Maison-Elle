"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }
      router.replace("/studio");
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return <main className="min-h-screen bg-[#211b18] px-5 pb-12 pt-28 sm:pt-32 text-[#e3d6c4]">
    <div className="mx-auto max-w-md border border-[#c5a572]/25 bg-[#302824] p-6 sm:p-9">
      <p className="text-center text-[11px] uppercase tracking-[.4em] text-[#c5a572]">Vrinda Élle</p>
      <h1 className="mt-4 text-center font-serif text-3xl italic sm:text-4xl">Collection Studio</h1>
      <p className="mt-4 text-center text-sm text-[#b7b2ac]">Private access for authorised team members</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block text-xs tracking-widest">EMAIL
          <input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}
            className="mt-2 w-full border border-[#c5a572]/30 bg-[#211b18] px-4 py-4 text-base outline-none focus:border-[#c5a572]"/>
        </label>
        <label className="block text-xs tracking-widest">PASSWORD
          <input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}
            className="mt-2 w-full border border-[#c5a572]/30 bg-[#211b18] px-4 py-4 text-base outline-none focus:border-[#c5a572]"/>
        </label>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button disabled={loading} className="w-full bg-[#c5a572] px-5 py-4 text-sm font-semibold text-[#211b18] disabled:opacity-60">
          {loading ? "Signing in..." : "Enter Collection Studio →"}
        </button>
      </form>
    </div>
  </main>;
}
