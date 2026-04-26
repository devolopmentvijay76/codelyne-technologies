import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { products } from "@shared/schema";

const SITE_URL = (
  process.env.SITE_URL || "https://www.codelynetechnologies.com"
).replace(/\/$/, "");

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about-us`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/founders`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const rows = await db.select().from(products);
    productEntries = rows.map((p: any) => ({
      url: `${SITE_URL}/products/${p.id}`,
      lastModified: (p.updatedAt || p.createdAt || now) as Date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error("sitemap: failed to load products", err);
  }

  return [...staticEntries, ...productEntries];
}
