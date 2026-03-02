import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API_URL is not defined");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("perPage") || "12";

    const params = new URLSearchParams({ page, perPage });
    if (category) params.set("category", category);

    const response = await fetch(`${API_URL}/portfolio?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("[Portfolio] GET error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch portfolio items",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const response = await fetch(`${API_URL}/portfolio`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("[Portfolio] POST error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create portfolio item",
      },
      { status: 500 }
    );
  }
}
