import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about bookings, services, products, packages, and spa visits.",
};

const faqs = [
  ["How do I book?", "Use the booking page, choose a service, add your date and time, and the team will confirm availability."],
  ["Can I buy products online?", "Yes. Add products to cart, complete checkout, and the team will coordinate fulfillment."],
  ["Do you offer bridal packages?", "Yes. Bridal packages can combine facials, hair spa, body polish, and consultation planning."],
  ["Can teams book wellness programs?", "Yes. Share your group size and goals through the contact page."],
];

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Helpful answers before you visit."
        text="Quick guidance for bookings, products, packages, and wellness programs."
        image="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1800&q=85"
      />
      <section className="section-pad">
        <div className="container-pad max-w-3xl">
          <div className="grid gap-4">
            {faqs.map(([question, answer]) => (
              <article key={question} className="soft-card p-6">
                <h2 className="font-serif text-3xl text-charcoal">{question}</h2>
                <p className="mt-3 text-sm leading-7 text-charcoal/64">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
