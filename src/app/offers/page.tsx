import type { Metadata } from "next";
import { OfferCards } from "@/components/sections/OfferCards";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Offers",
  description: "Active spa, beauty, wellness, booking, and ecommerce offers.",
};

export default async function OffersPage() {
  const data = await readCMS();

  return (
    <>
      <PageHero
        eyebrow="Offers"
        title="Seasonal glow, softer pricing."
        text="Reserve active spa and shop offers before the window closes."
        image="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1800&q=85"
        primaryHref="/booking"
        primaryLabel="Book Appointment"
        secondaryHref="/shop"
        secondaryLabel="Shop Products"
      />
      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="Active Offers" title="Limited-time savings for booking and shopping." />
          <OfferCards offers={data.offers} />
        </div>
      </section>
    </>
  );
}
