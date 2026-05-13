import type { CMSItem, CollectionName } from "@/lib/types";

export const collectionNames: CollectionName[] = [
  "services",
  "products",
  "projects",
  "packages",
  "offers",
  "testimonials",
  "gallery",
  "team",
  "blogs",
  "bookings",
  "orders",
  "leads",
];

export const collectionLabels: Record<CollectionName, string> = {
  services: "Services",
  products: "Products",
  projects: "Projects",
  packages: "Packages",
  offers: "Offers",
  testimonials: "Testimonials",
  gallery: "Gallery",
  team: "Team",
  blogs: "Blogs",
  bookings: "Bookings",
  orders: "Orders",
  leads: "Contact Leads",
};

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function newId(prefix: string) {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  return `${prefix}-${stamp}-${rand}`;
}

export function getItemTitle(item: CMSItem) {
  const record = item as unknown as Record<string, unknown>;
  return String(record.title ?? record.name ?? record.customerName ?? record.email ?? record.id ?? "Untitled item");
}

export function getItemSubtitle(item: CMSItem) {
  const record = item as unknown as Record<string, unknown>;
  return String(record.category ?? record.status ?? record.role ?? record.email ?? "Dynamic content");
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 180));
}

export function normalizeCollection(value: string): CollectionName | null {
  return collectionNames.includes(value as CollectionName) ? (value as CollectionName) : null;
}
