import {Suspense} from "react";
import {redirect} from "next/navigation";
import {currentUser} from "@/lib/studio-auth";
import OccasionsManager from "./OccasionsManager";

async function Protected(){
  const user=await currentUser();
  if(!user||user.role!=="super_admin")redirect("/studio/login");
  return <OccasionsManager/>;
}
export default function Page(){
  return <Suspense fallback={<main className="min-h-screen bg-[#211b18] p-10 text-[#e3d6c4]">Opening Occasion Studio...</main>}>
    <Protected/>
  </Suspense>;
}
