"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map((project) => project.category)))], [projects]);
  const filtered = category === "All" ? projects : projects.filter((project) => project.category === category);

  return (
    <div>
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
      <div className="stagger-group grid gap-5 lg:grid-cols-3">
        {filtered.map((project, index) => (
          <article key={project.id} className={cn("stagger-card soft-card group overflow-hidden", index === 0 && "lg:col-span-2")}>
            <Link href={`/projects/${project.slug}`} className={cn("image-zoom block", index === 0 ? "aspect-[16/9]" : "aspect-[4/3]")}>
              <Image src={project.image} alt={project.title} width={1000} height={700} className="h-full w-full object-cover" />
            </Link>
            <div className="p-6">
              <p className="text-xs font-bold uppercase text-gold-deep">{project.category}</p>
              <h3 className="mt-2 font-serif text-3xl text-charcoal">{project.title}</h3>
              <p className="mt-3 text-sm leading-7 text-charcoal/64">{project.excerpt}</p>
              <Link href={`/projects/${project.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold-deep">
                View project <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
