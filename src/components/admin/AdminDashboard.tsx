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
  const [editing, setEditing] = useState<CMSItem | null>(null);
  const [json, setJson] = useState("");
  const [error, setError] = useState("");
  const canDelete = role === "Admin" || (role === "Manager" && !["orders", "leads"].includes(collection));
  const canWrite = role === "Admin" || (role === "Manager" && collection !== "orders") || (role === "Staff" && ["bookings", "leads"].includes(collection));

  const startCreate = () => {
    const item = templateFor(collection) as CMSItem;
    setEditing(item);
    setJson(JSON.stringify(item, null, 2));
    setError("");
  };

  const startEdit = (item: CMSItem) => {
    setEditing(item);
    setJson(JSON.stringify(item, null, 2));
    setError("");
  };

  const saveItem = async () => {
    if (!editing) return;
    try {
      const parsed = JSON.parse(json) as Record<string, unknown>;
      const id = "id" in editing ? String(editing.id) : "";
      const response = await fetch(id ? `/api/content/${collection}/${id}` : `/api/content/${collection}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!response.ok) throw new Error((await response.json()).error ?? "Unable to save");
      setEditing(null);
      await onReload();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Invalid JSON");
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
      const parsed = JSON.parse(json) as Record<string, unknown>;
      parsed.image = reader.result;
      setJson(JSON.stringify(parsed, null, 2));
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
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-porcelain p-6 shadow-2xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-serif text-4xl text-charcoal">{editing.id ? "Edit Item" : "New Item"}</h3>
              <label className="outline-button inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold">
                <ImagePlus size={16} />
                Upload image
                <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
              </label>
            </div>
            <textarea value={json} onChange={(event) => setJson(event.target.value)} rows={20} className="w-full rounded-lg border border-charcoal/10 bg-white p-4 font-mono text-sm outline-none focus:border-champagne" />
            {error && <p className="mt-3 rounded-lg bg-rose/12 px-4 py-3 text-sm font-semibold text-rose">{error}</p>}
            <div className="mt-5 flex flex-wrap justify-end gap-3">
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

function SettingsManager({ settings, onReload }: { settings: SiteSettings; onReload: () => Promise<void> }) {
  const [draft, setDraft] = useState(JSON.stringify(settings, null, 2));
  const [status, setStatus] = useState("");

  async function saveSettings() {
    try {
      const parsed = JSON.parse(draft);
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!response.ok) throw new Error((await response.json()).error ?? "Unable to save settings");
      setStatus("Settings saved.");
      await onReload();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Invalid JSON");
    }
  }

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-semibold text-charcoal/56">Site Settings</p>
        <h2 className="font-serif text-4xl text-charcoal">Header, Footer, Homepage</h2>
      </div>
      <div className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={28} className="w-full rounded-lg border border-charcoal/10 bg-porcelain p-4 font-mono text-sm outline-none focus:border-champagne" />
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
