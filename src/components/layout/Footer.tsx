import Link from "next/link";
import { ExternalLink, MessageCircle, Phone } from "lucide-react";
import type { NavLink, SiteSettings } from "@/lib/types";

function LinkColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase text-champagne">{title}</h3>
      <ul className="grid gap-3 text-sm text-porcelain/72">
        {links.map((link) => (
          <li key={link.id}>
            <Link href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-charcoal text-porcelain">
      <div className="container-pad grid gap-10 py-14 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="font-serif text-4xl">
            {settings.siteName}
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-porcelain/70">{settings.tagline}</p>
          <div className="mt-6 grid gap-3 text-sm text-porcelain/78">
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 transition hover:text-white">
              <Phone size={16} /> Call Now: {settings.phone}
            </a>
            <a href={settings.whatsapp} className="flex items-center gap-2 transition hover:text-white">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/booking" className="gold-button magnetic px-5 py-3 text-sm font-semibold">
              Book Appointment
            </Link>
            <Link href="/contact" className="outline-button border-white/20 bg-white/8 px-5 py-3 text-sm font-semibold text-porcelain">
              Contact
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <LinkColumn title="Quick Links" links={settings.footerQuickLinks} />
          <LinkColumn title="Services" links={settings.footerServiceLinks} />
          <LinkColumn title="Support" links={settings.footerSupportLinks} />
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase text-champagne">Social</h3>
            <ul className="grid gap-3 text-sm text-porcelain/72">
              {settings.socialLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-white">
                    <ExternalLink size={17} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-pad flex flex-col gap-2 text-xs text-porcelain/55 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
          <p>{settings.address}</p>
        </div>
      </div>
    </footer>
  );
}
