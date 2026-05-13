"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Menu, ShoppingBag, UserCircle, X } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const items = JSON.parse(localStorage.getItem("aura-cart") ?? "[]") as Array<{ quantity?: number }>;
      setCartCount(items.reduce((sum, item) => sum + Number(item.quantity ?? 1), 0));
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("aura-cart", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("aura-cart", update);
    };
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/30 bg-porcelain/82 backdrop-blur-xl">
      <div className="container-pad flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Aura Wellness Spa home">
          <span className="grid size-11 place-items-center rounded-full border border-champagne/40 bg-charcoal text-sm font-semibold text-porcelain">
            AW
          </span>
          <span className="hidden min-w-0 flex-col sm:flex">
            <span className="font-serif text-2xl leading-none text-charcoal">{settings.siteName}</span>
            <span className="text-xs text-charcoal/58">{settings.announcement}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
          {settings.headerLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium text-charcoal/70 transition hover:bg-white/70 hover:text-charcoal",
                isActive(link.href) && "bg-white text-gold-deep shadow-sm",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/booking"
            className="gold-button magnetic hidden items-center gap-2 px-5 py-3 text-sm font-semibold md:flex"
          >
            <CalendarCheck size={17} />
            Book Now
          </Link>
          <Link
            href="/cart"
            className="focus-ring relative grid size-11 place-items-center rounded-full border border-charcoal/10 bg-white/80 text-charcoal transition hover:border-champagne/60"
            aria-label="Cart"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-gold-deep px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin"
            className="focus-ring hidden size-11 place-items-center rounded-full border border-charcoal/10 bg-white/80 text-charcoal transition hover:border-champagne/60 md:grid"
            aria-label="Admin login"
          >
            <UserCircle size={20} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="focus-ring grid size-11 place-items-center rounded-full border border-charcoal/10 bg-white/80 text-charcoal xl:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-charcoal/10 bg-porcelain xl:hidden">
          <nav className="container-pad grid gap-2 py-5" aria-label="Mobile navigation">
            {settings.headerLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-semibold text-charcoal/75",
                  isActive(link.href) && "bg-white text-gold-deep shadow-sm",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href="/booking" onClick={() => setOpen(false)} className="gold-button px-4 py-3 text-center text-sm font-semibold">
                Book Now
              </Link>
              <Link href="/admin" onClick={() => setOpen(false)} className="outline-button px-4 py-3 text-center text-sm font-semibold">
                Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
