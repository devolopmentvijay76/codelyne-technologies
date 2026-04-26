import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://codelynetechnologies.com"),
  title: "Codelyne Technologies | AI-First Enterprise Engineering",
  description:
    "Codelyne Technologies is an AI-driven software and product engineering company building the future for enterprises.",
  openGraph: {
    title: "Codelyne Technologies",
    description: "AI-driven software and product engineering.",
    type: "website",
    images: ["https://replit.com/public/images/opengraph.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@replit",
    title: "Codelyne Technologies",
    description: "AI-driven software and product engineering.",
    images: ["https://replit.com/public/images/opengraph.png"],
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
