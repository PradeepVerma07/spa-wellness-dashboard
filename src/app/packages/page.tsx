import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { readCMS } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Packages",
  description: "Monthly packages, bridal packages, couple spa packages, and membership plans.",
};

export default async function PackagesPage() {
  const data = await readCMS();

  return (
    <>
      <PageHero
        eyebrow="Packages"
        title="Plans for bridal glow, monthly calm, and shared rest."
        text="Bundle your favorite treatments into a smoother calendar with membership care, couple spa time, and guided consultations."
        image="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1800&q=85"
        primaryHref="/booking"
        primaryLabel="Book Consultation"
      />
      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="Memberships" title="Choose the rhythm of care." />
          <div className="stagger-group grid gap-5 lg:grid-cols-3">
            {data.packages.map((plan) => (
              <article key={plan.id} className="stagger-card soft-card overflow-hidden">
                <div className="image-zoom aspect-[4/3]">
                  <Image src={plan.image} alt={plan.title} width={900} height={680} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase text-gold-deep">{plan.category}</p>
                  <h2 className="mt-2 font-serif text-4xl text-charcoal">{plan.title}</h2>
                  <p className="mt-2 text-sm text-charcoal/54">{plan.cadence}</p>
                  <p className="mt-4 text-sm leading-7 text-charcoal/64">{plan.excerpt}</p>
                  <p className="mt-5 font-serif text-5xl text-charcoal">{formatCurrency(plan.price)}</p>
                  <ul className="mt-5 grid gap-3">
                    {plan.inclusions.map((item) => (
                      <li key={item} className="flex gap-2 text-sm font-semibold text-charcoal/68">
                        <Check size={17} className="shrink-0 text-sage" /> {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/checkout" className="gold-button px-5 py-3 text-sm font-semibold">
                      Buy Package
                    </Link>
                    <Link href="/booking" className="outline-button px-5 py-3 text-sm font-semibold">
                      Book Consultation
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
