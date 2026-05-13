import { NextResponse } from "next/server";
import { dashboardStats, readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await readCMS();
  const stats = await dashboardStats();
  return NextResponse.json({ data, stats });
}
