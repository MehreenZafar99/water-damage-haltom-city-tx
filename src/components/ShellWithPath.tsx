"use client";

import { usePathname } from "next/navigation";
import SiteShell from "./SiteShell";

export default function ShellWithPath({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const current =
    pathname === "/" ? "/" : pathname.endsWith("/") ? pathname : `${pathname}/`;
  return <SiteShell currentPath={current}>{children}</SiteShell>;
}
