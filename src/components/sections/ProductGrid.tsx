"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, SlidersHorizontal, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

type SortMode = "popular" | "price-low" | "price-high";

function addToCart(product: Product) {
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
}

export function ProductGrid({ products }: { products: Product[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("popular");
  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((product) => product.category)))], [products]);
  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return products
      .filter((product) => category === "All" || product.category === category)
      .filter((product) => [product.title, product.excerpt, product.category].join(" ").toLowerCase().includes(lower))
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        return b.popularity - a.popularity;
      });
  }, [category, products, query, sort]);

  return (
    <div>
      <div className="reveal mb-8 grid gap-3 rounded-lg border border-charcoal/10 bg-white/70 p-3 shadow-sm lg:grid-cols-[1fr_auto_auto]">
        <label className="flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm text-charcoal/60">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="w-full bg-transparent text-charcoal outline-none placeholder:text-charcoal/40"
          />
        </label>
        <label className="flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm text-charcoal/60">
          <SlidersHorizontal size={18} />
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="bg-transparent text-charcoal outline-none">
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} className="rounded-full bg-white px-4 py-3 text-sm text-charcoal outline-none">
          <option value="popular">Sort by popularity</option>
          <option value="price-low">Price low to high</option>
          <option value="price-high">Price high to low</option>
        </select>
      </div>

      <div className="stagger-group grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <article key={product.id} className="stagger-card soft-card group overflow-hidden">
            <Link href={`/shop/${product.slug}`} className="image-zoom block aspect-square bg-mist">
              <Image src={product.image} alt={product.title} width={800} height={800} className="h-full w-full object-cover" />
            </Link>
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase text-gold-deep">{product.category}</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-charcoal/58">
                  <Star size={14} className="fill-champagne text-champagne" /> {Math.round(product.popularity)}
                </span>
              </div>
              <h3 className="font-serif text-3xl text-charcoal">
                <Link href={`/shop/${product.slug}`} className="transition group-hover:text-gold-deep">
                  {product.title}
                </Link>
              </h3>
              <p className="mt-3 min-h-14 text-sm leading-7 text-charcoal/64">{product.excerpt}</p>
              <div className="mt-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-charcoal">{formatCurrency(product.price)}</p>
                  <p className={cn("text-xs", product.inventory < 30 ? "text-rose" : "text-sage")}>
                    {product.inventory} in stock
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="gold-button inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
                >
                  <ShoppingBag size={16} />
                  Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
