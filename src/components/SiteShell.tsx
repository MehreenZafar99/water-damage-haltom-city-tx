import siteConfig from "../../site.config";
import { NAV } from "@/lib/site-data";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a className="logo" href="/" aria-label="Home">
      <span className="logo-mark" aria-hidden="true">
        <svg width="20" height="24" viewBox="0 0 22 26" fill="none">
          <path d="M11 1C11 1 2 11.5 2 17a9 9 0 0 0 18 0C20 11.5 11 1 11 1Z" fill="#0f2a44" />
          {!compact && (
            <path d="M7 17.5a4 4 0 0 0 4 4" stroke="#f7f4ee" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </span>
      <span>
        <strong>{siteConfig.shortName}</strong>
        <span>{compact ? "Water Damage" : siteConfig.tagline}</span>
      </span>
    </a>
  );
}

export default function SiteShell({
  children,
  currentPath = "/",
}: {
  children: React.ReactNode;
  currentPath?: string;
}) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <div className="mtop">
        <Logo compact />
        <a className="btn-phone btn-phone-sm" href={`tel:${siteConfig.phoneTel}`}>
          {siteConfig.phoneDisplay}
        </a>
      </div>
      <nav className="mnav" aria-label="Main mobile">
        {NAV.filter((n) => n.href !== "/").map((n) => (
          <a key={n.href} href={n.href}>
            {n.label.replace(" Help", "").replace("Service ", "")}
          </a>
        ))}
      </nav>

      <div className="shell">
        <aside className="rail" aria-label="Site navigation">
          <Logo />
          <nav aria-label="Main">
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} aria-current={currentPath === n.href ? "page" : undefined}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="rail-call">
            <small>
              <span className="dot" aria-hidden="true" /> Available now
            </small>
            <a className="btn-phone" href={`tel:${siteConfig.phoneTel}`}>
              Call {siteConfig.phoneDisplay}
            </a>
            <p>Open 24/7. A real person answers.</p>
          </div>
        </aside>

        <main id="main">{children}</main>
      </div>

      <div className="mobilebar">
        <a href={`tel:${siteConfig.phoneTel}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          Tap to Call {siteConfig.phoneDisplay}
        </a>
      </div>
    </>
  );
}
