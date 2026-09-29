// Place at: app/api/admin/feedback/route.ts
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export async function GET(req: Request) {
  try {
    const { search } = new URL(req.url);

    const res = await fetch(`${API_URL}/admin/feedback${search}`, {
      headers: upstreamHeaders(req),
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Admin feedback fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_URL}/admin/feedback`, {
      method: "POST",
      headers: upstreamHeaders(req),
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Admin feedback create error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
