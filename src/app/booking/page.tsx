import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { BookingForm } from "@/components/forms/BookingForm";
import { readCMS } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book Appointment",
  description: "Book spa, salon, therapy, beauty, skincare, and wellness appointments online.",
};

export default async function BookingPage() {
  const data = await readCMS();

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Reserve your next ritual."
        text="Choose your service, preferred date, time, payment option, and contact details. The team will confirm your appointment."
        image="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1800&q=85"
      />
      <section className="section-pad">
        <div className="container-pad">
          <Suspense fallback={<div className="soft-card p-6">Loading booking form...</div>}>
            <BookingForm services={data.services} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
