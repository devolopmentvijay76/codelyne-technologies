import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/session";
import { insertEmployeeSchema } from "@shared/schema";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const employee = await storage.getEmployee(parseInt(id));
    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch employee" },
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
    const validated = insertEmployeeSchema.parse(body);
    const employee = await storage.updateEmployee(parseInt(id), validated);
    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(employee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Failed to update employee" },
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
    const success = await storage.deleteEmployee(parseInt(id));
    if (!success) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete employee" },
      { status: 500 },
    );
  }
}
