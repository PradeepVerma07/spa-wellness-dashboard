import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { readCMS, updateSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await readCMS();
  return NextResponse.json({ settings: data.settings });
}

export async function PATCH(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "Admin" && session.role !== "Manager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const settings = await updateSettings(body);
  return NextResponse.json({ settings });
}
