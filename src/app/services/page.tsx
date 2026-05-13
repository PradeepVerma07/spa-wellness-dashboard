import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore massage, facial, hair spa, body therapy, skin care, Ayurveda, and wellness services.",
};

export default async function ServicesPage() {
  const data = await readCMS();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: data.services.map((service, index) => ({
            "@type": "Service",
            position: index + 1,
            name: service.title,
            description: service.excerpt,
            offers: { "@type": "Offer", price: service.price, priceCurrency: "INR" },
          })),
        }}
      />
      <PageHero
        eyebrow="Services"
        title="Spa, salon, therapy, skincare, and wellness care."
        text="Massage, facial, hair spa, body therapy, skin care, Ayurveda, and wellness rituals for rest, radiance, and everyday recovery."
        image="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1800&q=85"
        primaryHref="/booking"
        primaryLabel="Book Now"
        secondaryHref="/packages"
        secondaryLabel="View Packages"
      />
      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="All Services" title="Choose the care your body is asking for." />
          <ServiceGrid services={data.services} />
        </div>
      </section>
    </>
  );
}
