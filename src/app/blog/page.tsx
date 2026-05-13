import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { readCMS } from "@/lib/store";
import { readingTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Wellness articles, beauty tips, and skincare guides with service and product recommendations.",
};

export default async function BlogPage() {
  const data = await readCMS();

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Wellness articles, beauty tips, and skincare guides."
        text="Read practical guidance from the Aura team, with care paths that connect services and products."
        image="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1800&q=85"
        primaryHref="/services"
        primaryLabel="Explore Services"
      />
      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="Blog" title="Read before your next ritual." />
          <div className="stagger-group grid gap-5 md:grid-cols-2">
            {data.blogs.map((blog) => (
              <article key={blog.id} className="stagger-card soft-card overflow-hidden">
                <Link href={`/blog/${blog.slug}`} className="image-zoom block aspect-[16/10]">
                  <Image src={blog.image} alt={blog.title} width={1000} height={625} className="h-full w-full object-cover" />
                </Link>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase text-gold-deep">
                    <span>{blog.category}</span>
                    <span>{readingTime(blog.content)} min read</span>
                  </div>
                  <h2 className="mt-3 font-serif text-4xl leading-tight text-charcoal">
                    <Link href={`/blog/${blog.slug}`} className="transition hover:text-gold-deep">
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-charcoal/64">{blog.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
