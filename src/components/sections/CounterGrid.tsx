"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/utils";

export type CounterItem = {
  label: string;
  value: number;
  type?: "number" | "currency";
};

function Counter({ item }: { item: CounterItem }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          setValue(Math.round(item.value * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [item.value]);

  return (
    <div ref={ref} className="stagger-card glass-card p-6">
      <p className="font-serif text-5xl text-charcoal">{item.type === "currency" ? formatCurrency(value) : value.toLocaleString("en-IN")}</p>
      <p className="mt-2 text-sm font-semibold text-charcoal/58">{item.label}</p>
    </div>
  );
}

export function CounterGrid({ items }: { items: CounterItem[] }) {
  return (
    <div className="stagger-group grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Counter key={item.label} item={item} />
      ))}
    </div>
  );
}
