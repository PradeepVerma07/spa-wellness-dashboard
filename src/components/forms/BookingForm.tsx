"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import type { Service } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function BookingForm({ services }: { services: Service[] }) {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") ?? services[0]?.slug ?? "";
  const [serviceSlug, setServiceSlug] = useState(initialService);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const selected = useMemo(() => services.find((service) => service.slug === serviceSlug) ?? services[0], [serviceSlug, services]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = new FormData(event.currentTarget);
    const body = {
      serviceSlug,
      serviceTitle: selected?.title,
      total: selected?.price ?? 0,
      date: form.get("date"),
      time: form.get("time"),
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      payment: form.get("payment"),
      notes: form.get("notes"),
    };
    const response = await fetch("/api/content/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="reveal glass-card p-6">
        <p className="eyebrow">Selected Ritual</p>
        {selected && (
          <>
            <h2 className="mt-3 font-serif text-4xl text-charcoal">{selected.title}</h2>
            <p className="mt-3 text-sm leading-7 text-charcoal/65">{selected.excerpt}</p>
            <dl className="mt-6 grid gap-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-charcoal/10 pb-3">
                <dt className="text-charcoal/55">Duration</dt>
                <dd className="font-semibold">{selected.duration}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-charcoal/10 pb-3">
                <dt className="text-charcoal/55">Investment</dt>
                <dd className="font-semibold">{formatCurrency(selected.price)}</dd>
              </div>
            </dl>
          </>
        )}
      </aside>

      <form onSubmit={submit} className="reveal soft-card grid gap-5 p-6">
        <label className="grid gap-2 text-sm font-semibold text-charcoal">
          Service
          <select value={serviceSlug} onChange={(event) => setServiceSlug(event.target.value)} className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne">
            {services.map((service) => (
              <option key={service.id} value={service.slug}>
                {service.title} - {formatCurrency(service.price)}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-charcoal">
            Date
            <input name="date" type="date" required className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-charcoal">
            Time
            <input name="time" type="time" required className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
          </label>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-charcoal">
            Name
            <input name="name" required className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-charcoal">
            Phone
            <input name="phone" required className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-charcoal">
          Email
          <input name="email" type="email" required className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
        </label>
        <fieldset className="grid gap-3">
          <legend className="text-sm font-semibold text-charcoal">Payment option</legend>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["pay_at_spa", "Pay at spa"],
              ["deposit", "Pay deposit"],
              ["online", "Online payment"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 rounded-lg border border-charcoal/10 bg-white px-4 py-3 text-sm">
                <input type="radio" name="payment" value={value} defaultChecked={value === "pay_at_spa"} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="grid gap-2 text-sm font-semibold text-charcoal">
          Notes
          <textarea name="notes" rows={4} className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
        </label>
        <button type="submit" disabled={status === "submitting"} className="gold-button magnetic inline-flex w-fit items-center gap-2 px-6 py-3 text-sm font-semibold disabled:opacity-60">
          <CalendarCheck size={17} />
          {status === "submitting" ? "Confirming..." : "Confirm Booking"}
        </button>
        {status === "success" && <p className="rounded-lg bg-sage/12 px-4 py-3 text-sm font-semibold text-sage">Booking request received. Our team will confirm shortly.</p>}
        {status === "error" && <p className="rounded-lg bg-rose/12 px-4 py-3 text-sm font-semibold text-rose">Something went wrong. Please try again.</p>}
      </form>
    </div>
  );
}
