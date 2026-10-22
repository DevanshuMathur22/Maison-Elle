import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { ObjectId } from "mongodb";
import { db } from "@/lib/mongodb";

const cookieName = "maison_studio_session";
const key = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET invalid");
  return new TextEncoder().encode(secret);
};

export async function createSession(user) {
  const token = await new SignJWT({ role: user.role, version: user.sessionVersion || 0 })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user._id))
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(key());
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 28800
  });
}

export async function currentUser() {
  try {
    const token = (await cookies()).get(cookieName)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (!ObjectId.isValid(payload.sub)) return null;
    const user = await (await db()).collection("studio_users").findOne({
      _id: new ObjectId(payload.sub),
      active: true
    });
    if (!user || user.sessionVersion !== payload.version || user.role !== payload.role) return null;
    return { id: String(user._id), email: user.email, role: user.role };
  } catch {
    return null;
  }
}

export async function clearSession() {
  (await cookies()).delete(cookieName);
}
