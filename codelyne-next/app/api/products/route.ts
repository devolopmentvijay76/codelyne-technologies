import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/session";
import { insertProductSchema } from "@shared/schema";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET() {
  try {
    const productList = await storage.getAllProducts();
    return NextResponse.json(productList);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch products" },
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
    const validated = insertProductSchema.parse(body);
    const product = await storage.createProduct(validated);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 },
    );
  }
}
