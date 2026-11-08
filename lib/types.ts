// Shapes of the rows saved in Supabase (see supabase/schema.sql).

export type MovieSnapshot = {
  movie_id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
};

export type WatchItem = MovieSnapshot & {
  vote_average: number | null;
  watched: boolean;
  added_at: string;
};

export type RatingItem = MovieSnapshot & {
  stars: number;
  rated_at: string;
};
