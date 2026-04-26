import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export const runtime = "nodejs";
export const revalidate = 600;

export async function GET() {
  try {
    const employees = await storage.getAllEmployees();
    const publicData = employees.map((e) => ({
      id: e.id,
      name: e.name,
      role: e.role,
      department: e.department,
      memberType: e.memberType,
      photoUrl: e.photoUrl,
      description: e.description,
      quote: e.quote,
      focusAreas: e.focusAreas,
    }));
    return NextResponse.json(publicData);
  } catch (error) {
    console.error("Public team error:", error);
    return NextResponse.json(
      { message: "Failed to fetch team" },
      { status: 500 },
    );
  }
}
