import { Helmet } from "react-helmet-async";

export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://www.codelynetechnologies.com";

const DEFAULTS = {
  title: "Codelyne Technologies | AI-First Enterprise Engineering",
  description:
    "Codelyne Technologies is an AI-driven software and product engineering company building enterprise-grade AI solutions, ERP, automation and intelligent platforms.",
  image: `${SITE_URL}/opengraph.jpg`,
  type: "website" as const,
  siteName: "Codelyne Technologies",
  twitterSite: "@replit",
};

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product" | "profile";
  noindex?: boolean;
  canonical?: string;
}

function absolute(url?: string) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function SEO({
  title,
  description,
  image,
  url,
  type = DEFAULTS.type,
  noindex = false,
  canonical,
}: SEOProps) {
  const finalTitle = title
    ? `${title} | ${DEFAULTS.siteName}`
    : DEFAULTS.title;
  const finalDescription = description || DEFAULTS.description;
  const finalImage = absolute(image) || DEFAULTS.image;
  const pagePath =
    url ||
    (typeof window !== "undefined" ? window.location.pathname : "/");
  const finalUrl = absolute(pagePath) || SITE_URL;
  const finalCanonical = absolute(canonical) || finalUrl;

  return (
    <Helmet prioritizeSeoTags>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={finalCanonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={DEFAULTS.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={DEFAULTS.twitterSite} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  );
}

export default SEO;
