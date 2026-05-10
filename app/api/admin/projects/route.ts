import { NextResponse } from "next/server";

import { workerAuthedFetch } from "@/lib/server/workerAuthFetch";

export async function POST(req: Request) {
  const body = await req.text();
  const res = await workerAuthedFetch("/v1/projects", {
    method: "POST",
    body,
  });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type":
        res.headers.get("content-type") ?? "application/json;charset=UTF-8",
    },
  });
}
