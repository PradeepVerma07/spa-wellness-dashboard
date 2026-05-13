"use client";

import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import type { Product } from "@/lib/types";

export function BuyNowButton({ product }: { product: Product }) {
  const router = useRouter();

  const buy = () => {
    const existing = JSON.parse(localStorage.getItem("aura-cart") ?? "[]") as Array<{
      slug: string;
      title: string;
      price: number;
      image: string;
      quantity: number;
    }>;
    const found = existing.find((item) => item.slug === product.slug);
    const next = found
      ? existing.map((item) => (item.slug === product.slug ? { ...item, quantity: Math.max(item.quantity, 1) } : item))
      : [...existing, { slug: product.slug, title: product.title, price: product.price, image: product.image, quantity: 1 }];
    localStorage.setItem("aura-cart", JSON.stringify(next));
    window.dispatchEvent(new Event("aura-cart"));
    router.push("/checkout");
  };

  return (
    <button type="button" onClick={buy} className="outline-button inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold">
      <CreditCard size={17} />
      Buy Now
    </button>
  );
}
