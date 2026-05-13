"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Play, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((item) => item.category)))], [items]);
  const filtered = category === "All" ? items : items.filter((item) => item.category === category);

  return (
    <>
      <div className="reveal mb-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setCategory(item)}
            className={cn(
              "focus-ring shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
              category === item ? "border-gold-deep bg-gold-deep text-white" : "border-charcoal/10 bg-white/72 text-charcoal/68",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="stagger-group grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.id} className="stagger-card group relative aspect-[4/5] overflow-hidden rounded-lg bg-charcoal">
            <button type="button" onClick={() => setActive(item)} className="h-full w-full text-left">
              <Image src={item.image} alt={item.title} width={800} height={1000} className="gallery-zoom h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 bg-gradient-to-t from-charcoal/78 via-charcoal/12 to-transparent" />
              <span className="absolute bottom-5 left-5 right-5 text-white">
                <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase text-champagne">
                  {item.type === "video" && <Play size={14} />} {item.category}
                </span>
                <span className="block font-serif text-3xl">{item.title}</span>
              </span>
            </button>
          </article>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-charcoal/82 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-lg bg-porcelain shadow-2xl">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-charcoal"
              aria-label="Close preview"
            >
              <X size={20} />
            </button>
            <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
              <div className="relative min-h-[360px]">
                <Image src={active.image} alt={active.title} fill className="object-cover" sizes="(min-width:1024px) 60vw, 100vw" />
              </div>
              <div className="p-8">
                <p className="eyebrow">{active.category}</p>
                <h3 className="mt-3 font-serif text-4xl text-charcoal">{active.title}</h3>
                <p className="mt-4 text-sm leading-7 text-charcoal/65">
                  {active.type === "video" ? "Video testimonial or treatment story preview." : "Gallery image from the spa, salon, wellness, or project portfolio."}
                </p>
                <Link href={active.relatedHref} className="gold-button mt-7 inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">
                  {active.relatedLabel} <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
