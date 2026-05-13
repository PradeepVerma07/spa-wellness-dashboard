import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Aura Wellness Spa inquiries, bookings, ecommerce orders, and contact leads.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy"
      title="Privacy Policy"
      items={[
        "We collect booking, inquiry, and order details only to provide services, respond to guests, and fulfill purchases.",
        "Contact leads, booking notes, and order information are available to authorized team members through the admin dashboard.",
        "Payment information should be handled by your production payment gateway. Do not store full card data in this application.",
      ]}
    />
  );
}
