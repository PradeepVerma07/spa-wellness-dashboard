import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, Star } from "lucide-react";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { BuyNowButton } from "@/components/commerce/BuyNowButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { findBySlug, readCMS } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await findBySlug("products", slug);
  return {
    title: product?.seo.title ?? "Product",
    description: product?.seo.description ?? "Spa product detail.",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await readCMS();
  const product = data.products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = data.products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          image: product.gallery,
          description: product.description,
          brand: "Aura Wellness Spa",
          offers: { "@type": "Offer", price: product.price, priceCurrency: "INR", availability: product.inventory > 0 ? "InStock" : "OutOfStock" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: product.reviews[0]?.rating ?? 5, reviewCount: product.reviews.length || 1 },
        }}
      />
      <section className="section-pad pt-12">
        <div className="container-pad">
          <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: product.title }]} />
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div className="reveal grid gap-4 md:grid-cols-[0.25fr_1fr]">
              <div className="hidden gap-3 md:grid">
                {product.gallery.slice(0, 3).map((image) => (
                  <Image key={image} src={image} alt={product.title} width={180} height={180} className="aspect-square rounded-lg object-cover" />
                ))}
              </div>
              <div className="image-zoom aspect-square">
                <Image src={product.image} alt={product.title} width={950} height={950} priority className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="reveal">
              <p className="eyebrow">{product.category}</p>
              <h1 className="mt-4 font-serif text-6xl leading-none text-charcoal md:text-7xl">{product.title}</h1>
              <p className="mt-5 text-lg leading-8 text-charcoal/68">{product.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <p className="font-serif text-5xl text-charcoal">{formatCurrency(product.price)}</p>
                {product.compareAtPrice && <p className="text-lg text-charcoal/42 line-through">{formatCurrency(product.compareAtPrice)}</p>}
                <p className="rounded-full bg-sage/12 px-4 py-2 text-sm font-bold text-sage">{product.inventory} in stock</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <AddToCartButton product={product} />
                <BuyNowButton product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white/58">
        <div className="container-pad grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Ingredients" title="Clean, sensory, skin-loving." />
            <div className="grid gap-3">
              {product.ingredients.map((ingredient) => (
                <div key={ingredient} className="glass-card flex items-center gap-3 p-4">
                  <Check size={17} className="text-sage" />
                  <span className="text-sm font-semibold text-charcoal/72">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Benefits" title="Why guests keep it close." />
            <div className="grid gap-3">
              {product.benefits.map((benefit) => (
                <div key={benefit} className="glass-card flex items-center gap-3 p-4">
                  <Check size={17} className="text-gold-deep" />
                  <span className="text-sm font-semibold text-charcoal/72">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="Reviews" title="Notes from the ritual shelf." />
          <div className="stagger-group grid gap-5 md:grid-cols-3">
            {product.reviews.map((review) => (
              <article key={review.name} className="stagger-card glass-card p-6">
                <div className="mb-4 flex gap-1 text-champagne">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} size={16} className="fill-champagne" />
                  ))}
                </div>
                <p className="text-sm leading-7 text-charcoal/68">&quot;{review.quote}&quot;</p>
                <p className="mt-4 font-semibold text-charcoal">{review.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-pad bg-white/58">
          <div className="container-pad">
            <SectionHeading eyebrow="Related Products" title="Keep building the ritual." />
            <ProductGrid products={related} />
            <div className="reveal mt-8">
              <Link href="/shop" className="outline-button inline-flex px-5 py-3 text-sm font-semibold">
                Back to Shop
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
