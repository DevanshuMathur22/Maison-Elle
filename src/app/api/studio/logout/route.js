import { NextResponse } from "next/server";
import { clearSession } from "@/lib/studio-auth";

export async function POST(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  await clearSession();
  return NextResponse.json({ success: true });
}
