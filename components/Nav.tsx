"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookmarkIcon, CompassIcon, HomeIcon, SearchIcon, StarIcon } from "@/components/icons";

const LINKS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/discover", label: "Discover", Icon: CompassIcon },
  { href: "/search", label: "Search", Icon: SearchIcon, mobileOnly: true },
  { href: "/watchlist", label: "Watchlist", Icon: BookmarkIcon },
  { href: "/ratings", label: "My ratings", short: "Ratings", Icon: StarIcon },
];

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

/** Desktop links in the header. */
export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {LINKS.filter((l) => !l.mobileOnly).map(({ href, label }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-colors hover:text-text ${
                  active ? "bg-surface-2 font-bold text-text" : "text-muted"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Bottom tab bar on phones. */
export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {LINKS.map(({ href, label, short, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] ${
                  active ? "font-bold text-text" : "text-muted"
                }`}
              >
                <Icon size={22} className={active ? "text-accent-ink" : undefined} />
                {short ?? label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
