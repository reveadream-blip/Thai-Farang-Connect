import { NextResponse } from "next/server";

import { workerAuthedFetch } from "@/lib/server/workerAuthFetch";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const safeId = encodeURIComponent(id);
  const body = await req.text();
  const res = await workerAuthedFetch(`/v1/manage/projects/${safeId}`, {
    method: "PATCH",
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
