import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (session.userId && session.username) {
    return NextResponse.json({
      authenticated: true,
      user: { id: session.userId, username: session.username },
    });
  }
  return NextResponse.json({ authenticated: false });
}
