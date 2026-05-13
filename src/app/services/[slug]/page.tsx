import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarCheck, Check, Clock } from "lucide-react";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { findBySlug, readCMS } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await findBySlug("services", slug);
  return {
    title: service?.seo.title ?? "Service",
    description: service?.seo.description ?? "Luxury spa service detail.",
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await readCMS();
  const service = data.services.find((item) => item.slug === slug);
  if (!service) notFound();
  const related = data.services.filter((item) => item.category === service.category && item.slug !== service.slug).slice(0, 3);
  const relatedProducts = data.products.filter((product) => product.category === "Skin Care" || product.category === "Wellness").slice(0, 1);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.description,
          image: service.image,
          offers: { "@type": "Offer", price: service.price, priceCurrency: "INR" },
        }}
      />
      <section className="section-pad pt-12">
        <div className="container-pad">
          <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: service.title }]} />
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="reveal">
              <p className="eyebrow">{service.category}</p>
              <h1 className="mt-4 font-serif text-6xl leading-none text-charcoal md:text-8xl">{service.title}</h1>
              <p className="mt-6 text-lg leading-8 text-charcoal/68">{service.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/booking?service=${service.slug}`} className="gold-button magnetic inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold">
                  <CalendarCheck size={17} />
                  Book Now
                </Link>
                <Link href="/contact" className="outline-button px-6 py-3 text-sm font-semibold">
                  Ask a Question
                </Link>
              </div>
            </div>
            <div className="reveal image-zoom aspect-[4/5]">
              <Image src={service.image} alt={service.title} width={900} height={1100} priority className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="glass-card p-6">
              <p className="text-sm text-charcoal/56">Price</p>
              <p className="mt-2 font-serif text-4xl text-charcoal">{formatCurrency(service.price)}</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-charcoal/56">Duration</p>
              <p className="mt-2 flex items-center gap-2 font-serif text-4xl text-charcoal">
                <Clock size={26} /> {service.duration}
              </p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-charcoal/56">Category</p>
              <p className="mt-2 font-serif text-4xl text-charcoal">{service.category}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white/58">
        <div className="container-pad grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="reveal">
            <p className="eyebrow">Benefits</p>
            <h2 className="mt-4 font-serif text-5xl leading-tight text-charcoal">What this ritual supports.</h2>
          </div>
          <div className="stagger-group grid gap-4 sm:grid-cols-2">
            {service.benefits.map((benefit) => (
              <div key={benefit} className="stagger-card glass-card flex gap-3 p-5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sage/14 text-sage">
                  <Check size={17} />
                </span>
                <p className="text-sm font-semibold leading-7 text-charcoal/72">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="Before and After" title="A visual sense of the treatment journey." />
          <div className="stagger-group grid gap-5 md:grid-cols-2">
            {[service.image, ...service.gallery].slice(0, 2).map((image, index) => (
              <div key={image} className="stagger-card image-zoom aspect-[4/3]">
                <Image src={image} alt={`${service.title} gallery ${index + 1}`} width={900} height={675} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {relatedProducts[0] && (
        <section className="section-pad bg-white/58">
          <div className="container-pad">
            <SectionHeading eyebrow="Recommended Care" title="Complete the ritual at home." />
            <div className="soft-card grid gap-6 p-6 md:grid-cols-[220px_1fr_auto] md:items-center">
              <Image src={relatedProducts[0].image} alt={relatedProducts[0].title} width={440} height={440} className="aspect-square rounded-lg object-cover" />
              <div>
                <h3 className="font-serif text-4xl text-charcoal">{relatedProducts[0].title}</h3>
                <p className="mt-3 text-sm leading-7 text-charcoal/64">{relatedProducts[0].excerpt}</p>
              </div>
              <AddToCartButton product={relatedProducts[0]} />
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section-pad">
          <div className="container-pad">
            <SectionHeading eyebrow="Related Services" title="Stay in the same mood." />
            <ServiceGrid services={related} />
          </div>
        </section>
      )}
    </>
  );
}
