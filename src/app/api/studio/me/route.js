import { NextResponse } from "next/server";
import { currentUser } from "@/lib/studio-auth";

export async function GET() {
  const user = await currentUser();
  return NextResponse.json(user ? { user } : { error: "Unauthorized" }, {
    status: user ? 200 : 401,
    headers: { "Cache-Control": "no-store" }
  });
}
