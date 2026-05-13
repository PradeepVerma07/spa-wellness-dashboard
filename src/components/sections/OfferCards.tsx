"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import type { Offer } from "@/lib/types";

function useCountdown(endsAt: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date(endsAt).getTime() - Date.now());
      setTime({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff / 3_600_000) % 24),
        minutes: Math.floor((diff / 60_000) % 60),
      });
    };
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  return time;
}

function OfferCard({ offer }: { offer: Offer }) {
  const time = useCountdown(offer.endsAt);

  return (
    <article className="stagger-card soft-card group overflow-hidden">
      <div className="image-zoom relative aspect-[4/3]">
        <Image src={offer.image} alt={offer.title} fill className="object-cover" sizes="(min-width:1024px) 33vw, 100vw" />
        <div className="absolute left-4 top-4 rounded-full bg-charcoal px-4 py-2 text-sm font-bold text-white">{offer.discount}</div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-gold-deep">
          <Clock3 size={15} /> {time.days}d {time.hours}h {time.minutes}m
        </div>
        <h3 className="mt-3 font-serif text-3xl text-charcoal">{offer.title}</h3>
        <p className="mt-3 text-sm leading-7 text-charcoal/64">{offer.excerpt}</p>
        <Link href={offer.targetHref} className="gold-button mt-6 inline-flex px-5 py-3 text-sm font-semibold">
          {offer.targetLabel}
        </Link>
      </div>
    </article>
  );
}

export function OfferCards({ offers }: { offers: Offer[] }) {
  return (
    <div className="stagger-group grid gap-5 md:grid-cols-3">
      {offers.filter((offer) => offer.active).map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}
