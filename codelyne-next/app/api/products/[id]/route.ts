import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/session";
import { insertProductSchema } from "@shared/schema";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await storage.getProduct(parseInt(id));
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = insertProductSchema.parse(body);
    const product = await storage.updateProduct(parseInt(id), validated);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const success = await storage.deleteProduct(parseInt(id));
    if (!success) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 },
    );
  }
}
