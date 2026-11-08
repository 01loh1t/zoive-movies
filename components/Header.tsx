import Link from "next/link";
import { DesktopNav } from "@/components/Nav";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserIcon } from "@/components/icons";
import type { SessionUser } from "@/components/UserProvider";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg text-xl font-extrabold tracking-tight">
      <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-accent text-base text-on-accent">
        Z
      </span>
      <span translate="no">
        Zoive<span className="text-accent-ink"> Movies</span>
      </span>
    </Link>
  );
}

export function Header({ user, authEnabled }: { user: SessionUser; authEnabled: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Logo />
        <div className="ml-4 hidden md:block">
          <DesktopNav />
        </div>
        <div className="ml-auto hidden w-full max-w-xs lg:block">
          <SearchBar />
        </div>
        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <ThemeToggle />
          {authEnabled &&
            (user ? (
              <Link
                href="/settings"
                aria-label="Your account and settings"
                title={user.email ?? "Account"}
                className="grid size-10 place-items-center rounded-full bg-surface-2 text-sm font-bold uppercase hover:bg-surface-3"
              >
                {user.email?.[0] ?? <UserIcon size={18} />}
              </Link>
            ) : (
              <Link
                href="/login"
                className="ml-1 inline-flex h-10 items-center rounded-full bg-text px-5 text-sm font-bold text-bg hover:opacity-90"
              >
                Sign in
              </Link>
            ))}
          {!authEnabled && (
            <Link
              href="/settings"
              aria-label="Settings"
              className="grid size-10 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-text"
            >
              <UserIcon />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
