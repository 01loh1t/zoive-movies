// Static lists used by filters and settings (no API call needed).

export const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
] as const;

/** Moods map to TMDB genre combos. "|" means "any of these". */
export const MOODS = [
  { id: "feel-good", label: "Feel-good", emoji: "😊", genres: "35|10751|16" },
  { id: "thrilling", label: "Thrilling", emoji: "⚡", genres: "53|28" },
  { id: "mind-bending", label: "Mind-bending", emoji: "🌀", genres: "878|9648" },
  { id: "romantic", label: "Romantic", emoji: "💘", genres: "10749" },
  { id: "scary", label: "Scary", emoji: "👻", genres: "27" },
  { id: "epic", label: "Epic", emoji: "🗺️", genres: "12|14|36" },
  { id: "tearjerker", label: "Tearjerker", emoji: "😢", genres: "18,10749" },
  { id: "laugh-out-loud", label: "Laugh out loud", emoji: "😂", genres: "35" },
] as const;

export const DECADES = [
  { id: "2020s", label: "2020s", from: 2020, to: 2029 },
  { id: "2010s", label: "2010s", from: 2010, to: 2019 },
  { id: "2000s", label: "2000s", from: 2000, to: 2009 },
  { id: "1990s", label: "1990s", from: 1990, to: 1999 },
  { id: "1980s", label: "1980s", from: 1980, to: 1989 },
  { id: "classic", label: "Before 1980", from: 1900, to: 1979 },
] as const;

export const RUNTIMES = [
  { id: "90", label: "Under 1.5 hours", max: 90 },
  { id: "120", label: "Under 2 hours", max: 120 },
  { id: "150", label: "Under 2.5 hours", max: 150 },
] as const;

export const SORTS = [
  { id: "popularity.desc", label: "Most popular" },
  { id: "vote_average.desc", label: "Highest rated" },
  { id: "primary_release_date.desc", label: "Newest" },
  { id: "revenue.desc", label: "Box office" },
] as const;

export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  { code: "IE", name: "Ireland" },
  { code: "NZ", name: "New Zealand" },
  { code: "ZA", name: "South Africa" },
  { code: "NG", name: "Nigeria" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "PH", name: "Philippines" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
] as const;

export const COUNTRY_COOKIE = "zoive-country";
export const DEFAULT_COUNTRY = "US";
