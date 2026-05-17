import { NextResponse } from "next/server";

import { apiFetch } from "@/lib/server/apiFetch";

export async function POST(req: Request) {
  const body = await req.text();
  const res = await apiFetch("/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }
  const token = (data as { token?: string }).token;
  if (typeof token !== "string") {
    return NextResponse.json({ error: "Invalid response" }, { status: 502 });
  }
  const out = NextResponse.json({
    user: (data as { user?: unknown }).user,
  });
  out.cookies.set("tf_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return out;
}
