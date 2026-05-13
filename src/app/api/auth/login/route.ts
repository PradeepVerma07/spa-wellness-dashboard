import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authenticate, createSession, sessionCookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const user = authenticate(body.email ?? "", body.password ?? "");
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = createSession(user);
  const response = NextResponse.json({
    user: { email: user.email, name: user.name, role: user.role },
  });
  response.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
