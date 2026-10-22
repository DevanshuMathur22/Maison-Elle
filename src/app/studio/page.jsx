import { Suspense } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/studio-auth";
import StudioDashboard from "./studio-dashboard";

async function ProtectedStudio() {
  const user = await currentUser();
  if (!user) redirect("/studio/login");
  return <StudioDashboard user={user}/>;
}

export default function Studio() {
  return <Suspense fallback={
    <main className="min-h-screen bg-[#211b18] px-[6%] pt-44 text-[#e3d6c4]">
      <p className="text-xs tracking-[.3em] text-[#c5a572]">VRINDA ÉLLE</p>
      <h1 className="mt-6 font-serif text-5xl italic">Opening Collection Studio...</h1>
    </main>
  }>
    <ProtectedStudio/>
  </Suspense>;
}
