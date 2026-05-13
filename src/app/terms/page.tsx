import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for appointments, ecommerce orders, packages, offers, and wellness services.",
};

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Terms"
      title="Terms of Service"
      items={[
        "Appointments are subject to therapist availability and confirmation by the Aura Wellness Spa team.",
        "Packages, offers, and memberships may carry specific validity windows shown at the time of purchase or booking.",
        "Guests should share allergies, sensitivities, pregnancy, injuries, or medical concerns before treatment begins.",
      ]}
    />
  );
}
