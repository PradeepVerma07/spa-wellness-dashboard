import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Aura Wellness Spa, send an inquiry, call, WhatsApp, or find branch details.",
};

export default async function ContactPage() {
  const { settings } = await readCMS();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We will help you choose the right next step."
        text="Ask about services, bookings, bridal packages, projects, wellness programs, products, or gift plans."
        image="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1800&q=85"
        primaryHref="/booking"
        primaryLabel="Book Appointment"
      />
      <section className="section-pad">
        <div className="container-pad grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="reveal">
            <SectionHeading eyebrow="Branch Details" title={settings.siteName} text={settings.tagline} />
            <div className="grid gap-4">
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="glass-card flex items-center gap-3 p-5">
                <Phone className="text-gold-deep" />
                <span>{settings.phone}</span>
              </a>
              <a href={`mailto:${settings.email}`} className="glass-card flex items-center gap-3 p-5">
                <Mail className="text-gold-deep" />
                <span>{settings.email}</span>
              </a>
              <div className="glass-card flex items-center gap-3 p-5">
                <MapPin className="text-gold-deep" />
                <span>{settings.address}</span>
              </div>
              <Link href={settings.whatsapp} className="gold-button magnetic inline-flex w-fit items-center gap-2 px-6 py-3 text-sm font-semibold">
                <MessageCircle size={17} />
                WhatsApp
              </Link>
            </div>
          </div>
          <div className="reveal">
            <ContactForm />
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="container-pad overflow-hidden rounded-lg border border-charcoal/10 shadow-lg">
          <iframe title="Aura Wellness Spa map" src={settings.mapEmbed} className="h-[420px] w-full border-0" loading="lazy" />
        </div>
      </section>
    </>
  );
}
