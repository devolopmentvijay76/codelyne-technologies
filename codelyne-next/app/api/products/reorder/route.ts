import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/session";

export const runtime = "nodejs";

export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { orders } = await req.json();
    if (!Array.isArray(orders)) {
      return NextResponse.json(
        { message: "Invalid orders format" },
        { status: 400 },
      );
    }
    await storage.updateProductDisplayOrders(orders);
    return NextResponse.json({ message: "Product order updated" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update product order" },
      { status: 500 },
    );
  }
}
