import Link from "next/link";
import { ArrowLeftIcon, ChevronRightIcon } from "@/components/icons";

/** Previous / next page links that keep the current filters in the URL. */
export function Pagination({
  page,
  totalPages,
  basePath,
  params,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params: Record<string, string | string[] | undefined>;
}) {
  if (totalPages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => [v ?? []].flat().forEach((x) => x && sp.append(k, x)));
    if (p > 1) sp.set("page", String(p));
    const s = sp.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const btn =
    "inline-flex h-11 items-center gap-1.5 rounded-full bg-surface-2 px-5 text-sm font-bold hover:bg-surface-3";

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link href={href(page - 1)} className={btn} rel="prev">
          <ArrowLeftIcon size={16} /> Previous
        </Link>
      ) : (
        <span className={`${btn} pointer-events-none opacity-40`} aria-hidden="true">
          <ArrowLeftIcon size={16} /> Previous
        </span>
      )}
      <span className="px-2 text-sm text-muted tabular-nums">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={btn} rel="next">
          Next <ChevronRightIcon size={16} />
        </Link>
      ) : (
        <span className={`${btn} pointer-events-none opacity-40`} aria-hidden="true">
          Next <ChevronRightIcon size={16} />
        </span>
      )}
    </nav>
  );
}
