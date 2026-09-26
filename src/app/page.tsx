import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { JsonLd } from "@/components/Shared";
import { getPageBySlug } from "@/lib/content";
import siteConfig from "../../site.config";

export function generateMetadata(): Metadata {
  const page = getPageBySlug("/");
  return {
    title: page?.title || `Water Damage Restoration ${siteConfig.city} TX`,
    description: page?.metaDescription || "",
    alternates: { canonical: siteConfig.url + "/" },
    openGraph: {
      title: page?.title || "",
      description: page?.metaDescription || "",
      url: siteConfig.url + "/",
      type: "website",
    },
  };
}

export default function Page() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How fast can you get here?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In most cases a crew arrives within 60 minutes anywhere in Haltom City, day or night.",
        },
      },
      {
        "@type": "Question",
        name: "Do I call my insurance company first?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Stop the water and call us so drying starts right away. Then open your claim. Waiting can make the damage worse and weaken your claim.",
        },
      },
      {
        "@type": "Question",
        name: "How long will the drying take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most properties dry in three to five days. Concrete slabs and hardwood can take a little longer.",
        },
      },
      {
        "@type": "Question",
        name: "Can I stay in my home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Usually yes. If sewage or heavy mold is involved, we may ask you to stay out of that area until it is cleaned.",
        },
      },
      {
        "@type": "Question",
        name: "Is the inspection free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The on site assessment costs nothing.",
        },
      },
      {
        "@type": "Question",
        name: "Do you also do the repairs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Once everything is dry we replace drywall, flooring, texture, paint and trim.",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <HomePage />
    </>
  );
}
