import { applyPhone } from "./phone";

export type FaqItem = { question: string; answer: string };
export type SnapshotField = { label: string; value: string };
export type LinkItem = { href: string; label: string };

export type ParsedSection = {
  id: string;
  heading: string;
  raw: string;
  isFaq: boolean;
  isClosing: boolean;
  hasTimeline: boolean;
};

export type ParsedPage = {
  h1: string;
  lead: string;
  intro: string;
  localSnapshot: SnapshotField[];
  sections: ParsedSection[];
  faqs: FaqItem[];
  faqGroups: { heading: string; faqs: FaqItem[] }[];
  relatedLinks: LinkItem[];
  closingHeading: string;
  closingText: string;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractFaqs(block: string): FaqItem[] {
  const text = applyPhone(block.trim());
  const faqs: FaqItem[] = [];
  const lines = text.split(/\n/);
  let q: string | null = null;
  let a: string[] = [];

  const flush = () => {
    if (q && a.length) {
      faqs.push({ question: q, answer: a.join(" ").replace(/\s+/g, " ").trim() });
    }
    q = null;
    a = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "---") continue;
    const m = trimmed.match(/^\*\*(.+?)\*\*\s*$/);
    if (m && m[1].includes("?")) {
      flush();
      q = m[1].trim();
      continue;
    }
    if (q) {
      if (m && !m[1].includes("?")) {
        flush();
        continue;
      }
      a.push(trimmed.replace(/^\*\*|\*\*$/g, ""));
    }
  }
  flush();
  return faqs;
}

export function extractLocalSnapshot(body: string): {
  fields: SnapshotField[];
  rest: string;
} {
  const re = /\*\*Local Snapshot\*\*\s*\n((?:- \*\*[^*]+:\*\*[^\n]*\n?)+)/i;
  const m = body.match(re);
  if (!m) return { fields: [], rest: body };
  const fields: SnapshotField[] = [];
  for (const line of m[1].split("\n")) {
    const fm = line.match(/^- \*\*([^:]+):\*\*\s*(.+)$/);
    if (fm) fields.push({ label: fm[1].trim(), value: applyPhone(fm[2].trim()) });
  }
  return { fields, rest: body.replace(m[0], "") };
}

export function extractLinks(block: string): LinkItem[] {
  const links: LinkItem[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  const text = applyPhone(block);
  while ((m = re.exec(text))) {
    links.push({ label: m[1], href: m[2] });
  }
  return links;
}

export function parsePage(body: string): ParsedPage {
  let text = applyPhone(body.replace(/\r\n/g, "\n"));
  const snap = extractLocalSnapshot(text);
  text = snap.rest.trim();

  const h1Match = text.match(/^#\s+(.+)\n*/);
  const h1 = h1Match ? h1Match[1].trim() : "";
  text = h1Match ? text.slice(h1Match[0].length) : text;

  let lead = "";
  const leadMatch = text.match(/^\*\*([^*]+)\*\*\s*\n+/);
  if (leadMatch && !leadMatch[1].startsWith("Local Snapshot") && !leadMatch[1].startsWith("[")) {
    lead = leadMatch[1].trim();
    text = text.slice(leadMatch[0].length);
  }

  // Strip CTA call brackets like [ Call ... ]
  text = text.replace(/^\[\s*Call[^\]]*\]\s*\n*/i, "");
  text = text.replace(/^\s*---\s*$/gm, "");
  text = text.replace(/\*\(Developer note:[^*]*\)\*/gi, "");
  text = text.replace(/\n{3,}/g, "\n\n");

  const parts = text.split(/\n(?=## )/);
  let intro = "";
  const sections: ParsedSection[] = [];
  const faqGroups: { heading: string; faqs: FaqItem[] }[] = [];
  let faqs: FaqItem[] = [];
  let relatedLinks: LinkItem[] = [];
  let closingHeading = "";
  let closingText = "";

  for (const part of parts) {
    if (!part.trim()) continue;
    if (!part.startsWith("## ")) {
      intro += (intro ? "\n" : "") + part.trim();
      continue;
    }
    const hm = part.match(/^##\s+(.+)\n?/);
    if (!hm) continue;
    const heading = hm[1].trim();
    const raw = part.slice(hm[0].length).trim();
    const isFaq = /frequently asked questions/i.test(heading);
    const hasTimeline = /\*\*Timeline Strip\*\*/i.test(raw);
    const lower = heading.toLowerCase();
    const isClosing =
      !isFaq &&
      (lower.includes("call now") ||
        lower.includes("do not wait") ||
        lower.includes("talk to") ||
        lower.includes("not sure") ||
        lower.includes("water trouble") ||
        lower.includes("water in your") ||
        lower.includes("still wondering") ||
        lower.includes("let us handle") ||
        lower.includes("get the water") ||
        lower.includes("dry it right") ||
        lower.includes("flooded?") ||
        lower.includes("pipe just") ||
        lower.includes("stop the leak") ||
        lower.includes("fix the ceiling") ||
        lower.includes("get your") ||
        lower.includes("sewage in") ||
        lower.includes("appliance leak") ||
        lower.includes("think you") ||
        lower.includes("get mold") ||
        lower.includes("storm hit") ||
        lower.includes("save your") ||
        lower.includes("find hidden") ||
        lower.includes("leak in") ||
        lower.includes("wet floors") ||
        lower.includes("water coming") ||
        lower.includes("ac dripping") ||
        lower.includes("storm damage") ||
        lower.includes("drain backup") ||
        lower.includes("bathroom leak") ||
        lower.includes("musty smell") ||
        lower.includes("kitchen leak") ||
        /^call /i.test(heading));

    if (isFaq) {
      const items = extractFaqs(raw);
      faqs = items;
      faqGroups.push({ heading, faqs: items });
      sections.push({
        id: slugify(heading),
        heading,
        raw,
        isFaq: true,
        isClosing: false,
        hasTimeline,
      });
      continue;
    }

    if (/related services|what we offer|services most requested/i.test(heading)) {
      relatedLinks = extractLinks(raw);
      if (!relatedLinks.length) {
        // bullet links
        relatedLinks = extractLinks(raw);
      }
    }

    // Collect links from offer sections
    if (/what we offer|related services|services most requested/i.test(heading)) {
      relatedLinks = extractLinks(raw);
    }

    if (isClosing) {
      closingHeading = heading;
      closingText = raw.replace(/\*\*/g, "").trim();
      continue;
    }

    // FAQ-style groups on FAQ page (numbered sections of Q&A)
    if (/^\d+\./.test(heading) === false && extractFaqs(raw).length >= 2 && !raw.includes("\n##")) {
      const items = extractFaqs(raw);
      if (items.length >= 2 && items.every((f) => f.question.includes("?"))) {
        faqGroups.push({ heading, faqs: items });
      }
    }

    sections.push({
      id: slugify(heading),
      heading,
      raw,
      isFaq: false,
      isClosing: false,
      hasTimeline,
    });
  }

  // FAQ page: each numbered section is a FAQ group
  if (faqGroups.length === 0) {
    for (const s of sections) {
      if (s.isFaq) continue;
      const items = extractFaqs(s.raw);
      if (items.length >= 2) {
        faqGroups.push({ heading: s.heading, faqs: items });
      }
    }
  }

  // Gather related links from all sections if empty
  if (!relatedLinks.length) {
    for (const s of sections) {
      if (/offer|related|request/i.test(s.heading)) {
        relatedLinks = extractLinks(s.raw);
        break;
      }
    }
  }

  return {
    h1,
    lead,
    intro: intro.trim(),
    localSnapshot: snap.fields,
    sections: sections.filter((s) => !s.isFaq),
    faqs,
    faqGroups,
    relatedLinks,
    closingHeading,
    closingText,
  };
}
