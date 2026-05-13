import type { Metadata } from "next";
import { CheckoutClient } from "@/components/commerce/CheckoutClient";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete billing details, payment option, order summary, and ecommerce order placement.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Complete your order."
        text="Add billing details, choose your payment option, and place the order for delivery or pickup coordination."
        image="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1800&q=85"
      />
      <section className="section-pad">
        <div className="container-pad">
          <CheckoutClient />
        </div>
      </section>
    </>
  );
}
