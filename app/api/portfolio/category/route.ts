import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (!API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }

    const response = await fetch(
      `${API_URL.replace(/\/+$/, "")}/portfolio/categories`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("[Categories] GET error:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch categories",
        data: [],
      },
      { status: 500 },
    );
  }
}
