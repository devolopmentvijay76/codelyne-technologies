import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const { key } = await params;
    const content = await storage.getContentByKey(key);
    if (!content) {
      return NextResponse.json(
        { message: "Content not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch content" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { key } = await params;
    const { value } = await req.json();
    if (!value || typeof value !== "string") {
      return NextResponse.json({ message: "Invalid value" }, { status: 400 });
    }
    const content = await storage.updateContentByKey(key, value);
    if (!content) {
      return NextResponse.json(
        { message: "Content not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update content" },
      { status: 500 },
    );
  }
}
