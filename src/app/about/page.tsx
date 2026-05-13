import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Heart, Leaf, Sparkles } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet Aura Wellness Spa, a premium spa, salon, beauty, and wellness brand.",
};

export default async function AboutPage() {
  const data = await readCMS();
  const founder = data.team[0];

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A quieter kind of luxury."
        text="Aura Wellness Spa blends therapy, salon care, skincare, products, and wellness projects into one warm, high-touch experience."
        image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"
        primaryHref="/services"
        primaryLabel="Explore Services"
        secondaryHref="/contact"
        secondaryLabel="Visit Us"
      />
      <section className="section-pad">
        <div className="container-pad grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="reveal image-zoom aspect-[4/5]">
            <Image src={founder.image} alt={founder.name} width={900} height={1100} className="h-full w-full object-cover" />
          </div>
          <div className="reveal">
            <p className="eyebrow">Brand Story</p>
            <h2 className="mt-4 font-serif text-5xl leading-tight text-charcoal md:text-6xl">Built for guests who want care to feel personal.</h2>
            <p className="mt-5 text-base leading-8 text-charcoal/68">
              We created Aura for the space between clinical precision and sensory rest. Every guest journey can connect massage, facials, hair spa, product guidance, bridal care, and wellness programming without feeling rushed.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="glass-card p-5">
                <Leaf className="text-sage" />
                <h3 className="mt-3 font-serif text-3xl">Mission</h3>
                <p className="mt-2 text-sm leading-7 text-charcoal/64">Make premium wellness feel calm, practical, and beautifully repeatable.</p>
              </div>
              <div className="glass-card p-5">
                <Sparkles className="text-gold-deep" />
                <h3 className="mt-3 font-serif text-3xl">Vision</h3>
                <p className="mt-2 text-sm leading-7 text-charcoal/64">Be the most trusted destination for ritual-led beauty, therapy, and recovery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white/58">
        <div className="container-pad">
          <SectionHeading eyebrow="Founder" title={founder.name} text={`${founder.role} with ${founder.experience} of experience in ${founder.specialization.toLowerCase()}.`} />
          <div className="soft-card grid gap-8 p-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <Image src={founder.image} alt={founder.name} width={800} height={640} className="aspect-[4/3] rounded-lg object-cover" />
            <div>
              <h3 className="font-serif text-4xl text-charcoal">{founder.role}</h3>
              <p className="mt-4 text-base leading-8 text-charcoal/68">{founder.bio}</p>
              <Link href="/team" className="gold-button mt-6 inline-flex px-5 py-3 text-sm font-semibold">
                Meet the Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="Why Choose Us" title="Polished service, thoughtful rituals, clear next steps." />
          <div className="stagger-group grid gap-5 md:grid-cols-3">
            {[
              ["Expert-led journeys", "Consultations connect services, products, and home care so results are easier to sustain."],
              ["Premium sensory detail", "Texture, scent, music, pressure, lighting, and post-care are considered in every appointment."],
              ["Connected services", "Spa, salon, therapy, shop, projects, and packages work together instead of feeling separate."],
            ].map(([title, text]) => (
              <article key={title} className="stagger-card glass-card p-6">
                <Heart className="text-rose" />
                <h3 className="mt-4 font-serif text-3xl text-charcoal">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-charcoal/64">{text}</p>
              </article>
            ))}
          </div>
          <div className="reveal mt-10 flex flex-wrap gap-3">
            {[
              ["Services", "/services"],
              ["Projects", "/projects"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="outline-button inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">
                {label} <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
