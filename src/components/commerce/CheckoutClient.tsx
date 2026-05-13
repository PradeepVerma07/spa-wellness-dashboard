"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import type { CartItem } from "@/components/commerce/CartClient";
import { formatCurrency } from "@/lib/utils";

function readCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("aura-cart") ?? "[]") as CartItem[];
  } catch {
    return [];
  }
}

export function CheckoutClient() {
  const [items, setItems] = useState<CartItem[]>(readCart);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;
    setStatus("submitting");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/content/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: form.get("customerName"),
        email: form.get("email"),
        phone: form.get("phone"),
        address: form.get("address"),
        payment: form.get("payment"),
        items: items.map((item) => ({
          productSlug: item.slug,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
      }),
    });
    if (response.ok) {
      localStorage.removeItem("aura-cart");
      window.dispatchEvent(new Event("aura-cart"));
      setItems([]);
      setStatus("success");
      event.currentTarget.reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <form onSubmit={submit} className="soft-card grid gap-5 p-6">
        <h2 className="font-serif text-4xl text-charcoal">Billing Details</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-charcoal">
            Name
            <input name="customerName" required className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
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
        <label className="grid gap-2 text-sm font-semibold text-charcoal">
          Address
          <textarea name="address" rows={4} required className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
        </label>
        <fieldset className="grid gap-3">
          <legend className="text-sm font-semibold text-charcoal">Payment gateway</legend>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["upi", "UPI"],
              ["card", "Card"],
              ["cod", "Cash on delivery"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 rounded-lg border border-charcoal/10 bg-white px-4 py-3 text-sm">
                <input type="radio" name="payment" value={value} defaultChecked={value === "upi"} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" disabled={!items.length || status === "submitting"} className="gold-button magnetic inline-flex w-fit items-center gap-2 px-6 py-3 text-sm font-semibold disabled:opacity-60">
          <CreditCard size={17} />
          {status === "submitting" ? "Placing order..." : "Place Order"}
        </button>
        {status === "success" && <p className="rounded-lg bg-sage/12 px-4 py-3 text-sm font-semibold text-sage">Order placed. Your confirmation has been received.</p>}
        {status === "error" && <p className="rounded-lg bg-rose/12 px-4 py-3 text-sm font-semibold text-rose">Unable to place the order. Please try again.</p>}
      </form>
      <aside className="soft-card h-fit p-6">
        <h2 className="font-serif text-4xl text-charcoal">Order Summary</h2>
        {items.length ? (
          <div className="mt-5 grid gap-3">
            {items.map((item) => (
              <div key={item.slug} className="flex justify-between gap-4 border-b border-charcoal/10 pb-3 text-sm">
                <span className="text-charcoal/68">
                  {item.title} x {item.quantity}
                </span>
                <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-sm leading-7 text-charcoal/64">Your cart is empty.</p>
            <Link href="/shop" className="outline-button mt-4 inline-flex px-5 py-3 text-sm font-semibold">
              Return to shop
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
