import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop spa-grade skincare, hair care, body care, aromatherapy, and wellness products.",
};

export default async function ShopPage() {
  const data = await readCMS();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: data.products.map((product, index) => ({
            "@type": "Product",
            position: index + 1,
            name: product.title,
            image: product.image,
            description: product.excerpt,
            offers: { "@type": "Offer", price: product.price, priceCurrency: "INR", availability: product.inventory > 0 ? "InStock" : "OutOfStock" },
          })),
        }}
      />
      <PageHero
        eyebrow="Shop"
        title="Spa-grade products for daily rituals."
        text="Browse skin care, hair care, body care, aromatherapy, and wellness essentials curated by the Aura team."
        image="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1800&q=85"
        primaryHref="/cart"
        primaryLabel="View Cart"
      />
      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="Products" title="Find your next self-care staple." />
          <ProductGrid products={data.products} />
        </div>
      </section>
    </>
  );
}
