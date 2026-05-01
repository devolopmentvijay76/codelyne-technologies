import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/session";
import { ObjectStorageService, setObjectAclPolicy } from "@/lib/object-storage";

export const runtime = "nodejs";

export async function POST() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const objectStorageService = new ObjectStorageService();
    const employees = await storage.getAllEmployees();
    const results: { name: string; status: string }[] = [];

    for (const emp of employees) {
      if (emp.photoUrl && emp.photoUrl.startsWith("/objects/")) {
        try {
          const objectFile = await objectStorageService.getObjectEntityFile(
            emp.photoUrl,
          );
          await setObjectAclPolicy(objectFile, {
            owner: "system",
            visibility: "public",
          });
          results.push({ name: emp.name, status: "fixed" });
        } catch {
          results.push({ name: emp.name, status: "error" });
        }
      } else {
        results.push({ name: emp.name, status: "skipped" });
      }
    }

    return NextResponse.json({ message: "Photos fixed", results });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fix photos" },
      { status: 500 },
    );
  }
}
