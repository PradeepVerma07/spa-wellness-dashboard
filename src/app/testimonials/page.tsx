import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Play, Star } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Client reviews, video testimonials, and rating cards for spa and wellness services.",
};

export default async function TestimonialsPage() {
  const data = await readCMS();

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Guests return for how they feel after."
        text="Read client reviews from massage, facial, salon, wellness, bridal, and project experiences."
        image="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1800&q=85"
        primaryHref="/booking"
        primaryLabel="Book Appointment"
      />
      <section className="section-pad">
        <div className="container-pad">
          <SectionHeading eyebrow="Reviews" title="Rating cards and guest stories." />
          <div className="stagger-group grid gap-5 md:grid-cols-2">
            {data.testimonials.map((testimonial) => (
              <article key={testimonial.id} className="stagger-card soft-card p-6">
                <div className="flex items-center gap-4">
                  <Image src={testimonial.image} alt={testimonial.name} width={72} height={72} className="size-[72px] rounded-full object-cover" />
                  <div>
                    <h2 className="font-serif text-3xl text-charcoal">{testimonial.name}</h2>
                    <p className="text-xs font-bold uppercase text-gold-deep">{testimonial.service}</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-1 text-champagne">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star key={index} size={17} className="fill-champagne" />
                  ))}
                </div>
                <p className="mt-4 text-base leading-8 text-charcoal/68">&quot;{testimonial.quote}&quot;</p>
                {testimonial.videoUrl && (
                  <a href={testimonial.videoUrl} target="_blank" rel="noreferrer" className="outline-button mt-6 inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">
                    <Play size={16} /> Watch Story
                  </a>
                )}
              </article>
            ))}
          </div>
          <div className="reveal mt-10 text-center">
            <Link href="/booking" className="gold-button magnetic inline-flex px-6 py-3 text-sm font-semibold">
              Book Your Visit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
