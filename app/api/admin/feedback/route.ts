// Place at: app/api/admin/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function upstreamHeaders(req: NextRequest) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const token = req.cookies.get("admin_token")?.value;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function GET(req: NextRequest) {
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

export async function POST(req: NextRequest) {
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
