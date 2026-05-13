import { promises as fs } from "fs";
import path from "path";
import { seedData } from "@/data/seed";
import type { CMSData, CMSItem, CollectionName, SiteSettings } from "@/lib/types";
import { newId, slugify } from "@/lib/utils";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "cms.json");

function cloneSeed(): CMSData {
  return JSON.parse(JSON.stringify(seedData)) as CMSData;
}

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(cloneSeed(), null, 2), "utf8");
  }
}

export async function readCMS(): Promise<CMSData> {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");
  const parsed = JSON.parse(raw) as CMSData;
  return {
    ...cloneSeed(),
    ...parsed,
    settings: {
      ...cloneSeed().settings,
      ...parsed.settings,
      homepageSections: {
        ...cloneSeed().settings.homepageSections,
        ...parsed.settings?.homepageSections,
      },
    },
  };
}

export async function writeCMS(data: CMSData) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf8");
  return data;
}

export async function listCollection(collection: CollectionName) {
  const data = await readCMS();
  return data[collection];
}

export async function createItem(collection: CollectionName, payload: Record<string, unknown>) {
  const data = await readCMS();
  const prefix = collection.slice(0, 4);
  const title = String(payload.title ?? payload.name ?? payload.customerName ?? collection);
  const item = {
    id: String(payload.id ?? newId(prefix)),
    slug: payload.slug ? String(payload.slug) : slugify(title),
    createdAt: new Date().toISOString(),
    ...payload,
  } as unknown as CMSItem;
  (data[collection] as CMSItem[]).unshift(item);
  await writeCMS(data);
  return item;
}

export async function updateItem(collection: CollectionName, id: string, payload: Record<string, unknown>) {
  const data = await readCMS();
  const items = data[collection] as CMSItem[];
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = {
    ...items[index],
    ...payload,
    id,
  } as CMSItem;
  await writeCMS(data);
  return items[index];
}

export async function deleteItem(collection: CollectionName, id: string) {
  const data = await readCMS();
  const items = data[collection] as CMSItem[];
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  data[collection] = next as never;
  await writeCMS(data);
  return true;
}

export async function updateSettings(settings: Partial<SiteSettings>) {
  const data = await readCMS();
  data.settings = {
    ...data.settings,
    ...settings,
    homepageSections: {
      ...data.settings.homepageSections,
      ...settings.homepageSections,
    },
  };
  await writeCMS(data);
  return data.settings;
}

export async function findBySlug(collection: "services", slug: string): Promise<CMSData["services"][number] | undefined>;
export async function findBySlug(collection: "products", slug: string): Promise<CMSData["products"][number] | undefined>;
export async function findBySlug(collection: "projects", slug: string): Promise<CMSData["projects"][number] | undefined>;
export async function findBySlug(collection: "blogs", slug: string): Promise<CMSData["blogs"][number] | undefined>;
export async function findBySlug(
  collection: "services" | "products" | "projects" | "blogs",
  slug: string,
) {
  const data = await readCMS();
  return data[collection].find((item) => item.slug === slug);
}

export async function dashboardStats() {
  const data = await readCMS();
  const bookingRevenue = data.bookings
    .filter((booking) => booking.status === "confirmed" || booking.status === "completed")
    .reduce((sum, booking) => sum + booking.total, 0);
  const orderRevenue = data.orders
    .filter((order) => order.status === "paid" || order.status === "shipped" || order.status === "delivered")
    .reduce((sum, order) => sum + order.total, 0);

  return {
    totalBookings: data.bookings.length,
    totalOrders: data.orders.length,
    totalRevenue: bookingRevenue + orderRevenue,
    totalLeads: data.leads.length,
    lowInventory: data.products.filter((product) => product.inventory < 30).length,
  };
}
