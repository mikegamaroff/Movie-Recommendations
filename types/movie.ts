export interface Movie {
  id: string;
  title: string;
  selected: boolean;
}

export interface MovieWithPoster extends Movie {
  poster: string;
}
export type RecommendedMovie = {
  movie: MovieWithPoster;
  count: number;
};
