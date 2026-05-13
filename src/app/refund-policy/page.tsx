import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund policy for spa bookings, ecommerce orders, products, and packages.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Refunds"
      title="Refund Policy"
      items={[
        "Booking deposits may be moved to a future appointment when rescheduled at least 24 hours before the visit.",
        "Unopened products can be reviewed for return or exchange within seven days, subject to hygiene and condition checks.",
        "Digital payment refunds depend on gateway settlement timelines and bank processing windows.",
      ]}
    />
  );
}
