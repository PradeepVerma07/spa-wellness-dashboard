import type { MetadataRoute } from "next";
import { readCMS } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await readCMS();
  const base = "https://aurawellness.example";
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/booking",
    "/shop",
    "/cart",
    "/checkout",
    "/projects",
    "/packages",
    "/offers",
    "/gallery",
    "/team",
    "/blog",
    "/testimonials",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/faq",
  ];
  const dynamicRoutes = [
    ...data.services.map((item) => `/services/${item.slug}`),
    ...data.products.map((item) => `/shop/${item.slug}`),
    ...data.projects.map((item) => `/projects/${item.slug}`),
    ...data.blogs.map((item) => `/blog/${item.slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route ? "weekly" : "daily",
    priority: route ? 0.7 : 1,
  }));
}
