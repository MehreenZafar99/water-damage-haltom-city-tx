import siteConfig from "../../site.config";
import type { FaqItem } from "@/lib/parse-page";
import { inline } from "@/lib/markdown";

export function PhoneLink({
  className = "btn-phone",
  label,
  block = false,
}: {
  className?: string;
  label?: string;
  block?: boolean;
}) {
  const cls = [className, block ? "btn-phone-block" : ""].filter(Boolean).join(" ");
  return (
    <a className={cls} href={`tel:${siteConfig.phoneTel}`}>
      {label || `Call ${siteConfig.phoneDisplay}`}
    </a>
  );
}

export function BigCall({
  heading = "Water damage will not wait. Neither will we.",
  sub = `24 hours a day, every neighborhood in ${siteConfig.city}, ${siteConfig.state}`,
}: {
  heading?: string;
  sub?: string;
}) {
  return (
    <section className="bigcall">
      <div className="wrap">
        <h2>{heading}</h2>
        <p className="bigcall-btn-wrap">
          <a className="btn-phone" href={`tel:${siteConfig.phoneTel}`}>
            Call {siteConfig.phoneDisplay}
          </a>
        </p>
        <p>{sub}</p>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-brand">
          <strong>{siteConfig.name}</strong>
          <p>
            3847 Denton Highway, Suite 120
            <br />
            Haltom City, TX 76117
          </p>
        </div>
        <div className="foot-contact">
          <PhoneLink />
          <p>Open 24 hours, 7 days a week</p>
        </div>
        <div className="foot-links">
          <a href="/privacy-policy/">Privacy Policy</a>
          <a href="/terms-of-service/">Terms of Service</a>
          <a href="/contact-us/">Contact</a>
        </div>
        <p className="foot-copy">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}

export function Breadcrumb({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  return (
    <nav className="breadcrumb wrap" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span>/</span>}
          {item.href ? <a href={item.href}>{item.label}</a> : item.label}
        </span>
      ))}
    </nav>
  );
}

/** FAQ list without Caller/Crew labels */
export function FaqList({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs.length) return null;
  return (
    <div className="qa-list">
      {faqs.map((f, i) => (
        <div className="qa-item" key={i}>
          <p className="q">{f.question}</p>
          <p className="a">{inline(f.answer)}</p>
        </div>
      ))}
    </div>
  );
}

/** @deprecated alias */
export const FaqCallerCrew = FaqList;

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs.length) return null;
  return (
    <div className="qa">
      {faqs.map((f, i) => (
        <details key={i}>
          <summary>{f.question}</summary>
          <p className="a">{inline(f.answer)}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqGrid({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs.length) return null;
  return (
    <div className="faq-grid">
      {faqs.map((f, i) => (
        <article className="faq-grid-item" key={i}>
          <h3>{f.question}</h3>
          <p>{inline(f.answer)}</p>
        </article>
      ))}
    </div>
  );
}

export function LocalSnapshot({
  fields,
}: {
  fields: { label: string; value: string }[];
}) {
  if (!fields.length) return null;
  return (
    <div className="snapshot" aria-label="Local Snapshot">
      {fields.map((f) => (
        <div className="snapshot-row" key={f.label}>
          <span>{f.label}</span>
          <b>{f.value}</b>
        </div>
      ))}
    </div>
  );
}

export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
