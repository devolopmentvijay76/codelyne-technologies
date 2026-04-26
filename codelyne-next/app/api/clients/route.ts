import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/session";
import { insertClientSchema } from "@shared/schema";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET() {
  try {
    const allClients = await storage.getAllClients();
    return NextResponse.json(allClients);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch clients" },
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
    const validated = insertClientSchema.parse(body);
    const client = await storage.createClient(validated);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Failed to create client" },
      { status: 500 },
    );
  }
}
