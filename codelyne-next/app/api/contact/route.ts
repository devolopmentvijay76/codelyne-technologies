import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/session";
import { insertContactSubmissionSchema } from "@shared/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = insertContactSubmissionSchema.parse(body);
    const submission = await storage.createContactSubmission(validated);
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }
    console.error("Contact submit error:", error);
    return NextResponse.json(
      { message: "Failed to submit contact form" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const submissions = await storage.getAllContactSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch contact submissions" },
      { status: 500 },
    );
  }
}
