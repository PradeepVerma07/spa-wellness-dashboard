import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  breadcrumbs,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  breadcrumbs?: Crumb[];
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="relative isolate min-h-[58vh] overflow-hidden bg-charcoal text-porcelain">
      <Image src={image} alt="" fill priority className="parallax -z-20 object-cover opacity-52" sizes="100vw" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/70 to-charcoal/20" />
      <div className="container-pad flex min-h-[58vh] items-end pb-14 pt-28">
        <div className="max-w-3xl">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          <p className="gsap-hero eyebrow text-champagne">{eyebrow}</p>
          <h1 className="gsap-hero mt-4 font-serif text-5xl leading-none text-white md:text-7xl">{title}</h1>
          <p className="gsap-hero mt-6 max-w-2xl text-lg leading-8 text-porcelain/78">{text}</p>
          {(primaryHref || secondaryHref) && (
            <div className="gsap-hero mt-8 flex flex-wrap gap-3">
              {primaryHref && primaryLabel && (
                <Link href={primaryHref} className="gold-button magnetic px-6 py-3 text-sm font-semibold">
                  {primaryLabel}
                </Link>
              )}
              {secondaryHref && secondaryLabel && (
                <Link href={secondaryHref} className="outline-button border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white">
                  {secondaryLabel}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
