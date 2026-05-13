"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product, label = "Add to cart" }: { product: Product; label?: string }) {
  const [added, setAdded] = useState(false);

  const add = () => {
    const existing = JSON.parse(localStorage.getItem("aura-cart") ?? "[]") as Array<{
      slug: string;
      title: string;
      price: number;
      image: string;
      quantity: number;
    }>;
    const found = existing.find((item) => item.slug === product.slug);
    const next = found
      ? existing.map((item) => (item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item))
      : [...existing, { slug: product.slug, title: product.title, price: product.price, image: product.image, quantity: 1 }];
    localStorage.setItem("aura-cart", JSON.stringify(next));
    window.dispatchEvent(new Event("aura-cart"));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button type="button" onClick={add} className="gold-button magnetic inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold">
      <ShoppingBag size={17} />
      {added ? "Added" : label}
    </button>
  );
}
