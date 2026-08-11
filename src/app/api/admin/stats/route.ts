import { NextResponse } from "next/server";

import { isAdminSession } from "@/lib/admin-auth";
import { getDashboardStats } from "@/lib/metrics";

export async function GET() {
  if (!(await isAdminSession())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await getDashboardStats(), { headers: { "Cache-Control": "private, no-store" } });
}
