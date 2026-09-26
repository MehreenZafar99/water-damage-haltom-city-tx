import siteConfig from "../../site.config";
import {
  ContentPage,
  getNeighborhoodPages,
  getServicePages,
} from "@/lib/content";
import { NEIGHBORHOOD_PROBLEMS } from "@/lib/site-data";
import { MarkdownBlock, hasPhoneMention, stripPhoneMentions } from "@/lib/markdown";
import { extractFaqs, parsePage } from "@/lib/parse-page";
import {
  BigCall,
  Breadcrumb,
  FaqList,
  FaqGrid,
  LocalSnapshot,
  PhoneLink,
  SiteFooter,
} from "./Shared";

function sectionTitle(heading: string) {
  return heading.replace(/^\d+\.\s*/, "");
}

function linkLabel(rawSections: { raw: string }[], href: string) {
  const fromMd = rawSections
    .flatMap((s) => s.raw.split("\n"))
    .map((l) => {
      const bold = l.match(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/);
      if (bold && bold[2] === href) return bold[1];
      const plain = l.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (plain && plain[2] === href) return plain[1];
      return null;
    })
    .find(Boolean);
  if (fromMd) return fromMd;
  // Humanize path fallback — never show raw URL as label
  const slug = href.replace(/\/$/, "").split("/").pop() || href;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function ServiceTemplate({ page }: { page: ContentPage }) {
  const parsed = parsePage(page.body);
  const services = getServicePages().filter((s) => s.slug !== page.slug).slice(0, 5);
  const related =
    parsed.relatedLinks.length > 0
      ? parsed.relatedLinks
      : services.map((s) => ({
          href: s.slug,
          label: s.title.split("|")[0].replace(/Haltom City TX.*/i, "").trim(),
        }));

  const contentSections = parsed.sections.filter(
    (s) => !/related services|what we offer/i.test(s.heading)
  );

  return (
    <div className="inner-page">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/services/", label: "Services" },
          { label: parsed.h1.replace(/ in Haltom City.*/i, "") },
        ]}
      />
      <header className="page-hero">
        <div className="wrap">
          <span className="kicker">Service</span>
          <h1>{parsed.h1}</h1>
          {parsed.lead && (
            <p className="lead">
              {hasPhoneMention(parsed.lead) ? stripPhoneMentions(parsed.lead) : parsed.lead}
            </p>
          )}
          <PhoneLink />
          <div className="glance">
            <div>
              <span>Arrival</span>
              <b>~60 minutes</b>
            </div>
            <div>
              <span>Drying time</span>
              <b>3 to 5 days</b>
            </div>
            <div>
              <span>Assessment</span>
              <b>Free</b>
            </div>
          </div>
        </div>
      </header>
      <div className="page-body">
        <div className="wrap page-split">
          <div className="prose">
            {parsed.intro && (
              <section>
                <MarkdownBlock
                  source={
                    hasPhoneMention(parsed.intro)
                      ? stripPhoneMentions(parsed.intro)
                      : parsed.intro
                  }
                />
              </section>
            )}
            {contentSections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2>{sectionTitle(s.heading)}</h2>
                <MarkdownBlock source={s.raw} />
              </section>
            ))}
          </div>
          <aside className="sticky-aside">
            <div className="aside-call">
              <small>
                <span className="dot" aria-hidden="true" /> Available now
              </small>
              <PhoneLink block />
              <p>Open 24/7. A real person answers.</p>
            </div>
            <div className="aside-related">
              <h3>Related services</h3>
              <ul>
                {related.slice(0, 6).map((r) => (
                  <li key={r.href}>
                    <a href={r.href}>{r.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
      {parsed.faqs.length > 0 && (
        <section className="faq-section">
          <div className="wrap">
            <span className="kicker">Questions</span>
            <h2>Frequently Asked Questions</h2>
            <FaqList faqs={parsed.faqs} />
          </div>
        </section>
      )}
      <BigCall heading={parsed.closingHeading || "Need help now?"} />
      <SiteFooter />
    </div>
  );
}

export function NeighborhoodTemplate({ page }: { page: ContentPage }) {
  const parsed = parsePage(page.body);
  const allOthers = getNeighborhoodPages().filter((n) => n.slug !== page.slug);
  const start = page.slug.length % Math.max(allOthers.length, 1);
  const others = [...allOthers.slice(start), ...allOthers.slice(0, start)].slice(0, 4);

  const contentSections = parsed.sections.filter(
    (s) => !/related services|what we offer|services most requested/i.test(s.heading)
  );

  const introFirst = parsed.intro.split("\n\n")[0] || "";
  const introRest = parsed.intro.split("\n\n").slice(1).join("\n\n");

  return (
    <div className="inner-page">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/service-areas/", label: "Service Areas" },
          {
            label: parsed.h1.replace(/Water Damage Restoration in |, Haltom City/gi, ""),
          },
        ]}
      />
      <div className="wrap page-body neigh-shell">
        <LocalSnapshot fields={parsed.localSnapshot} />
        <header className="page-head" style={{ background: "transparent", border: 0, padding: "8px 0 24px" }}>
          <span className="kicker">Neighborhood</span>
          <h1>{parsed.h1}</h1>
          {parsed.lead && (
            <p>
              {hasPhoneMention(parsed.lead) ? stripPhoneMentions(parsed.lead) : parsed.lead}
            </p>
          )}
          {!parsed.lead && introFirst && (
            <div className="prose">
              <MarkdownBlock
                source={
                  hasPhoneMention(introFirst) ? stripPhoneMentions(introFirst) : introFirst
                }
              />
            </div>
          )}
          <PhoneLink />
        </header>
        <div className="prose">
          {parsed.intro && parsed.lead && (
            <section>
              <MarkdownBlock
                source={
                  hasPhoneMention(parsed.intro)
                    ? stripPhoneMentions(parsed.intro)
                    : parsed.intro
                }
              />
            </section>
          )}
          {parsed.intro && !parsed.lead && introRest && (
            <section>
              <MarkdownBlock
                source={
                  hasPhoneMention(introRest) ? stripPhoneMentions(introRest) : introRest
                }
              />
            </section>
          )}
          {contentSections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{sectionTitle(s.heading)}</h2>
              <MarkdownBlock source={s.raw} />
            </section>
          ))}
        </div>
        {parsed.relatedLinks.length > 0 && (
          <div className="neigh-block">
            <span className="kicker">Nearby help</span>
            <h2>Related services</h2>
            <div className="rel-row">
              {parsed.relatedLinks.map((l) => (
                <a key={l.href} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
        {parsed.faqs.length > 0 && (
          <div className="neigh-block">
            <span className="kicker">Local answers</span>
            <h2>Frequently Asked Questions</h2>
            <FaqGrid faqs={parsed.faqs} />
          </div>
        )}
        <div className="neigh-block">
          <span className="kicker">Still in Haltom City</span>
          <h2>Other Haltom City neighborhoods</h2>
          <div className="chips">
            {others.map((n) => {
              const name =
                NEIGHBORHOOD_PROBLEMS.find((x) => x.slug === n.slug)?.name ||
                n.slug.replace(/\/service-areas\/|\/$/g, "").replace(/-/g, " ");
              return (
                <a key={n.slug} href={n.slug}>
                  {name}
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <BigCall heading={parsed.closingHeading || "Need local help now?"} />
      <SiteFooter />
    </div>
  );
}

export function ServicesHubTemplate({ page }: { page: ContentPage }) {
  const parsed = parsePage(page.body);
  const groups = [
    {
      title: "Emergency",
      links: [
        "/services/emergency-water-damage-restoration/",
        "/services/water-extraction/",
        "/services/structural-drying-dehumidification/",
        "/services/water-damage-inspection-moisture-detection/",
      ],
    },
    {
      title: "By Water Source",
      links: [
        "/services/burst-pipe-water-damage/",
        "/services/slab-leak-water-damage/",
        "/services/appliance-leak-water-damage/",
        "/services/roof-leak-water-damage/",
        "/services/flood-damage-restoration/",
        "/services/storm-damage-restoration/",
        "/services/sewage-backup-cleanup/",
      ],
    },
    {
      title: "By Area",
      links: [
        "/services/ceiling-water-damage-repair/",
        "/services/carpet-flooring-water-damage/",
        "/services/drywall-water-damage-repair/",
        "/services/basement-crawl-space-water-damage/",
      ],
    },
    {
      title: "After the Water",
      links: ["/services/mold-remediation/", "/insurance-claims-help/"],
    },
  ];

  return (
    <div className="inner-page">
      <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Services" }]} />
      <header className="page-head">
        <div className="wrap">
          <span className="kicker">Full directory</span>
          <h1>{parsed.h1}</h1>
          {parsed.intro && (
            <div className="prose">
              <MarkdownBlock source={parsed.intro} />
            </div>
          )}
          <PhoneLink />
        </div>
      </header>
      <div className="wrap page-body">
        <div className="dir-grid hub-dir">
          {groups.map((g) => (
            <article className="dir-card" key={g.title}>
              <h3>{g.title}</h3>
              <ul>
                {g.links.map((href) => (
                  <li key={href}>
                    <a href={href}>{linkLabel(parsed.sections, href)}</a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        {parsed.sections.map((s) => (
          <section className="hub-group" key={s.id} id={s.id}>
            <h2>{sectionTitle(s.heading)}</h2>
            <MarkdownBlock source={s.raw} />
          </section>
        ))}
      </div>
      {parsed.faqs.length > 0 && (
        <section className="faq-section">
          <div className="wrap">
            <span className="kicker">Questions</span>
            <h2>Frequently Asked Questions</h2>
            <FaqList faqs={parsed.faqs} />
          </div>
        </section>
      )}
      <BigCall heading={parsed.closingHeading || "Not sure where to start?"} />
      <SiteFooter />
    </div>
  );
}

export function AreasHubTemplate({ page }: { page: ContentPage }) {
  const parsed = parsePage(page.body);
  const problemSection = parsed.sections.find((s) =>
    /common water problems/i.test(s.heading)
  );
  const areaSections = parsed.sections.filter(
    (s) => !/common water problems/i.test(s.heading)
  );

  return (
    <div className="inner-page">
      <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Service Areas" }]} />
      <header className="page-head">
        <div className="wrap">
          <span className="kicker">Haltom City only</span>
          <h1>{parsed.h1}</h1>
          {parsed.intro && (
            <div className="prose">
              <MarkdownBlock source={parsed.intro} />
            </div>
          )}
          <PhoneLink />
        </div>
      </header>
      <div className="wrap page-body">
        <div className="hoods" style={{ marginBottom: 36 }}>
          {NEIGHBORHOOD_PROBLEMS.map((n) => (
            <article className="hood-card" key={n.slug}>
              <a href={n.slug}>{n.name}</a>
              <p>{n.problem}</p>
            </article>
          ))}
        </div>
        {problemSection && (
          <section className="hub-group" id={problemSection.id}>
            <h2>{sectionTitle(problemSection.heading)}</h2>
            <MarkdownBlock source={problemSection.raw} />
          </section>
        )}
        <div className="area-groups">
          {areaSections.map((s) => (
            <section className="area-group" key={s.id}>
              <h2>{sectionTitle(s.heading)}</h2>
              <MarkdownBlock source={s.raw} />
            </section>
          ))}
        </div>
      </div>
      {parsed.faqs.length > 0 && (
        <section className="faq-section">
          <div className="wrap">
            <span className="kicker">Questions</span>
            <h2>Frequently Asked Questions</h2>
            <FaqList faqs={parsed.faqs} />
          </div>
        </section>
      )}
      <BigCall heading={parsed.closingHeading || "Water in your home right now?"} />
      <SiteFooter />
    </div>
  );
}

export function AboutTemplate({ page }: { page: ContentPage }) {
  const parsed = parsePage(page.body);
  return (
    <div className="inner-page">
      <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "About Us" }]} />
      <header className="page-head">
        <div className="wrap">
          <span className="kicker">Our crew</span>
          <h1>{parsed.h1}</h1>
          {parsed.intro && (
            <div className="prose">
              <MarkdownBlock source={parsed.intro} />
            </div>
          )}
          <PhoneLink />
        </div>
      </header>
      <div className="wrap page-body prose">
        {parsed.sections.map((s) => {
          if (/what we believe/i.test(s.heading)) {
            const quotes = s.raw
              .split(/\n\n+/)
              .map((b) => b.trim())
              .filter((b) => b.startsWith("**"));
            return (
              <section key={s.id} id={s.id}>
                <h2>{sectionTitle(s.heading)}</h2>
                <div className="pull-quotes">
                  {quotes.map((q, i) => (
                    <blockquote className="pull-quote" key={i}>
                      <MarkdownBlock source={q} />
                    </blockquote>
                  ))}
                </div>
              </section>
            );
          }
          if (/training and standards/i.test(s.heading)) {
            const parts = s.raw.split(/Our equipment includes:/i);
            return (
              <section key={s.id} id={s.id}>
                <h2>{sectionTitle(s.heading)}</h2>
                {parts[0] && <MarkdownBlock source={parts[0]} />}
                {parts[1] && (
                  <>
                    <p>
                      <strong>Our equipment includes:</strong>
                    </p>
                    <ul className="checklist">
                      {parts[1]
                        .split("\n")
                        .filter((l) => l.startsWith("- "))
                        .map((l) => (
                          <li key={l}>{l.replace(/^- /, "")}</li>
                        ))}
                    </ul>
                  </>
                )}
              </section>
            );
          }
          return (
            <section key={s.id} id={s.id}>
              <h2>{sectionTitle(s.heading)}</h2>
              <MarkdownBlock source={s.raw} />
            </section>
          );
        })}
      </div>
      {parsed.faqs.length > 0 && (
        <section className="faq-section">
          <div className="wrap">
            <span className="kicker">Questions</span>
            <h2>Frequently Asked Questions</h2>
            <FaqList faqs={parsed.faqs} />
          </div>
        </section>
      )}
      <BigCall heading={parsed.closingHeading || "Talk to our team"} />
      <SiteFooter />
    </div>
  );
}

export function FaqTemplate({ page }: { page: ContentPage }) {
  const parsed = parsePage(page.body);
  const groups =
    parsed.faqGroups.length > 0
      ? parsed.faqGroups.filter((g) => !/frequently/i.test(g.heading))
      : parsed.sections.map((s) => ({
          heading: s.heading,
          faqs: extractFaqs(s.raw),
        }));

  return (
    <div className="inner-page">
      <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "FAQ" }]} />
      <header className="page-head">
        <div className="wrap">
          <span className="kicker">Answers</span>
          <h1>{parsed.h1}</h1>
          {parsed.intro && (
            <div className="prose">
              <MarkdownBlock source={parsed.intro} />
            </div>
          )}
        </div>
      </header>
      {groups.map((g, i) => (
        <section className={`faq-section ${i % 2 ? "band-paper" : ""}`} key={g.heading}>
          <div className="wrap">
            <span className="kicker">Group {String(i + 1).padStart(2, "0")}</span>
            <h2>{sectionTitle(g.heading)}</h2>
            <FaqList faqs={g.faqs} />
          </div>
        </section>
      ))}
      <BigCall heading={parsed.closingHeading || "Still wondering about something?"} />
      <SiteFooter />
    </div>
  );
}

export function InsuranceTemplate({ page }: { page: ContentPage }) {
  const parsed = parsePage(page.body);
  return (
    <div className="inner-page">
      <Breadcrumb
        items={[{ href: "/", label: "Home" }, { label: "Insurance Claims Help" }]}
      />
      <header className="page-head">
        <div className="wrap">
          <span className="kicker">Claims help</span>
          <h1>{parsed.h1}</h1>
          {parsed.intro && (
            <div className="prose">
              <MarkdownBlock source={parsed.intro} />
            </div>
          )}
          <PhoneLink />
        </div>
      </header>
      <section className="ins">
        <div className="wrap">
          <div className="ins-grid">
            <div className="ins-col yes">
              <h3>Usually covered</h3>
              <ul>
                <li>Burst or frozen pipes</li>
                <li>Water heater or washer failure</li>
                <li>A broken supply line under a sink</li>
                <li>Roof leaks caused by a storm</li>
              </ul>
            </div>
            <div className="ins-col no">
              <h3>Often not covered</h3>
              <ul>
                <li>Slow leaks that went on for months</li>
                <li>Outside flood water without flood insurance</li>
                <li>Damage from lack of maintenance</li>
              </ul>
            </div>
            <div className="ins-col">
              <h3>What we do for your claim</h3>
              <ul>
                <li>Photos and daily moisture logs</li>
                <li>Itemized estimate insurers accept</li>
                <li>Meet your adjuster on site</li>
                <li>Direct billing with most carriers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap page-body prose">
        {parsed.sections.map((s) => (
          <section key={s.id} id={s.id}>
            <h2>{sectionTitle(s.heading)}</h2>
            <MarkdownBlock source={s.raw} />
          </section>
        ))}
      </div>
      {parsed.faqs.length > 0 && (
        <section className="faq-section">
          <div className="wrap">
            <span className="kicker">Questions</span>
            <h2>Frequently Asked Questions</h2>
            <FaqList faqs={parsed.faqs} />
          </div>
        </section>
      )}
      <BigCall heading={parsed.closingHeading || "Let us handle the paperwork"} />
      <SiteFooter />
    </div>
  );
}

export function ContactTemplate({ page }: { page: ContentPage }) {
  const parsed = parsePage(page.body);
  const ready = parsed.sections.find((s) => /have these ready/i.test(s.heading));
  const wait = parsed.sections.find((s) => /while you wait/i.test(s.heading));

  return (
    <div className="inner-page">
      <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Contact" }]} />
      <section className="contact-panel">
        <div className="wrap">
          <span className="kicker" style={{ color: "var(--amber)" }}>
            Reach us now
          </span>
          <h1>{parsed.h1}</h1>
          <p>The fastest way to reach us is by phone. A real person answers every call.</p>
          <p style={{ marginTop: 16 }}>
            <PhoneLink />
          </p>
          <p>Available 24 hours a day, 7 days a week, including holidays</p>
          <p>Service Area: All of Haltom City, Texas</p>
        </div>
      </section>
      <div className="wrap contact-lists">
        {ready && (
          <div className="contact-card">
            <h2>{sectionTitle(ready.heading)}</h2>
            <MarkdownBlock source={ready.raw} />
          </div>
        )}
        {wait && (
          <div className="contact-card">
            <h2>{sectionTitle(wait.heading)}</h2>
            <MarkdownBlock source={wait.raw} />
          </div>
        )}
      </div>
      <BigCall heading="Call now" />
      <SiteFooter />
    </div>
  );
}

export function LegalTemplate({ page }: { page: ContentPage }) {
  const parsed = parsePage(page.body);
  return (
    <div className="inner-page">
      <Breadcrumb items={[{ href: "/", label: "Home" }, { label: parsed.h1 }]} />
      <article className="wrap legal">
        <div className="legal-card">
          <h1>{parsed.h1}</h1>
          {parsed.intro && <MarkdownBlock source={parsed.intro} />}
          {parsed.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{sectionTitle(s.heading)}</h2>
              <MarkdownBlock source={s.raw} />
            </section>
          ))}
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
