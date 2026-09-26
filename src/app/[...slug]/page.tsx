import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/Shared";
import {
  AboutTemplate,
  AreasHubTemplate,
  ContactTemplate,
  FaqTemplate,
  InsuranceTemplate,
  LegalTemplate,
  NeighborhoodTemplate,
  ServiceTemplate,
  ServicesHubTemplate,
} from "@/components/Templates";
import { getAllPages, getPageBySlug, type ContentPage } from "@/lib/content";
import { parsePage } from "@/lib/parse-page";
import siteConfig from "../../../site.config";

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return getAllPages()
    .filter((p) => p.slug !== "/")
    .map((p) => {
      const parts = p.slug.replace(/^\/|\/$/g, "").split("/");
      return { slug: parts };
    });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = "/" + slug.join("/") + "/";
  const page = getPageBySlug(path);
  if (!page) return {};
  const url = siteConfig.url + page.slug;
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url,
      type: "website",
    },
  };
}

function breadcrumbLd(page: ContentPage) {
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url + "/" },
  ];
  if (page.type === "service") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: "Services",
      item: siteConfig.url + "/services/",
    });
    items.push({
      "@type": "ListItem",
      position: 3,
      name: page.title.split("|")[0].trim(),
      item: siteConfig.url + page.slug,
    });
  } else if (page.type === "neighborhood") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: "Service Areas",
      item: siteConfig.url + "/service-areas/",
    });
    items.push({
      "@type": "ListItem",
      position: 3,
      name: page.title.split("|")[0].trim(),
      item: siteConfig.url + page.slug,
    });
  } else {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: page.title.split("|")[0].trim(),
      item: siteConfig.url + page.slug,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function RenderPage({ page }: { page: ContentPage }) {
  switch (page.type) {
    case "service":
      return <ServiceTemplate page={page} />;
    case "neighborhood":
      return <NeighborhoodTemplate page={page} />;
    case "services-hub":
      return <ServicesHubTemplate page={page} />;
    case "service-areas-hub":
      return <AreasHubTemplate page={page} />;
    case "about":
      return <AboutTemplate page={page} />;
    case "faq":
      return <FaqTemplate page={page} />;
    case "insurance":
      return <InsuranceTemplate page={page} />;
    case "contact":
      return <ContactTemplate page={page} />;
    case "privacy":
    case "terms":
      return <LegalTemplate page={page} />;
    default:
      return <LegalTemplate page={page} />;
  }
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const path = "/" + slug.join("/") + "/";
  const page = getPageBySlug(path);
  if (!page) notFound();

  const parsed = parsePage(page.body);
  const schemas: Record<string, unknown>[] = [breadcrumbLd(page)];

  if (page.type === "service") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: parsed.h1,
      description: page.metaDescription,
      provider: { "@id": `${siteConfig.url}/#business` },
      areaServed: { "@type": "City", name: siteConfig.city },
      url: siteConfig.url + page.slug,
    });
  }

  const faqs =
    page.type === "faq"
      ? parsed.faqGroups.flatMap((g) => g.faqs)
      : page.type === "contact"
        ? []
        : parsed.faqs;

  if (faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return (
    <>
      <JsonLd data={schemas} />
      <RenderPage page={page} />
    </>
  );
}
