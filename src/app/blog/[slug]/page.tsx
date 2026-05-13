import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { findBySlug, readCMS } from "@/lib/store";
import { readingTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await findBySlug("blogs", slug);
  return {
    title: blog?.seo.title ?? "Blog",
    description: blog?.seo.description ?? "Spa and wellness article.",
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await readCMS();
  const blog = data.blogs.find((item) => item.slug === slug);
  if (!blog) notFound();
  const relatedServices = data.services.filter((service) => blog.relatedServices.includes(service.slug));
  const relatedProducts = data.products.filter((product) => blog.relatedProducts.includes(product.slug));
  const relatedBlogs = data.blogs.filter((item) => item.slug !== blog.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: blog.title,
          description: blog.excerpt,
          image: blog.image,
          author: { "@type": "Person", name: blog.author },
          datePublished: blog.publishedAt,
        }}
      />
      <article className="section-pad pt-12">
        <div className="container-pad max-w-4xl">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: blog.title }]} />
          <p className="eyebrow">{blog.category}</p>
          <h1 className="mt-4 font-serif text-6xl leading-none text-charcoal md:text-8xl">{blog.title}</h1>
          <p className="mt-5 text-sm font-semibold text-charcoal/56">
            By {blog.author} · {new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {readingTime(blog.content)} min read
          </p>
          <div className="image-zoom mt-9 aspect-[16/9]">
            <Image src={blog.image} alt={blog.title} width={1200} height={675} priority className="h-full w-full object-cover" />
          </div>
          <div className="prose mt-10 max-w-none text-lg leading-9 text-charcoal/74">
            {blog.content.split(". ").map((paragraph) => (
              <p key={paragraph} className="mb-6">
                {paragraph.endsWith(".") ? paragraph : `${paragraph}.`}
              </p>
            ))}
          </div>
        </div>
      </article>

      {relatedServices.length > 0 && (
        <section className="section-pad bg-white/58">
          <div className="container-pad">
            <SectionHeading eyebrow="Related Services" title="Book the care path from this guide." />
            <ServiceGrid services={relatedServices} />
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="section-pad">
          <div className="container-pad">
            <SectionHeading eyebrow="Related Products" title="Bring part of the ritual home." />
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}

      <section className="section-pad bg-white/58">
        <div className="container-pad">
          <SectionHeading eyebrow="Related Blogs" title="Keep reading." />
          <div className="stagger-group grid gap-5 md:grid-cols-3">
            {relatedBlogs.map((item) => (
              <Link key={item.id} href={`/blog/${item.slug}`} className="stagger-card glass-card p-6 transition hover:-translate-y-1 hover:border-champagne/60">
                <p className="text-xs font-bold uppercase text-gold-deep">{item.category}</p>
                <h3 className="mt-3 font-serif text-3xl leading-tight text-charcoal">{item.title}</h3>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold-deep">
                  Read article <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
