"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MonitorIcon, MoonIcon, SunIcon } from "@/components/icons";
import { applyTheme, useTheme, type Theme } from "@/components/ThemeToggle";
import { useToast } from "@/components/Toast";
import { useUser } from "@/components/UserProvider";
import { COUNTRIES, COUNTRY_COOKIE } from "@/lib/catalog";
import { clearRecent } from "@/lib/recent";
import { DeleteAccount } from "./DeleteAccount";
import { InstallSection } from "./InstallSection";

const card = "mt-6 rounded-xl bg-surface p-6 shadow-card";

export function SettingsForm({
  country,
  email,
  authEnabled,
}: {
  country: string;
  email: string | null;
  authEnabled: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const { user } = useUser();
  const theme = useTheme();

  const themes: { id: Theme; label: string; Icon: typeof SunIcon }[] = [
    { id: "system", label: "Match my device", Icon: MonitorIcon },
    { id: "dark", label: "Dark", Icon: MoonIcon },
    { id: "light", label: "Light", Icon: SunIcon },
  ];

  return (
    <>
      <section aria-labelledby="s-theme" className={card}>
        <h2 id="s-theme" className="text-lg font-bold">
          Appearance
        </h2>
        <fieldset className="mt-3">
          <legend className="sr-only">Theme</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {themes.map(({ id, label, Icon }) => (
              <label key={id}>
                <input
                  type="radio"
                  name="theme"
                  value={id}
                  checked={theme === id}
                  onChange={() => applyTheme(id)}
                  className="peer sr-only"
                />
                <span className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-surface-2 text-sm font-bold hover:bg-surface-3 peer-checked:bg-text peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-ink">
                  <Icon size={18} /> {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <InstallSection className={card} />

      <section aria-labelledby="s-country" className={card}>
        <h2 id="s-country" className="text-lg font-bold">
          Streaming country
        </h2>
        <p className="mt-1 text-sm text-muted">Used for &ldquo;Where to watch&rdquo; on movie pages.</p>
        <label htmlFor="country" className="sr-only">
          Country
        </label>
        <select
          id="country"
          defaultValue={country}
          onChange={(e) => {
            document.cookie = `${COUNTRY_COOKIE}=${e.target.value}; path=/; max-age=31536000; samesite=lax`;
            toast("Streaming country saved");
            router.refresh();
          }}
          className="mt-3 h-12 w-full rounded-full bg-surface-2 px-5 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--border)]"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </section>

      <section aria-labelledby="s-history" className={card}>
        <h2 id="s-history" className="text-lg font-bold">
          Search history
        </h2>
        <p className="mt-1 text-sm text-muted">
          Zoive keeps your last 10 searches {user ? "in your account" : "in this browser"}.
        </p>
        <button
          type="button"
          onClick={async () => {
            if (!window.confirm("Clear all your recent searches?")) return;
            await clearRecent(user?.id ?? null);
            toast("Recent searches cleared");
          }}
          className="mt-3 h-11 rounded-full bg-surface-2 px-5 text-sm font-bold hover:bg-surface-3"
        >
          Clear recent searches
        </button>
      </section>

      {authEnabled && (
        <section aria-labelledby="s-account" className={card}>
          <h2 id="s-account" className="text-lg font-bold">
            Account
          </h2>
          {email ? (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm">
                Signed in as <span className="font-bold">{email}</span>
              </p>
              <form action="/auth/signout" method="post">
                <button type="submit" className="h-11 rounded-full bg-surface-2 px-5 text-sm font-bold hover:bg-surface-3">
                  Sign out
                </button>
              </form>
              <div className="w-full">
                <DeleteAccount />
              </div>
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">Sign in to sync your watchlist and ratings across devices.</p>
              <Link
                href="/login?next=/settings"
                className="inline-flex h-11 items-center rounded-full bg-text px-5 text-sm font-bold text-bg hover:opacity-90"
              >
                Sign in
              </Link>
            </div>
          )}
        </section>
      )}
    </>
  );
}
