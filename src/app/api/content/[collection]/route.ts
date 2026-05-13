import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { canWrite, getSessionFromRequest } from "@/lib/auth";
import { createItem, listCollection, readCMS } from "@/lib/store";
import { normalizeCollection } from "@/lib/utils";

export const dynamic = "force-dynamic";

const publicCreate = new Set(["bookings", "orders", "leads"]);

type Context = {
  params: Promise<{ collection: string }>;
};

export async function GET(_request: NextRequest, context: Context) {
  const { collection: collectionParam } = await context.params;
  const collection = normalizeCollection(collectionParam);
  if (!collection) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const items = await listCollection(collection);
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest, context: Context) {
  const { collection: collectionParam } = await context.params;
  const collection = normalizeCollection(collectionParam);
  if (!collection) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  const session = getSessionFromRequest(request);
  if (!session && !publicCreate.has(collection)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session && !canWrite(session.role, collection)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const data = await readCMS();
  const payload =
    collection === "bookings"
      ? {
          ...body,
          serviceTitle:
            body.serviceTitle ??
            data.services.find((service) => service.slug === body.serviceSlug)?.title ??
            "Spa service",
          total:
            Number(body.total) ||
            data.services.find((service) => service.slug === body.serviceSlug)?.price ||
            0,
          status: body.status ?? "pending",
          createdAt: new Date().toISOString(),
        }
      : collection === "orders"
        ? {
            ...body,
            status: body.status ?? "pending",
            createdAt: new Date().toISOString(),
          }
        : collection === "leads"
          ? {
              ...body,
              status: body.status ?? "new",
              createdAt: new Date().toISOString(),
            }
          : body;

  const item = await createItem(collection, payload);
  return NextResponse.json({ item }, { status: 201 });
}
