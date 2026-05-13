import type { Metadata } from "next";
import { CartClient } from "@/components/commerce/CartClient";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review spa ecommerce cart items, update quantities, apply coupon, and continue to checkout.",
};

export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Cart"
        title="Review your self-care edit."
        text="Update quantities, apply your offer code, and continue to checkout when everything feels right."
        image="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1800&q=85"
      />
      <section className="section-pad">
        <div className="container-pad">
          <CartClient />
        </div>
      </section>
    </>
  );
}
