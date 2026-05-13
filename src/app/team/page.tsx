import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet therapists, stylists, wellness experts, and beauty specialists.",
};

export default async function TeamPage() {
  const data = await readCMS();

  return (
    <>
      <PageHero
        eyebrow="Team"
        title="Therapists, stylists, and wellness experts."
        text="Meet the people shaping each treatment, consultation, service plan, and guest experience."
        image="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=85"
        primaryHref="/booking"
        primaryLabel="Book With Expert"
      />
      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="Experts" title="Experience with a human touch." />
          <div className="stagger-group grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {data.team.map((member) => (
              <article key={member.id} className="stagger-card soft-card overflow-hidden">
                <div className="image-zoom aspect-[4/5]">
                  <Image src={member.image} alt={member.name} width={700} height={900} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase text-gold-deep">{member.role}</p>
                  <h2 className="mt-2 font-serif text-3xl text-charcoal">{member.name}</h2>
                  <p className="mt-2 text-sm font-semibold text-charcoal/58">{member.experience}</p>
                  <p className="mt-3 text-sm leading-7 text-charcoal/64">{member.specialization}</p>
                  <Link href={member.bookingHref} className="gold-button mt-6 inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">
                    <CalendarCheck size={17} /> Book with Expert
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
