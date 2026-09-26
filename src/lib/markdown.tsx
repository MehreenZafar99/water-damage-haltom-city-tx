import React from "react";
import siteConfig from "../../site.config";
import { applyPhone } from "./phone";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phoneButton(key: number) {
  return (
    <a key={key} className="btn-phone btn-phone-sm" href={`tel:${siteConfig.phoneTel}`}>
      Call {siteConfig.phoneDisplay}
    </a>
  );
}

/** Split plain text and turn phone numbers into buttons */
function withPhoneButtons(text: string, keyStart: number): React.ReactNode[] {
  const phone = escapeRegExp(siteConfig.phoneDisplay);
  const placeholder = escapeRegExp(siteConfig.phonePlaceholder);
  const re = new RegExp(`(\\*\\*)?(?:${phone}|${placeholder}|\\(817\\)\\s*XXX-XXXX)(\\*\\*)?`, "g");
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = keyStart;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    nodes.push(phoneButton(key++));
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length ? nodes : [text];
}

/** Inline markdown: bold links, links, bold, italic, phone buttons */
export function inline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re =
    /(\*\*\[[^\]]+\]\([^)]+\)\*\*|\[[^\]]+\]\([^)]+\)|\*\*[^*]+?\*\*|\*[^*]+?\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  const src = applyPhone(text);
  while ((m = re.exec(src))) {
    if (m.index > last) {
      nodes.push(...withPhoneButtons(src.slice(last, m.index), key));
      key += 10;
    }
    const token = m[0];
    const boldLink = token.match(/^\*\*\[([^\]]+)\]\(([^)]+)\)\*\*$/);
    if (boldLink) {
      // If the link text is a phone / call CTA, render as phone button
      if (/817|call/i.test(boldLink[1]) && /tel:|817/i.test(boldLink[2] + boldLink[1])) {
        nodes.push(phoneButton(key++));
      } else {
        nodes.push(
          <a key={key++} href={boldLink[2]} className="md-link">
            <strong>{boldLink[1]}</strong>
          </a>
        );
      }
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        if (link[2].startsWith("tel:") || /817/.test(link[1])) {
          nodes.push(phoneButton(key++));
        } else {
          nodes.push(
            <a key={key++} href={link[2]} className="md-link">
              {link[1]}
            </a>
          );
        }
      } else if (token.startsWith("**") && token.endsWith("**")) {
        const inner = token.slice(2, -2);
        if (inner === siteConfig.phoneDisplay || /\(817\)/.test(inner)) {
          nodes.push(phoneButton(key++));
        } else {
          nodes.push(<strong key={key++}>{inner}</strong>);
        }
      } else if (token.startsWith("*") && token.endsWith("*")) {
        nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
      } else {
        nodes.push(...withPhoneButtons(token, key));
        key += 10;
      }
    }
    last = m.index + token.length;
  }
  if (last < src.length) {
    nodes.push(...withPhoneButtons(src.slice(last), key));
  }
  return nodes;
}

function parseTable(rows: string[]): React.ReactNode {
  const cells = rows.map((r) =>
    r
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim())
  );
  const bodyStart = cells[1]?.every((c) => /^[-:]+$/.test(c)) ? 2 : 1;
  const head = cells[0];
  const body = cells.slice(bodyStart);
  return (
    <div className="table-wrap" key="table">
      <table className="data-table">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, i) => (
            <tr key={i}>
              {row.map((c, j) => (
                <td key={j}>{inline(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function parseTimeline(block: string): React.ReactNode {
  const items: { title: string; body: string }[] = [];
  const lines = block.split("\n").filter((l) => l.trim());
  for (const line of lines) {
    const m = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s*(.*)$/);
    if (m) items.push({ title: m[1].replace(/\.$/, ""), body: m[2].trim() });
  }
  return (
    <div className="timeline-log" key="tl">
      {items.map((it, i) => (
        <article className="entry theme-card" key={i}>
          <span className="when">Step {i + 1}</span>
          <h3>{it.title}</h3>
          {it.body ? <p>{inline(it.body)}</p> : null}
        </article>
      ))}
    </div>
  );
}

function cleanSource(source: string): string {
  return applyPhone(source.replace(/\r\n/g, "\n"))
    .replace(/^\s*---\s*$/gm, "")
    .replace(/\*\(Developer note:[^*]*\)\*/gi, "")
    .replace(/^\s*\[\s*Call[^\]]*\]\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Group consecutive **[link](url)** + description lines into service cards */
function parseServiceItems(block: string): React.ReactNode | null {
  const lines = block.split("\n");
  const items: { title: string; href: string; desc: string }[] = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^\*\*\[([^\]]+)\]\(([^)]+)\)\*\*\s*$/);
    if (!m) return null;
    const descLines: string[] = [];
    i += 1;
    while (i < lines.length && !/^\*\*\[[^\]]+\]\([^)]+\)\*\*/.test(lines[i]) && lines[i].trim()) {
      descLines.push(lines[i].trim());
      i += 1;
    }
    while (i < lines.length && !lines[i].trim()) i += 1;
    items.push({ title: m[1], href: m[2], desc: descLines.join(" ") });
  }
  if (!items.length) return null;
  return (
    <div className="svc-grid">
      {items.map((it) => (
        <article className="theme-card svc-card" key={it.href}>
          <a href={it.href} className="svc-card-title">
            {it.title}
          </a>
          {it.desc ? <p className="svc-card-desc">{inline(it.desc)}</p> : null}
        </article>
      ))}
    </div>
  );
}

/** Render a markdown section body to React elements */
export function MarkdownBlock({ source }: { source: string }) {
  const text = cleanSource(source);
  if (!text) return null;

  if (/\*\*Timeline Strip\*\*/i.test(text)) {
    const after = text.replace(/\*\*Timeline Strip\*\*\s*/i, "");
    const before = text.split(/\*\*Timeline Strip\*\*/i)[0];
    return (
      <>
        {before.trim() ? <MarkdownBlock source={before} /> : null}
        {parseTimeline(after)}
      </>
    );
  }

  // Whole-block service directory (multiple **[link]** items)
  if (/^\*\*\[[^\]]+\]\([^)]+\)\*\*/m.test(text) && (text.match(/\*\*\[[^\]]+\]\([^)]+\)\*\*/g) || []).length >= 1) {
    const onlyServiceish = text
      .split(/\n\n+/)
      .every(
        (b) =>
          !b.trim() ||
          /^\*\*\[[^\]]+\]\([^)]+\)\*\*/.test(b.trim()) ||
          /^[-*] /.test(b.trim())
      );
    if (onlyServiceish && text.includes("**[")) {
      const joined = text
        .split(/\n\n+/)
        .filter((b) => /^\*\*\[[^\]]+\]\([^)]+\)\*\*/.test(b.trim()))
        .join("\n");
      const grid = parseServiceItems(joined);
      if (grid) {
        const lists = text
          .split(/\n\n+/)
          .filter((b) => /^[-*] /.test(b.trim()));
        return (
          <>
            {grid}
            {lists.map((b, i) => (
              <MarkdownBlock key={i} source={b} />
            ))}
          </>
        );
      }
    }
  }

  const blocks = text.split(/\n\n+/);
  const out: React.ReactNode[] = [];

  for (let bi = 0; bi < blocks.length; bi++) {
    const block = blocks[bi].trim();
    if (!block || block === "---") continue;

    if (block.includes("|") && block.split("\n").some((l) => l.includes("|"))) {
      const rows = block.split("\n").filter((l) => l.includes("|"));
      out.push(parseTable(rows));
      continue;
    }

    if (/^[-*] /.test(block)) {
      const items = block.split("\n").filter((l) => /^[-*] /.test(l));
      const linkList = items.every((l) => /^\s*[-*] \[[^\]]+\]\([^)]+\)\s*$/.test(l));
      if (linkList) {
        out.push(
          <div className="link-card-grid" key={bi}>
            {items.map((l, i) => {
              const m = l.match(/\[([^\]]+)\]\(([^)]+)\)/);
              if (!m) return null;
              return (
                <a className="theme-card link-card" href={m[2]} key={i}>
                  <span>{m[1]}</span>
                  <span className="link-card-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              );
            })}
          </div>
        );
      } else {
        out.push(
          <ul key={bi} className="md-list">
            {items.map((l, i) => (
              <li key={i}>{inline(l.replace(/^[-*] /, ""))}</li>
            ))}
          </ul>
        );
      }
      continue;
    }

    if (/^\d+\. /.test(block)) {
      const items = block.split("\n").filter((l) => /^\d+\. /.test(l));
      out.push(
        <ol key={bi} className="md-list">
          {items.map((l, i) => (
            <li key={i}>{inline(l.replace(/^\d+\.\s+/, ""))}</li>
          ))}
        </ol>
      );
      continue;
    }

    if (/^\*\*\[[^\]]+\]\([^)]+\)\*\*/.test(block)) {
      const grid = parseServiceItems(block);
      if (grid) {
        out.push(<React.Fragment key={bi}>{grid}</React.Fragment>);
        continue;
      }
    }

    if (/^\*\*[^*]+\*\*$/.test(block) && !block.includes("?") && !block.includes("[")) {
      out.push(
        <h3 key={bi} className="md-subhead">
          {block.slice(2, -2)}
        </h3>
      );
      continue;
    }

    // Bold subhead + following paragraph in same block
    const subheadPara = block.match(/^\*\*([^*]+)\*\*\s*\n([\s\S]+)$/);
    if (subheadPara && !subheadPara[1].includes("?") && !subheadPara[1].includes("[")) {
      out.push(
        <div key={bi} className="md-block">
          <h3 className="md-subhead">{subheadPara[1]}</h3>
          <p>{inline(subheadPara[2].replace(/\n/g, " "))}</p>
        </div>
      );
      continue;
    }

    const paras = block.split("\n").filter((l) => l.trim() && l.trim() !== "---");
    if (!paras.length) continue;
    out.push(
      <p key={bi}>
        {paras.map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 ? <br /> : null}
            {inline(line)}
          </React.Fragment>
        ))}
      </p>
    );
  }

  return <>{out}</>;
}
