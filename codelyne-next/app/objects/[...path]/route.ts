import { NextRequest, NextResponse } from "next/server";
import {
  ObjectStorageService,
  ObjectNotFoundError,
  ObjectPermission,
} from "@/lib/object-storage";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const objectPath = `/objects/${path.join("/")}`;
    const objectStorageService = new ObjectStorageService();
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);

    const session = await getSession();
    const allowed = await objectStorageService.canAccessObjectEntity({
      userId: session.userId,
      objectFile,
      requestedPermission: ObjectPermission.READ,
    });
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return await objectStorageService.downloadObjectAsResponse(objectFile);
  } catch (error) {
    console.error("Error serving object:", error);
    if (error instanceof ObjectNotFoundError) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to serve object" },
      { status: 500 },
    );
  }
}
