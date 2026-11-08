import { Notice } from "@/components/Notice";

export default function NotFound() {
  return (
    <Notice title="We couldn't find that page" action={{ href: "/", label: "Back to movies" }}>
      The link may be broken, or the movie was removed from TMDB.
    </Notice>
  );
}
