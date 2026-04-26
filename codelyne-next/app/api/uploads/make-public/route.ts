import { NextRequest, NextResponse } from "next/server";
import { ObjectStorageService, setObjectAclPolicy } from "@/lib/object-storage";
import { requireAdmin } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { objectPath } = await req.json();
    if (!objectPath) {
      return NextResponse.json(
        { error: "Missing objectPath" },
        { status: 400 },
      );
    }
    if (!objectPath.startsWith("/objects/")) {
      return NextResponse.json({ success: true, objectPath, skipped: true });
    }
    const objectStorageService = new ObjectStorageService();
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    await setObjectAclPolicy(objectFile, {
      owner: "system",
      visibility: "public",
    });
    return NextResponse.json({ success: true, objectPath });
  } catch (error) {
    console.error("Error setting public ACL:", error);
    return NextResponse.json(
      { error: "Failed to set public access" },
      { status: 500 },
    );
  }
}
