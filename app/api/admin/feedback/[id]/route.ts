// Place at: app/api/admin/feedback/[id]/route.ts
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Context = { params: Promise<{ id: string }> };

function upstreamHeaders(req: Request) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const authorization = req.headers.get("authorization");
  const cookie = req.headers.get("cookie");
  if (authorization) headers.Authorization = authorization;
  if (cookie) headers.Cookie = cookie;
  return headers;
}

export async function PUT(req: Request, { params }: Context) {
  try {
    const { id } = await params;
    const body = await req.json();

    const res = await fetch(`${API_URL}/admin/feedback/${id}`, {
      method: "PUT",
      headers: upstreamHeaders(req),
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Admin feedback update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: Context) {
  try {
    const { id } = await params;

    const res = await fetch(`${API_URL}/admin/feedback/${id}`, {
      method: "DELETE",
      headers: upstreamHeaders(req),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Admin feedback delete error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
