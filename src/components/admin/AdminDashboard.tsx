"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  Download,
  Edit3,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Plus,
  Save,
  Settings,
  Trash2,
} from "lucide-react";
import type { CMSData, CMSItem, CollectionName, Role, SiteSettings } from "@/lib/types";
import { collectionLabels, collectionNames, formatCurrency, getItemSubtitle, getItemTitle } from "@/lib/utils";

type SessionUser = {
  email: string;
  name: string;
  role: Role;
};

type Stats = {
  totalBookings: number;
  totalOrders: number;
  totalRevenue: number;
  totalLeads: number;
  lowInventory: number;
};

const colors = ["#a57a28", "#7c927c", "#b88778", "#2b2520"];

function templateFor(collection: CollectionName): Record<string, unknown> {
  const common = { title: "New item", slug: "new-item", image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=85" };
  if (collection === "services") {
    return { ...common, category: "Massage", excerpt: "", description: "", price: 0, duration: "60 minutes", benefits: [], gallery: [], featured: false, seo: { title: "New service", description: "" } };
  }
  if (collection === "products") {
    return { ...common, category: "Skin Care", excerpt: "", description: "", price: 0, inventory: 0, popularity: 50, ingredients: [], benefits: [], gallery: [], reviews: [], featured: false, seo: { title: "New product", description: "" } };
  }
  if (collection === "projects") {
    return { ...common, category: "Spa Interiors", client: "", excerpt: "", story: "", result: "", servicesUsed: [], gallery: [], featured: false, seo: { title: "New project", description: "" } };
  }
  if (collection === "packages") {
    return { ...common, category: "Monthly", excerpt: "", price: 0, cadence: "Monthly", inclusions: [], featured: false };
  }
  if (collection === "offers") {
    return { ...common, excerpt: "", discount: "10% off", endsAt: new Date().toISOString(), targetLabel: "Book now", targetHref: "/booking", active: true };
  }
  if (collection === "testimonials") {
    return { name: "Guest name", service: "Service", quote: "", rating: 5, image: common.image, featured: false };
  }
  if (collection === "gallery") {
    return { title: "Gallery item", category: "Spa", type: "image", image: common.image, relatedLabel: "Explore", relatedHref: "/services" };
  }
  if (collection === "team") {
    return { name: "Team member", role: "Therapist", specialization: "", experience: "", bio: "", image: common.image, bookingHref: "/booking" };
  }
  if (collection === "blogs") {
    return { ...common, category: "Wellness Articles", excerpt: "", content: "", author: "Aura Team", publishedAt: new Date().toISOString().slice(0, 10), relatedServices: [], relatedProducts: [], seo: { title: "New blog", description: "" } };
  }
  if (collection === "bookings") {
    return { serviceSlug: "", serviceTitle: "Service", date: "", time: "", name: "", email: "", phone: "", payment: "pay_at_spa", total: 0, status: "pending", createdAt: new Date().toISOString() };
  }
  if (collection === "orders") {
    return { customerName: "", email: "", phone: "", address: "", payment: "upi", items: [], total: 0, status: "pending", createdAt: new Date().toISOString() };
  }
  return { name: "", email: "", phone: "", subject: "", message: "", source: "Admin", status: "new", createdAt: new Date().toISOString() };
}

function LoginPanel({ onLogin }: { onLogin: (user: SessionUser) => void }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const json = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(json.error ?? "Unable to sign in");
      return;
    }
    onLogin(json.user);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-charcoal p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-white/10 bg-porcelain p-8 shadow-2xl">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 font-serif text-5xl text-charcoal">Aura Dashboard</h1>
        <p className="mt-3 text-sm leading-7 text-charcoal/62">Sign in to manage bookings, orders, services, products, content, navigation, and homepage sections.</p>
        <div className="mt-7 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-charcoal">
            Email
            <input name="email" type="email" defaultValue="admin@aurawellness.local" className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-charcoal">
            Password
            <input name="password" type="password" defaultValue="admin123" className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
          </label>
        </div>
        <button type="submit" disabled={loading} className="gold-button mt-6 inline-flex w-full justify-center px-6 py-3 text-sm font-semibold disabled:opacity-60">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {error && <p className="mt-4 rounded-lg bg-rose/12 px-4 py-3 text-sm font-semibold text-rose">{error}</p>}
      </form>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
      <p className="text-sm text-charcoal/56">{label}</p>
      <p className="mt-2 font-serif text-4xl text-charcoal">{value}</p>
    </div>
  );
}

function Overview({ data, stats }: { data: CMSData; stats: Stats }) {
  const revenueRows = useMemo(() => {
    const rows = new Map<string, { month: string; revenue: number; bookings: number; orders: number }>();
    [...data.bookings, ...data.orders].forEach((item) => {
      const date = new Date(item.createdAt);
      const month = date.toLocaleDateString("en-IN", { month: "short" });
      const current = rows.get(month) ?? { month, revenue: 0, bookings: 0, orders: 0 };
      current.revenue += "total" in item ? item.total : 0;
      if ("serviceSlug" in item) current.bookings += 1;
      if ("items" in item) current.orders += 1;
      rows.set(month, current);
    });
    return Array.from(rows.values());
  }, [data.bookings, data.orders]);

  const contentRows = collectionNames.slice(0, 8).map((name) => ({ name: collectionLabels[name], value: data[name].length }));

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total bookings" value={stats.totalBookings.toLocaleString("en-IN")} />
        <StatCard label="Total orders" value={stats.totalOrders.toLocaleString("en-IN")} />
        <StatCard label="Total revenue" value={formatCurrency(stats.totalRevenue)} />
        <StatCard label="Total leads" value={stats.totalLeads.toLocaleString("en-IN")} />
        <StatCard label="Low inventory" value={stats.lowInventory.toLocaleString("en-IN")} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="min-w-0 rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 size={18} className="text-gold-deep" />
            <h2 className="font-serif text-3xl text-charcoal">Revenue Analytics</h2>
          </div>
          <div className="h-80 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={revenueRows}>
                <defs>
                  <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#a57a28" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#a57a28" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee6d8" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#a57a28" fill="url(#revenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="min-w-0 rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
          <h2 className="mb-5 font-serif text-3xl text-charcoal">Content Volume</h2>
          <div className="h-80 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie data={contentRows} dataKey="value" nameKey="name" outerRadius={105} label>
                  {contentRows.map((row, index) => (
                    <Cell key={row.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="min-w-0 rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
        <h2 className="mb-5 font-serif text-3xl text-charcoal">Bookings and Orders</h2>
        <div className="h-72 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={revenueRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee6d8" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#7c927c" radius={[6, 6, 0, 0]} />
              <Bar dataKey="orders" fill="#b88778" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

type EditableItem = Record<string, unknown> & { id?: string };

type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "date"
  | "time"
  | "datetime"
  | "email"
  | "url"
  | "array"
  | "seo"
  | "reviews"
  | "orderItems";

type EditorField = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  full?: boolean;
};

const inputClass =
  "rounded-lg border border-charcoal/10 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-champagne focus:ring-4 focus:ring-champagne/15";

const textareaClass =
  "min-h-28 rounded-lg border border-charcoal/10 bg-white px-4 py-3 text-sm leading-6 text-charcoal outline-none transition focus:border-champagne focus:ring-4 focus:ring-champagne/15";

const serviceCategories = ["Massage", "Facial", "Hair Spa", "Body Therapy", "Skin Care", "Ayurveda", "Wellness"];
const productCategories = ["Skin Care", "Body Care", "Hair Care", "Wellness", "Aromatherapy"];
const projectCategories = ["Spa Interiors", "Bridal Makeover", "Wellness Programs"];
const packageCategories = ["Monthly", "Bridal", "Couple Spa", "Membership"];

const editorSchemas: Record<CollectionName, EditorField[]> = {
  services: [
    { key: "title", label: "Service Name", type: "text" },
    { key: "slug", label: "SEO URL Slug", type: "text" },
    { key: "category", label: "Category", type: "select", options: serviceCategories },
    { key: "price", label: "Price", type: "number" },
    { key: "duration", label: "Duration", type: "text" },
    { key: "featured", label: "Featured Service", type: "checkbox" },
    { key: "excerpt", label: "Short Summary", type: "textarea", full: true },
    { key: "description", label: "Full Description", type: "textarea", full: true },
    { key: "image", label: "Main Image URL", type: "url", full: true },
    { key: "benefits", label: "Benefits", type: "array", full: true },
    { key: "gallery", label: "Gallery Image URLs", type: "array", full: true },
    { key: "seo", label: "SEO", type: "seo", full: true },
  ],
  products: [
    { key: "title", label: "Product Name", type: "text" },
    { key: "slug", label: "SEO URL Slug", type: "text" },
    { key: "category", label: "Category", type: "select", options: productCategories },
    { key: "price", label: "Price", type: "number" },
    { key: "compareAtPrice", label: "Compare At Price", type: "number" },
    { key: "inventory", label: "Inventory", type: "number" },
    { key: "popularity", label: "Popularity Score", type: "number" },
    { key: "featured", label: "Best Seller", type: "checkbox" },
    { key: "excerpt", label: "Short Summary", type: "textarea", full: true },
    { key: "description", label: "Description", type: "textarea", full: true },
    { key: "image", label: "Main Image URL", type: "url", full: true },
    { key: "ingredients", label: "Ingredients", type: "array", full: true },
    { key: "benefits", label: "Benefits", type: "array", full: true },
    { key: "gallery", label: "Gallery Image URLs", type: "array", full: true },
    { key: "reviews", label: "Reviews", type: "reviews", full: true },
    { key: "seo", label: "SEO", type: "seo", full: true },
  ],
  projects: [
    { key: "title", label: "Project Name", type: "text" },
    { key: "slug", label: "SEO URL Slug", type: "text" },
    { key: "category", label: "Category", type: "select", options: projectCategories },
    { key: "client", label: "Client", type: "text" },
    { key: "featured", label: "Featured Project", type: "checkbox" },
    { key: "excerpt", label: "Short Summary", type: "textarea", full: true },
    { key: "story", label: "Client Story", type: "textarea", full: true },
    { key: "result", label: "Result", type: "textarea", full: true },
    { key: "servicesUsed", label: "Service Slugs Used", type: "array", full: true },
    { key: "image", label: "Main Image URL", type: "url", full: true },
    { key: "gallery", label: "Gallery Image URLs", type: "array", full: true },
    { key: "seo", label: "SEO", type: "seo", full: true },
  ],
  packages: [
    { key: "title", label: "Package Name", type: "text" },
    { key: "slug", label: "SEO URL Slug", type: "text" },
    { key: "category", label: "Category", type: "select", options: packageCategories },
    { key: "price", label: "Price", type: "number" },
    { key: "cadence", label: "Cadence", type: "text" },
    { key: "featured", label: "Featured Package", type: "checkbox" },
    { key: "excerpt", label: "Short Summary", type: "textarea", full: true },
    { key: "inclusions", label: "Inclusions", type: "array", full: true },
    { key: "image", label: "Image URL", type: "url", full: true },
  ],
  offers: [
    { key: "title", label: "Offer Title", type: "text" },
    { key: "slug", label: "SEO URL Slug", type: "text" },
    { key: "discount", label: "Discount", type: "text" },
    { key: "endsAt", label: "Ends At", type: "datetime" },
    { key: "targetLabel", label: "CTA Label", type: "text" },
    { key: "targetHref", label: "CTA Link", type: "text" },
    { key: "active", label: "Active Offer", type: "checkbox" },
    { key: "excerpt", label: "Short Summary", type: "textarea", full: true },
    { key: "image", label: "Image URL", type: "url", full: true },
  ],
  testimonials: [
    { key: "name", label: "Client Name", type: "text" },
    { key: "service", label: "Service", type: "text" },
    { key: "rating", label: "Rating", type: "number" },
    { key: "featured", label: "Featured Review", type: "checkbox" },
    { key: "quote", label: "Review Quote", type: "textarea", full: true },
    { key: "image", label: "Client Image URL", type: "url", full: true },
    { key: "videoUrl", label: "Video URL", type: "url", full: true },
  ],
  gallery: [
    { key: "title", label: "Media Title", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "type", label: "Media Type", type: "select", options: ["image", "video"] },
    { key: "relatedLabel", label: "Related Link Label", type: "text" },
    { key: "relatedHref", label: "Related Link URL", type: "text" },
    { key: "image", label: "Image URL", type: "url", full: true },
    { key: "videoUrl", label: "Video URL", type: "url", full: true },
  ],
  team: [
    { key: "name", label: "Name", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { key: "experience", label: "Experience", type: "text" },
    { key: "bookingHref", label: "Booking Link", type: "text" },
    { key: "specialization", label: "Specialization", type: "textarea", full: true },
    { key: "bio", label: "Bio", type: "textarea", full: true },
    { key: "image", label: "Photo URL", type: "url", full: true },
  ],
  blogs: [
    { key: "title", label: "Blog Title", type: "text" },
    { key: "slug", label: "SEO URL Slug", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "author", label: "Author", type: "text" },
    { key: "publishedAt", label: "Published Date", type: "date" },
    { key: "excerpt", label: "Excerpt", type: "textarea", full: true },
    { key: "content", label: "Article Content", type: "textarea", full: true },
    { key: "image", label: "Featured Image URL", type: "url", full: true },
    { key: "relatedServices", label: "Related Service Slugs", type: "array", full: true },
    { key: "relatedProducts", label: "Related Product Slugs", type: "array", full: true },
    { key: "seo", label: "SEO", type: "seo", full: true },
  ],
  bookings: [
    { key: "serviceTitle", label: "Service Title", type: "text" },
    { key: "serviceSlug", label: "Service Slug", type: "text" },
    { key: "date", label: "Date", type: "date" },
    { key: "time", label: "Time", type: "time" },
    { key: "name", label: "Customer Name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "payment", label: "Payment", type: "select", options: ["pay_at_spa", "online", "deposit"] },
    { key: "status", label: "Booking Status", type: "select", options: ["pending", "confirmed", "completed", "cancelled"] },
    { key: "total", label: "Total", type: "number" },
    { key: "notes", label: "Notes", type: "textarea", full: true },
    { key: "createdAt", label: "Created At", type: "datetime" },
  ],
  orders: [
    { key: "customerName", label: "Customer Name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "payment", label: "Payment", type: "select", options: ["cod", "card", "upi"] },
    { key: "status", label: "Order Status", type: "select", options: ["pending", "paid", "shipped", "delivered"] },
    { key: "total", label: "Total", type: "number" },
    { key: "address", label: "Address", type: "textarea", full: true },
    { key: "items", label: "Order Items", type: "orderItems", full: true },
    { key: "createdAt", label: "Created At", type: "datetime" },
  ],
  leads: [
    { key: "name", label: "Lead Name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "subject", label: "Subject", type: "text" },
    { key: "source", label: "Source", type: "text" },
    { key: "status", label: "Lead Status", type: "select", options: ["new", "contacted", "won", "lost"] },
    { key: "message", label: "Message", type: "textarea", full: true },
    { key: "createdAt", label: "Created At", type: "datetime" },
  ],
};

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item ?? "")) : [];
}

function toDateTimeLocal(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string) {
  return value ? new Date(value).toISOString() : "";
}

function StringListEditor({
  label,
  value,
  onChange,
  placeholder = "Add item",
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  const update = (index: number, nextValue: string) => {
    onChange(value.map((item, itemIndex) => (itemIndex === index ? nextValue : item)));
  };

  return (
    <div className="rounded-lg border border-charcoal/10 bg-white/70 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-charcoal">{label}</p>
        <button type="button" onClick={() => onChange([...value, ""])} className="outline-button px-3 py-2 text-xs font-semibold">
          Add
        </button>
      </div>
      <div className="grid gap-2">
        {value.length === 0 && <p className="rounded-lg bg-porcelain px-4 py-3 text-sm text-charcoal/50">No items yet.</p>}
        {value.map((item, index) => (
          <div key={`${label}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input value={item} onChange={(event) => update(index, event.target.value)} placeholder={placeholder} className={inputClass} />
            <button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} className="rounded-full border border-rose/20 bg-rose/10 px-4 py-2 text-sm font-semibold text-rose">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeoEditor({ value, onChange }: { value: unknown; onChange: (value: Record<string, string>) => void }) {
  const seo = typeof value === "object" && value ? (value as Record<string, string>) : { title: "", description: "" };
  return (
    <div className="rounded-lg border border-charcoal/10 bg-white/70 p-4">
      <p className="mb-3 text-sm font-bold text-charcoal">SEO</p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-charcoal">
          Meta Title
          <input value={seo.title ?? ""} onChange={(event) => onChange({ ...seo, title: event.target.value })} className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-charcoal">
          Meta Description
          <textarea value={seo.description ?? ""} onChange={(event) => onChange({ ...seo, description: event.target.value })} className={textareaClass} />
        </label>
      </div>
    </div>
  );
}

function ReviewsEditor({ value, onChange }: { value: unknown; onChange: (value: Array<Record<string, unknown>>) => void }) {
  const reviews = Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
  const update = (index: number, patch: Record<string, unknown>) => {
    onChange(reviews.map((review, reviewIndex) => (reviewIndex === index ? { ...review, ...patch } : review)));
  };

  return (
    <div className="rounded-lg border border-charcoal/10 bg-white/70 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-charcoal">Reviews</p>
        <button type="button" onClick={() => onChange([...reviews, { name: "", rating: 5, quote: "" }])} className="outline-button px-3 py-2 text-xs font-semibold">
          Add Review
        </button>
      </div>
      <div className="grid gap-3">
        {reviews.map((review, index) => (
          <div key={`review-${index}`} className="rounded-lg border border-charcoal/10 bg-porcelain p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_110px_auto]">
              <input value={String(review.name ?? "")} onChange={(event) => update(index, { name: event.target.value })} placeholder="Reviewer name" className={inputClass} />
              <input value={String(review.rating ?? 5)} onChange={(event) => update(index, { rating: Number(event.target.value) })} type="number" min={1} max={5} className={inputClass} />
              <button type="button" onClick={() => onChange(reviews.filter((_, reviewIndex) => reviewIndex !== index))} className="rounded-full border border-rose/20 bg-rose/10 px-4 py-2 text-sm font-semibold text-rose">
                Remove
              </button>
            </div>
            <textarea value={String(review.quote ?? "")} onChange={(event) => update(index, { quote: event.target.value })} placeholder="Review quote" className={`${textareaClass} mt-3 w-full`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderItemsEditor({ value, onChange }: { value: unknown; onChange: (value: Array<Record<string, unknown>>) => void }) {
  const orderItems = Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
  const update = (index: number, patch: Record<string, unknown>) => {
    onChange(orderItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className="rounded-lg border border-charcoal/10 bg-white/70 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-charcoal">Order Items</p>
        <button type="button" onClick={() => onChange([...orderItems, { productSlug: "", title: "", quantity: 1, price: 0 }])} className="outline-button px-3 py-2 text-xs font-semibold">
          Add Item
        </button>
      </div>
      <div className="grid gap-3">
        {orderItems.map((item, index) => (
          <div key={`order-item-${index}`} className="grid gap-3 rounded-lg border border-charcoal/10 bg-porcelain p-4 lg:grid-cols-[1fr_1fr_100px_120px_auto]">
            <input value={String(item.productSlug ?? "")} onChange={(event) => update(index, { productSlug: event.target.value })} placeholder="Product slug" className={inputClass} />
            <input value={String(item.title ?? "")} onChange={(event) => update(index, { title: event.target.value })} placeholder="Product title" className={inputClass} />
            <input value={String(item.quantity ?? 1)} onChange={(event) => update(index, { quantity: Number(event.target.value) })} type="number" min={1} className={inputClass} />
            <input value={String(item.price ?? 0)} onChange={(event) => update(index, { price: Number(event.target.value) })} type="number" min={0} className={inputClass} />
            <button type="button" onClick={() => onChange(orderItems.filter((_, itemIndex) => itemIndex !== index))} className="rounded-full border border-rose/20 bg-rose/10 px-4 py-2 text-sm font-semibold text-rose">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: EditorField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (field.type === "checkbox") {
    return (
      <label className="flex min-h-[72px] items-center justify-between gap-4 rounded-lg border border-charcoal/10 bg-white px-4 py-3 text-sm font-semibold text-charcoal">
        <span>{field.label}</span>
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="size-5 accent-gold-deep" />
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="grid gap-2 text-sm font-semibold text-charcoal">
        {field.label}
        <textarea value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} className={textareaClass} />
      </label>
    );
  }

  if (field.type === "select") {
    const options = field.options ?? [];
    return (
      <label className="grid gap-2 text-sm font-semibold text-charcoal">
        {field.label}
        <select value={String(value ?? options[0] ?? "")} onChange={(event) => onChange(event.target.value)} className={inputClass}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "array") {
    return <StringListEditor label={field.label} value={asStringArray(value)} onChange={onChange} />;
  }

  if (field.type === "seo") {
    return <SeoEditor value={value} onChange={onChange} />;
  }

  if (field.type === "reviews") {
    return <ReviewsEditor value={value} onChange={onChange} />;
  }

  if (field.type === "orderItems") {
    return <OrderItemsEditor value={value} onChange={onChange} />;
  }

  const htmlType =
    field.type === "number" || field.type === "date" || field.type === "time" || field.type === "email" || field.type === "url"
      ? field.type
      : field.type === "datetime"
        ? "datetime-local"
        : "text";
  const inputValue = field.type === "datetime" ? toDateTimeLocal(value) : String(value ?? "");

  return (
    <label className="grid gap-2 text-sm font-semibold text-charcoal">
      {field.label}
      <input
        type={htmlType}
        value={inputValue}
        onChange={(event) => {
          if (field.type === "number") {
            onChange(event.target.value === "" ? undefined : Number(event.target.value));
            return;
          }
          if (field.type === "datetime") {
            onChange(fromDateTimeLocal(event.target.value));
            return;
          }
          onChange(event.target.value);
        }}
        placeholder={field.placeholder}
        className={inputClass}
      />
    </label>
  );
}

function CollectionManager({
  collection,
  data,
  role,
  onReload,
}: {
  collection: CollectionName;
  data: CMSData;
  role: Role;
  onReload: () => Promise<void>;
}) {
  const items = data[collection] as CMSItem[];
  const [editing, setEditing] = useState<EditableItem | null>(null);
  const [error, setError] = useState("");
  const canDelete = role === "Admin" || (role === "Manager" && !["orders", "leads"].includes(collection));
  const canWrite = role === "Admin" || (role === "Manager" && collection !== "orders") || (role === "Staff" && ["bookings", "leads"].includes(collection));

  const startCreate = () => {
    const item = templateFor(collection) as EditableItem;
    setEditing(item);
    setError("");
  };

  const startEdit = (item: CMSItem) => {
    setEditing({ ...(item as unknown as EditableItem) });
    setError("");
  };

  const saveItem = async () => {
    if (!editing) return;
    try {
      const id = editing.id ? String(editing.id) : "";
      const response = await fetch(id ? `/api/content/${collection}/${id}` : `/api/content/${collection}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!response.ok) throw new Error((await response.json()).error ?? "Unable to save");
      setEditing(null);
      await onReload();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save");
    }
  };

  const deleteOne = async (id: string) => {
    const response = await fetch(`/api/content/${collection}/${id}`, { method: "DELETE" });
    if (response.ok) await onReload();
  };

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditing((current) => (current ? { ...current, image: reader.result } : current));
    };
    reader.readAsDataURL(file);
  };

  const exportLeads = () => {
    const rows = data.leads.map((lead) => [lead.name, lead.email, lead.phone, lead.subject, lead.status, lead.createdAt]);
    const csv = [["Name", "Email", "Phone", "Subject", "Status", "Created"], ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "aura-contact-leads.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-charcoal/56">Manage</p>
          <h2 className="font-serif text-4xl text-charcoal">{collectionLabels[collection]}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {collection === "leads" && (
            <button type="button" onClick={exportLeads} className="outline-button inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
              <Download size={16} /> Export CSV
            </button>
          )}
          {canWrite && (
            <button type="button" onClick={startCreate} className="gold-button inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
              <Plus size={16} /> New
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-charcoal/10 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <h3 className="truncate font-serif text-2xl text-charcoal">{getItemTitle(item)}</h3>
                <p className="mt-1 text-sm text-charcoal/56">{getItemSubtitle(item)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {canWrite && (
                  <button type="button" onClick={() => startEdit(item)} className="outline-button inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
                    <Edit3 size={15} /> Edit
                  </button>
                )}
                {canDelete && (
                  <button type="button" onClick={() => deleteOne(item.id)} className="inline-flex items-center gap-2 rounded-full border border-rose/20 bg-rose/10 px-4 py-2 text-sm font-semibold text-rose">
                    <Trash2 size={15} /> Delete
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/72 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-auto rounded-lg bg-porcelain p-6 shadow-2xl">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-charcoal/10 pb-5">
              <div>
                <p className="text-sm font-semibold text-charcoal/56">{collectionLabels[collection]}</p>
                <h3 className="font-serif text-4xl text-charcoal">{editing.id ? "Edit Content" : "New Content"}</h3>
              </div>
              <label className="outline-button inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold">
                <ImagePlus size={16} />
                Upload image
                <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
              </label>
            </div>
            {"image" in editing && typeof editing.image === "string" && editing.image && (
              <div className="mb-6 overflow-hidden rounded-lg border border-charcoal/10 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={editing.image} alt="Current content preview" className="h-48 w-full object-cover" />
              </div>
            )}
            <div className="grid gap-5 md:grid-cols-2">
              {editorSchemas[collection].map((field) => (
                <div key={field.key} className={field.full ? "md:col-span-2" : undefined}>
                  <FieldEditor
                    field={field}
                    value={editing[field.key]}
                    onChange={(value) => setEditing((current) => (current ? { ...current, [field.key]: value } : current))}
                  />
                </div>
              ))}
            </div>
            {error && <p className="mt-3 rounded-lg bg-rose/12 px-4 py-3 text-sm font-semibold text-rose">{error}</p>}
            <div className="sticky bottom-0 -mx-6 mt-6 flex flex-wrap justify-end gap-3 border-t border-charcoal/10 bg-porcelain/95 px-6 py-4 backdrop-blur">
              <button type="button" onClick={() => setEditing(null)} className="outline-button px-5 py-3 text-sm font-semibold">
                Cancel
              </button>
              <button type="button" onClick={saveItem} className="gold-button inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">
                <Save size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavLinksEditor({
  title,
  value,
  onChange,
}: {
  title: string;
  value: Array<{ id: string; label: string; href: string }>;
  onChange: (value: Array<{ id: string; label: string; href: string }>) => void;
}) {
  const update = (index: number, patch: Partial<{ id: string; label: string; href: string }>) => {
    onChange(value.map((link, linkIndex) => (linkIndex === index ? { ...link, ...patch } : link)));
  };

  return (
    <div className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-3xl text-charcoal">{title}</h3>
        <button
          type="button"
          onClick={() => onChange([...value, { id: `link-${Date.now()}`, label: "New Link", href: "/" }])}
          className="outline-button px-4 py-2 text-sm font-semibold"
        >
          Add Link
        </button>
      </div>
      <div className="grid gap-3">
        {value.map((link, index) => (
          <div key={link.id} className="grid gap-3 rounded-lg border border-charcoal/10 bg-porcelain p-4 lg:grid-cols-[1fr_1fr_1.4fr_auto]">
            <input value={link.id} onChange={(event) => update(index, { id: event.target.value })} placeholder="ID" className={inputClass} />
            <input value={link.label} onChange={(event) => update(index, { label: event.target.value })} placeholder="Label" className={inputClass} />
            <input value={link.href} onChange={(event) => update(index, { href: event.target.value })} placeholder="URL" className={inputClass} />
            <button type="button" onClick={() => onChange(value.filter((_, linkIndex) => linkIndex !== index))} className="rounded-full border border-rose/20 bg-rose/10 px-4 py-2 text-sm font-semibold text-rose">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsManager({ settings, onReload }: { settings: SiteSettings; onReload: () => Promise<void> }) {
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [status, setStatus] = useState("");

  async function saveSettings() {
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!response.ok) throw new Error((await response.json()).error ?? "Unable to save settings");
      setStatus("Settings saved.");
      await onReload();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save settings");
    }
  }

  const setField = <Key extends keyof SiteSettings>(key: Key, value: SiteSettings[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-semibold text-charcoal/56">Site Settings</p>
        <h2 className="font-serif text-4xl text-charcoal">Header, Footer, Homepage</h2>
      </div>
      <div className="grid gap-5">
        <section className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-serif text-3xl text-charcoal">Business Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-charcoal">
              Site Name
              <input value={draft.siteName} onChange={(event) => setField("siteName", event.target.value)} className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-charcoal">
              Email
              <input type="email" value={draft.email} onChange={(event) => setField("email", event.target.value)} className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-charcoal">
              Phone
              <input value={draft.phone} onChange={(event) => setField("phone", event.target.value)} className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-charcoal">
              WhatsApp URL
              <input value={draft.whatsapp} onChange={(event) => setField("whatsapp", event.target.value)} className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-charcoal md:col-span-2">
              Tagline
              <textarea value={draft.tagline} onChange={(event) => setField("tagline", event.target.value)} className={textareaClass} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-charcoal md:col-span-2">
              Address
              <textarea value={draft.address} onChange={(event) => setField("address", event.target.value)} className={textareaClass} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-charcoal md:col-span-2">
              Google Map Embed URL
              <input value={draft.mapEmbed} onChange={(event) => setField("mapEmbed", event.target.value)} className={inputClass} />
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-serif text-3xl text-charcoal">Homepage Hero</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-charcoal">
              Hero Title
              <input value={draft.heroTitle} onChange={(event) => setField("heroTitle", event.target.value)} className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-charcoal">
              Announcement
              <input value={draft.announcement} onChange={(event) => setField("announcement", event.target.value)} className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-charcoal md:col-span-2">
              Hero Subtitle
              <textarea value={draft.heroSubtitle} onChange={(event) => setField("heroSubtitle", event.target.value)} className={textareaClass} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-charcoal md:col-span-2">
              Hero Image URL
              <input value={draft.heroImage} onChange={(event) => setField("heroImage", event.target.value)} className={inputClass} />
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-serif text-3xl text-charcoal">Homepage Sections</h3>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(draft.homepageSections).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between gap-3 rounded-lg border border-charcoal/10 bg-porcelain px-4 py-3 text-sm font-semibold capitalize text-charcoal">
                {key.replace(/([A-Z])/g, " $1")}
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      homepageSections: { ...current.homepageSections, [key]: event.target.checked },
                    }))
                  }
                  className="size-5 accent-gold-deep"
                />
              </label>
            ))}
          </div>
        </section>

        <NavLinksEditor title="Header Links" value={draft.headerLinks} onChange={(value) => setField("headerLinks", value)} />
        <NavLinksEditor title="Footer Quick Links" value={draft.footerQuickLinks} onChange={(value) => setField("footerQuickLinks", value)} />
        <NavLinksEditor title="Footer Service Links" value={draft.footerServiceLinks} onChange={(value) => setField("footerServiceLinks", value)} />
        <NavLinksEditor title="Footer Support Links" value={draft.footerSupportLinks} onChange={(value) => setField("footerSupportLinks", value)} />
        <NavLinksEditor title="Social Links" value={draft.socialLinks} onChange={(value) => setField("socialLinks", value)} />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-charcoal/56">{status}</p>
          <button type="button" onClick={saveSettings} className="gold-button inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [data, setData] = useState<CMSData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [view, setView] = useState<"overview" | "settings" | CollectionName>("overview");
  const [checking, setChecking] = useState(true);

  const loadContent = async () => {
    const response = await fetch("/api/content", { cache: "no-store" });
    const json = await response.json();
    setData(json.data);
    setStats(json.stats);
  };

  useEffect(() => {
    const boot = async () => {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (response.ok) {
        const json = await response.json();
        setUser(json.user);
        await loadContent();
      }
      setChecking(false);
    };
    boot();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setData(null);
  };

  if (checking) {
    return <div className="grid min-h-screen place-items-center bg-charcoal text-porcelain">Loading dashboard...</div>;
  }

  if (!user) {
    return (
      <LoginPanel
        onLogin={async (nextUser) => {
          setUser(nextUser);
          await loadContent();
        }}
      />
    );
  }

  if (!data || !stats) {
    return <div className="grid min-h-screen place-items-center bg-charcoal text-porcelain">Loading content...</div>;
  }

  return (
    <div className="admin-grid min-h-screen bg-[#f5f1e9]">
      <aside className="border-r border-charcoal/10 bg-charcoal p-5 text-porcelain">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase text-champagne">Aura Admin</p>
          <h1 className="mt-2 font-serif text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-porcelain/62">{user.name} · {user.role}</p>
        </div>
        <nav className="grid gap-2">
          <button type="button" onClick={() => setView("overview")} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold ${view === "overview" ? "bg-white text-charcoal" : "text-porcelain/72 hover:bg-white/10"}`}>
            <LayoutDashboard size={17} /> Overview
          </button>
          {collectionNames.map((name) => (
            <button key={name} type="button" onClick={() => setView(name)} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold ${view === name ? "bg-white text-charcoal" : "text-porcelain/72 hover:bg-white/10"}`}>
              {collectionLabels[name]}
            </button>
          ))}
          {(user.role === "Admin" || user.role === "Manager") && (
            <button type="button" onClick={() => setView("settings")} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold ${view === "settings" ? "bg-white text-charcoal" : "text-porcelain/72 hover:bg-white/10"}`}>
              <Settings size={17} /> Site Settings
            </button>
          )}
        </nav>
        <button type="button" onClick={logout} className="mt-8 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-porcelain/72 hover:bg-white/10">
          <LogOut size={17} /> Logout
        </button>
      </aside>
      <main className="min-w-0 p-4 md:p-8">
        {view === "overview" && <Overview data={data} stats={stats} />}
        {view === "settings" && <SettingsManager settings={data.settings} onReload={loadContent} />}
        {collectionNames.includes(view as CollectionName) && (
          <CollectionManager collection={view as CollectionName} data={data} role={user.role} onReload={loadContent} />
        )}
      </main>
    </div>
  );
}
