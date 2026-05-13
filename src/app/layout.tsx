import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { readCMS } from "@/lib/store";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aurawellness.example"),
  title: {
    default: "Aura Wellness Spa | Luxury Spa, Salon, Beauty and Wellness",
    template: "%s | Aura Wellness Spa",
  },
  description:
    "Premium spa, wellness, beauty, salon, therapy, ecommerce, booking, and project portfolio website.",
  keywords: ["spa", "wellness", "salon", "beauty", "massage", "facial", "ecommerce", "booking"],
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings } = await readCMS();
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: settings.siteName,
    description: settings.tagline,
    telephone: settings.phone,
    email: settings.email,
    address: settings.address,
    image: settings.heroImage,
    url: "https://aurawellness.example",
    sameAs: settings.socialLinks.map((link) => link.href),
  };

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} antialiased`}>
      <body>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <AppShell settings={settings}>{children}</AppShell>
      </body>
    </html>
  );
}
