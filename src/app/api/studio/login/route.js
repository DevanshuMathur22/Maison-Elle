import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/mongodb";
import { createSession } from "@/lib/studio-auth";


const schema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(200)
});

export async function POST(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  let body;
  try {
    body = schema.safeParse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.success) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const email = body.data.email.trim().toLowerCase();
  const database = await db();
  const attempts = database.collection("studio_login_attempts");
  const now = new Date();
  const record = await attempts.findOne({ _id: email });
  if (record?.lockedUntil && record.lockedUntil > now) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const user = await database.collection("studio_users").findOne({ email, active: true });
  const valid = user ? await compare(body.data.password, user.passwordHash) : false;
  if (!valid) {
    const count = record?.lockedUntil && record.lockedUntil <= now ? 1 : (record?.count || 0) + 1;
    await attempts.updateOne({ _id: email }, {
      $set: {
        count,
        lockedUntil: count >= 5 ? new Date(Date.now() + 15 * 60000) : null,
        updatedAt: now
      }
    }, { upsert: true });
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await attempts.deleteOne({ _id: email });
  await createSession(user);
  return NextResponse.json({ success: true });
}
