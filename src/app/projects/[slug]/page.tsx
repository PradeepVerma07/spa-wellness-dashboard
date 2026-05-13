import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { findBySlug, readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await findBySlug("projects", slug);
  return {
    title: project?.seo.title ?? "Project",
    description: project?.seo.description ?? "Spa and wellness project detail.",
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await readCMS();
  const project = data.projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const services = data.services.filter((service) => project.servicesUsed.includes(service.slug));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.excerpt,
          image: project.image,
        }}
      />
      <section className="section-pad pt-12">
        <div className="container-pad">
          <Breadcrumbs items={[{ label: "Projects", href: "/projects" }, { label: project.title }]} />
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="reveal">
              <p className="eyebrow">{project.category}</p>
              <h1 className="mt-4 font-serif text-6xl leading-none text-charcoal md:text-8xl">{project.title}</h1>
              <p className="mt-6 text-lg leading-8 text-charcoal/68">{project.excerpt}</p>
              <Link href="/contact" className="gold-button magnetic mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold">
                Start Your Wellness Journey <ArrowRight size={17} />
              </Link>
            </div>
            <div className="reveal image-zoom aspect-[16/11]">
              <Image src={project.image} alt={project.title} width={1100} height={760} priority className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white/58">
        <div className="container-pad grid gap-8 lg:grid-cols-3">
          <div className="glass-card p-6">
            <p className="eyebrow">Client</p>
            <h2 className="mt-3 font-serif text-4xl text-charcoal">{project.client}</h2>
          </div>
          <div className="glass-card p-6 lg:col-span-2">
            <p className="eyebrow">Client Story</p>
            <p className="mt-3 text-base leading-8 text-charcoal/68">{project.story}</p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="Services Used" title="The care plan behind the result." />
          <div className="stagger-group grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.slug}`} className="stagger-card glass-card p-6 transition hover:-translate-y-1 hover:border-champagne/60">
                <p className="text-xs font-bold uppercase text-gold-deep">{service.category}</p>
                <h3 className="mt-2 font-serif text-3xl text-charcoal">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-charcoal/64">{service.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white/58">
        <div className="container-pad grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="reveal">
            <p className="eyebrow">Result</p>
            <h2 className="mt-4 font-serif text-5xl leading-tight text-charcoal">{project.result}</h2>
            <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-sage">
              <CheckCircle2 /> Project complete
            </div>
          </div>
          <div className="stagger-group grid gap-4 sm:grid-cols-2">
            {project.gallery.map((image) => (
              <div key={image} className="stagger-card image-zoom aspect-[4/3]">
                <Image src={image} alt={project.title} width={700} height={520} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
