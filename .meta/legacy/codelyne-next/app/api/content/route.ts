import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/session";
import { insertContentSchema } from "@shared/schema";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET() {
  try {
    const allContent = await storage.getAllContent();
    return NextResponse.json(allContent);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch content" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const validated = insertContentSchema.parse(body);
    const content = await storage.upsertContent(validated);
    return NextResponse.json(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Failed to save content" },
      { status: 500 },
    );
  }
}
