import type { Metadata } from "next";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Image and video gallery for spa, beauty, salon, wellness, services, and projects.",
};

export default async function GalleryPage() {
  const data = await readCMS();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A visual tour of rituals, rooms, and results."
        text="Explore treatment spaces, services, bridal care, products, and wellness moments."
        image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85"
        primaryHref="/services"
        primaryLabel="Explore Services"
      />
      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="Media" title="Spa, salon, wellness, and project moments." />
          <GalleryGrid items={data.gallery} />
        </div>
      </section>
    </>
  );
}
