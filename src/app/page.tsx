import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, ShoppingBag } from "lucide-react";
import { CounterGrid } from "@/components/sections/CounterGrid";
import { OfferCards } from "@/components/sections/OfferCards";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await readCMS();
  const featuredServices = data.services.filter((service) => service.featured).slice(0, 6);
  const featuredProducts = data.products.filter((product) => product.featured).slice(0, 6);
  const featuredProjects = data.projects.filter((project) => project.featured);
  const featuredTestimonials = data.testimonials.filter((testimonial) => testimonial.featured);
  const sections = data.settings.homepageSections;

  return (
    <>
      <section className="relative isolate min-h-[86vh] overflow-hidden bg-charcoal text-white">
        <Image src={data.settings.heroImage} alt="Luxury spa treatment room" fill priority className="parallax -z-20 object-cover opacity-60" sizes="100vw" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/70 to-charcoal/15" />
        <div className="container-pad flex min-h-[86vh] items-center pt-10">
          <div className="max-w-4xl">
            <p className="gsap-hero eyebrow text-champagne">{data.settings.announcement}</p>
            <h1 className="gsap-hero mt-5 font-serif text-6xl leading-none md:text-8xl">{data.settings.heroTitle}</h1>
            <p className="gsap-hero mt-6 max-w-2xl text-lg leading-8 text-porcelain/82">{data.settings.heroSubtitle}</p>
            <div className="gsap-hero mt-9 flex flex-wrap gap-3">
              <Link href="/booking" className="gold-button magnetic inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold">
                <CalendarCheck size={17} />
                Book Appointment
              </Link>
              <Link href="/services" className="outline-button inline-flex items-center gap-2 border-white/24 bg-white/10 px-6 py-3 text-sm font-semibold text-white">
                Explore Services <ArrowRight size={17} />
              </Link>
              <Link href="/shop" className="outline-button inline-flex items-center gap-2 border-white/24 bg-white/10 px-6 py-3 text-sm font-semibold text-white">
                <ShoppingBag size={17} />
                Shop Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="luxury-shell py-10">
        <div className="container-pad">
          <CounterGrid
            items={[
              { label: "Therapy bookings", value: data.bookings.length + 420 },
              { label: "Premium products sold", value: data.orders.length + 1200 },
              { label: "Wellness projects", value: data.projects.length + 18 },
              { label: "Client rating", value: 5 },
            ]}
          />
        </div>
      </section>

      {sections.featuredServices && (
        <section className="section-pad">
          <div className="container-pad">
            <SectionHeading
              eyebrow="Featured Services"
              title="Rituals designed for recovery, radiance, and calm."
              text="Massage, facials, hair spa, Ayurveda, skin care, and body therapy are shaped around how you want to feel after you leave."
              href="/services"
              action="View all services"
            />
            <ServiceGrid services={featuredServices} />
          </div>
        </section>
      )}

      {sections.products && (
        <section className="section-pad bg-white/58">
          <div className="container-pad">
            <SectionHeading
              eyebrow="Best Selling Products"
              title="Curated self-care for the glow between visits."
              text="Shop spa-grade oils, masks, body care, aromatherapy, and daily skin essentials chosen by our therapists."
              href="/shop"
              action="Shop all products"
            />
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      {sections.packages && (
        <section className="section-pad">
          <div className="container-pad">
            <SectionHeading
              eyebrow="Wellness Packages"
              title="Memberships and event plans with a softer pace."
              text="Monthly wellness, bridal preparation, and couple spa plans make care easier to schedule and easier to keep."
              href="/packages"
              action="Explore packages"
            />
            <div className="stagger-group grid gap-5 md:grid-cols-3">
              {data.packages.map((plan) => (
                <article key={plan.id} className="stagger-card soft-card overflow-hidden">
                  <div className="image-zoom aspect-[4/3]">
                    <Image src={plan.image} alt={plan.title} width={800} height={600} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase text-gold-deep">{plan.category}</p>
                    <h3 className="mt-2 font-serif text-3xl text-charcoal">{plan.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-charcoal/64">{plan.excerpt}</p>
                    <Link href="/packages" className="gold-button mt-6 inline-flex px-5 py-3 text-sm font-semibold">
                      Buy Package
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.projects && (
        <section className="section-pad bg-white/58">
          <div className="container-pad">
            <SectionHeading
              eyebrow="Projects and Portfolio"
              title="Spa interiors, bridal journeys, and wellness programs."
              text="Browse the stories behind guest transformations, interior launches, and workplace wellness programs."
              href="/projects"
              action="View portfolio"
            />
            <ProjectGrid projects={featuredProjects} />
          </div>
        </section>
      )}

      {sections.testimonials && (
        <section className="section-pad">
          <div className="container-pad">
            <SectionHeading eyebrow="Testimonials" title="Loved by guests who make wellness part of life." href="/testimonials" action="Read reviews" />
            <div className="stagger-group grid gap-5 md:grid-cols-3">
              {featuredTestimonials.map((testimonial) => (
                <article key={testimonial.id} className="stagger-card glass-card p-6">
                  <div className="flex items-center gap-4">
                    <Image src={testimonial.image} alt={testimonial.name} width={64} height={64} className="size-16 rounded-full object-cover" />
                    <div>
                      <h3 className="font-serif text-2xl text-charcoal">{testimonial.name}</h3>
                      <p className="text-xs font-bold uppercase text-gold-deep">{testimonial.service}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-charcoal/68">&quot;{testimonial.quote}&quot;</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.blog && (
        <section className="section-pad bg-white/58">
          <div className="container-pad">
            <SectionHeading eyebrow="Wellness Journal" title="Education that connects services, products, and care plans." href="/blog" action="Read the blog" />
            <div className="stagger-group grid gap-5 md:grid-cols-3">
              {data.blogs.slice(0, 3).map((blog) => (
                <article key={blog.id} className="stagger-card soft-card overflow-hidden">
                  <Link href={`/blog/${blog.slug}`} className="image-zoom block aspect-[4/3]">
                    <Image src={blog.image} alt={blog.title} width={800} height={600} className="h-full w-full object-cover" />
                  </Link>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase text-gold-deep">{blog.category}</p>
                    <h3 className="mt-2 font-serif text-3xl text-charcoal">
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-charcoal/64">{blog.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.offers && (
        <section className="section-pad">
          <div className="container-pad">
            <SectionHeading eyebrow="Active Offers" title="A little extra glow, for a limited time." href="/offers" action="View offers" />
            <OfferCards offers={data.offers} />
          </div>
        </section>
      )}

      {sections.contactCta && (
        <section className="relative isolate overflow-hidden bg-charcoal py-20 text-white">
          <Image src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1800&q=85" alt="" fill className="parallax -z-20 object-cover opacity-38" sizes="100vw" />
          <div className="absolute inset-0 -z-10 bg-charcoal/60" />
          <div className="container-pad reveal max-w-3xl text-center">
            <p className="eyebrow text-champagne">Begin</p>
            <h2 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">Start your wellness journey with a calm first step.</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/booking" className="gold-button magnetic px-6 py-3 text-sm font-semibold">
                Book Appointment
              </Link>
              <Link href="/contact" className="outline-button border-white/24 bg-white/10 px-6 py-3 text-sm font-semibold text-white">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
