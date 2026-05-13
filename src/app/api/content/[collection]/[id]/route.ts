import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { canDelete, canWrite, getSessionFromRequest } from "@/lib/auth";
import { deleteItem, updateItem } from "@/lib/store";
import { normalizeCollection } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ collection: string; id: string }>;
};

export async function PUT(request: NextRequest, context: Context) {
  return update(request, context);
}

export async function PATCH(request: NextRequest, context: Context) {
  return update(request, context);
}

async function update(request: NextRequest, context: Context) {
  const { collection: collectionParam, id } = await context.params;
  const collection = normalizeCollection(collectionParam);
  if (!collection) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canWrite(session.role, collection)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await request.json()) as Record<string, unknown>;
  const item = await updateItem(collection, id, body);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest, context: Context) {
  const { collection: collectionParam, id } = await context.params;
  const collection = normalizeCollection(collectionParam);
  if (!collection) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canDelete(session.role, collection)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const deleted = await deleteItem(collection, id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
