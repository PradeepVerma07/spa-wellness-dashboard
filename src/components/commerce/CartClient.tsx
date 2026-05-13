"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export type CartItem = {
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

function readCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("aura-cart") ?? "[]") as CartItem[];
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  localStorage.setItem("aura-cart", JSON.stringify(items));
  window.dispatchEvent(new Event("aura-cart"));
}

export function CartClient() {
  const [items, setItems] = useState<CartItem[]>(readCart);
  const [coupon, setCoupon] = useState("");
  const discount = coupon.trim().toUpperCase() === "AURA10" ? 0.1 : 0;

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const total = subtotal - subtotal * discount;

  const updateQuantity = (slug: string, quantity: number) => {
    const next = items.map((item) => (item.slug === slug ? { ...item, quantity: Math.max(1, quantity) } : item));
    setItems(next);
    save(next);
  };

  const remove = (slug: string) => {
    const next = items.filter((item) => item.slug !== slug);
    setItems(next);
    save(next);
  };

  if (items.length === 0) {
    return (
      <div className="soft-card mx-auto max-w-xl p-8 text-center">
        <ShoppingBag className="mx-auto text-gold-deep" size={38} />
        <h2 className="mt-4 font-serif text-4xl text-charcoal">Your cart is quiet</h2>
        <p className="mt-3 text-sm leading-7 text-charcoal/64">Explore spa products, self-care rituals, and beauty essentials.</p>
        <Link href="/shop" className="gold-button mt-6 inline-flex px-6 py-3 text-sm font-semibold">
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-4">
        {items.map((item) => (
          <article key={item.slug} className="soft-card grid gap-4 p-4 sm:grid-cols-[110px_1fr_auto] sm:items-center">
            <Image src={item.image} alt={item.title} width={220} height={220} className="aspect-square rounded-lg object-cover" />
            <div>
              <Link href={`/shop/${item.slug}`} className="font-serif text-3xl text-charcoal transition hover:text-gold-deep">
                {item.title}
              </Link>
              <p className="mt-2 text-sm font-semibold text-charcoal/62">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="grid size-10 place-items-center rounded-full border border-charcoal/10 bg-white">
                <Minus size={16} />
              </button>
              <span className="grid size-10 place-items-center rounded-full bg-white text-sm font-bold">{item.quantity}</span>
              <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="grid size-10 place-items-center rounded-full border border-charcoal/10 bg-white">
                <Plus size={16} />
              </button>
              <button type="button" onClick={() => remove(item.slug)} className="grid size-10 place-items-center rounded-full border border-rose/20 bg-rose/10 text-rose">
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <aside className="soft-card h-fit p-6">
        <h2 className="font-serif text-4xl text-charcoal">Order Summary</h2>
        <label className="mt-5 grid gap-2 text-sm font-semibold text-charcoal">
          Coupon code
          <input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Try AURA10" className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
        </label>
        <dl className="mt-6 grid gap-3 text-sm">
          <div className="flex justify-between border-b border-charcoal/10 pb-3">
            <dt className="text-charcoal/56">Subtotal</dt>
            <dd className="font-semibold">{formatCurrency(subtotal)}</dd>
          </div>
          <div className="flex justify-between border-b border-charcoal/10 pb-3">
            <dt className="text-charcoal/56">Discount</dt>
            <dd className="font-semibold">{discount ? "10%" : "-"}</dd>
          </div>
          <div className="flex justify-between text-lg">
            <dt className="font-bold">Total</dt>
            <dd className="font-bold">{formatCurrency(total)}</dd>
          </div>
        </dl>
        <Link href="/checkout" className="gold-button mt-6 inline-flex w-full justify-center px-6 py-3 text-sm font-semibold">
          Checkout
        </Link>
      </aside>
    </div>
  );
}
