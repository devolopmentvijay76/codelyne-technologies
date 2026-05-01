import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { verifyPassword } from "@/lib/auth-utils";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 },
      );
    }
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return NextResponse.json(
        { message: "Incorrect username or password" },
        { status: 401 },
      );
    }
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Incorrect username or password" },
        { status: 401 },
      );
    }

    const session = await getSession();
    session.userId = user.id;
    session.username = user.username;
    await session.save();

    return NextResponse.json({
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
