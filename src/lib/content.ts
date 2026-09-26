import fs from "fs";
import path from "path";
import matter from "gray-matter";
export { NAV, NEIGHBORHOOD_PROBLEMS } from "./site-data";
export { applyPhone } from "./phone";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type PageType =
  | "home"
  | "about"
  | "contact"
  | "services-hub"
  | "service-areas-hub"
  | "faq"
  | "insurance"
  | "privacy"
  | "terms"
  | "service"
  | "neighborhood";

export type ContentPage = {
  file: string;
  title: string;
  metaDescription: string;
  slug: string;
  body: string;
  type: PageType;
};

function classify(slug: string): PageType {
  if (slug === "/") return "home";
  if (slug === "/about-us/") return "about";
  if (slug === "/contact-us/") return "contact";
  if (slug === "/services/") return "services-hub";
  if (slug === "/service-areas/") return "service-areas-hub";
  if (slug === "/faq/") return "faq";
  if (slug === "/insurance-claims-help/") return "insurance";
  if (slug === "/privacy-policy/") return "privacy";
  if (slug === "/terms-of-service/") return "terms";
  if (slug.startsWith("/services/")) return "service";
  if (slug.startsWith("/service-areas/")) return "neighborhood";
  return "about";
}

function normalizeSlug(slug: string): string {
  if (!slug || slug === "/") return "/";
  const withSlash = slug.startsWith("/") ? slug : `/${slug}`;
  return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
}

export function getAllPages(): ContentPage[] {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md") && /^\d{2}-/.test(f))
    .sort();

  return files.map((file) => {
    let raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    // Quote frontmatter values that contain colons so gray-matter/YAML does not break
    raw = raw.replace(
      /^(---\r?\n)([\s\S]*?)(\r?\n---)/,
      (_m, open: string, fm: string, close: string) => {
        const fixed = fm
          .split(/\r?\n/)
          .map((line) => {
            const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
            if (!kv) return line;
            const [, key, val] = kv;
            if (!val || (val.startsWith('"') && val.endsWith('"'))) return line;
            if (val.includes(":")) {
              return `${key}: "${val.replace(/"/g, '\\"')}"`;
            }
            return line;
          })
          .join("\n");
        return open + fixed + close;
      }
    );
    const { data, content } = matter(raw);
    const slug = normalizeSlug(String(data.slug || "/"));
    return {
      file,
      title: String(data.title || ""),
      metaDescription: String(data.meta_description || ""),
      slug,
      body: content.trim(),
      type: classify(slug),
    };
  });
}

export function getPageBySlug(slug: string): ContentPage | undefined {
  const normalized = normalizeSlug(slug);
  return getAllPages().find((p) => p.slug === normalized);
}

export function getServicePages(): ContentPage[] {
  return getAllPages().filter((p) => p.type === "service");
}

export function getNeighborhoodPages(): ContentPage[] {
  return getAllPages().filter((p) => p.type === "neighborhood");
}
