import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/session";
import { insertEmployeeSchema } from "@shared/schema";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const employees = await storage.getAllEmployees();
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch employees" },
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
    const validated = insertEmployeeSchema.parse(body);
    const employee = await storage.createEmployee(validated);
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Failed to create employee" },
      { status: 500 },
    );
  }
}
