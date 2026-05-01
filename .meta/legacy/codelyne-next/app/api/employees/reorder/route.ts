import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/session";
import { updateDisplayOrderSchema } from "@shared/schema";

export const runtime = "nodejs";

export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const validated = updateDisplayOrderSchema.parse(body);
    const success = await storage.updateDisplayOrders(validated.orders);
    if (!success) {
      return NextResponse.json(
        { message: "Failed to update display order" },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: "Display order updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Failed to update display order" },
      { status: 500 },
    );
  }
}
