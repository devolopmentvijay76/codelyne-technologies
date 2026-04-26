import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/session";

export const runtime = "nodejs";

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
    const success = await storage.deleteContactSubmission(parseInt(id));
    if (!success) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Submission deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete submission" },
      { status: 500 },
    );
  }
}
