import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-charcoal/62">
      <Link href="/" className="transition hover:text-gold-deep">
        Home
      </Link>
      {items.map((item) => (
        <span key={`${item.label}-${item.href ?? "current"}`} className="flex items-center gap-2">
          <ChevronRight size={14} />
          {item.href ? (
            <Link href={item.href} className="transition hover:text-gold-deep">
              {item.label}
            </Link>
          ) : (
            <span className="text-charcoal">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
