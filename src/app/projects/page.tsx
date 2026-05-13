import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore spa interior projects, bridal makeover projects, and wellness program portfolio work.",
};

export default async function ProjectsPage() {
  const data = await readCMS();

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Portfolio stories with visible care."
        text="Spa interior launches, bridal glow programs, and wellness projects shaped around real clients and measurable outcomes."
        image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85"
        primaryHref="/contact"
        primaryLabel="Start Your Journey"
      />
      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="Portfolio" title="Interiors, bridal care, and wellness programs." />
          <ProjectGrid projects={data.projects} />
        </div>
      </section>
    </>
  );
}
