"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Clock } from "lucide-react";
import type { Service } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

export function ServiceGrid({ services }: { services: Service[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(services.map((service) => service.category)))], [services]);
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? services : services.filter((service) => service.category === active);

  return (
    <div>
      <div className="reveal mb-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setActive(category)}
            className={cn(
              "focus-ring shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
              active === category
                ? "border-gold-deep bg-gold-deep text-white"
                : "border-charcoal/10 bg-white/72 text-charcoal/68 hover:border-champagne/70",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="stagger-group grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((service) => (
          <article key={service.id} className="stagger-card soft-card group overflow-hidden">
            <Link href={`/services/${service.slug}`} className="image-zoom block aspect-[4/3]">
              <Image src={service.image} alt={service.title} width={800} height={600} className="h-full w-full object-cover" />
            </Link>
            <div className="p-6">
              <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold uppercase text-gold-deep">
                <span>{service.category}</span>
                <span className="flex items-center gap-1 text-charcoal/50">
                  <Clock size={14} /> {service.duration}
                </span>
              </div>
              <h3 className="font-serif text-3xl leading-tight text-charcoal">
                <Link href={`/services/${service.slug}`} className="transition group-hover:text-gold-deep">
                  {service.title}
                </Link>
              </h3>
              <p className="mt-3 min-h-16 text-sm leading-7 text-charcoal/65">{service.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <span className="text-lg font-bold text-charcoal">{formatCurrency(service.price)}</span>
                <div className="flex gap-2">
                  <Link href={`/booking?service=${service.slug}`} className="gold-button inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
                    <CalendarCheck size={16} />
                    Book
                  </Link>
                  <Link href={`/services/${service.slug}`} className="outline-button inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
