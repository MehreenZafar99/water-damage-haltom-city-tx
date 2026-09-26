import type { Metadata } from "next";
import siteConfig from "../../site.config";
import ShellWithPath from "@/components/ShellWithPath";
import { JsonLd } from "@/components/Shared";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.city}, ${siteConfig.state}`,
    template: `%s`,
  },
  description: `Water damage restoration in ${siteConfig.city}, ${siteConfig.state}. Call ${siteConfig.phoneDisplay}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const businessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.phoneTel,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.state,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: siteConfig.city,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Tarrant County, Texas",
      },
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={businessLd} />
      </head>
      <body>
        <ShellWithPath>{children}</ShellWithPath>
      </body>
    </html>
  );
}
