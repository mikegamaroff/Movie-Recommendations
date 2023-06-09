import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import mikeImage from "../assets/mike.jpg";
import { MovieSelector } from "../components/MovieSelector";
import { RecommendedMovieItem } from "../components/RecommendedMovieItem";
import moviesData from "../movies.json";
import styles from "../styles/Home.module.css";
import { MovieWithPoster, RecommendedMovie } from "../types/movie";

type MoviesData = {
  movies: Record<string, string>;
  users: { movies: number[]; user_id: number }[];
};

const data = moviesData as MoviesData;

export default function Recommend() {
  // State hooks for storing the user's selected movies,
  // recommended movies, movies with posters and a key for rerendering the movie list
  const [SelectedMovies, setSelectedMovies] = useState<number[]>([]);
  const [containerKey, setContainerKey] = useState(0);
  const [recommendedMovies, setRecommendedMovies] = useState<
    RecommendedMovie[]
  >([]);
  const [moviesWithPosters, setMoviesWithPosters] = useState<MovieWithPoster[]>(
    []
  );

  // Truncate a string to title without date to get good match on TMDB
  const truncateString = (str: string) => {
    const regex = /^[A-Za-z\s]+/;
    const match = str.match(regex);
    return match ? match[0] : "";
  };

  // For the mailto
  const sendEmail = () => {
    window.location.href = "mailto:mike@gamaroff.net";
  };

  // Function to fetch a movie's poster, title, id, and selection state
  // It is wrapped in useCallback to prevent unnecessary rerenders
  const fetchMovieWithPoster = useCallback(
    async (movieName: string, movieId: string) => {
      const res = await fetch(
        `/api/movieposter?movieName=${encodeURIComponent(
          truncateString(movieName)
        )}`
      );
      const movieData = await res.json();
      return {
        id: movieId,
        title: movieName,
        poster: movieData.imageUrl,
        selected: false,
      };
    },
    []
  );

  // Fetch all movies with posters when the component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      const movieNames = Object.values(data.movies);
      const movieIds = Object.keys(data.movies);

      const moviesWithPosters = await Promise.all(
        movieNames.map((movie, i) => fetchMovieWithPoster(movie, movieIds[i]))
      );

      setMoviesWithPosters(moviesWithPosters);
    };

    fetchMovies();
  }, [fetchMovieWithPoster]);

  // Handle a movie click event
  // It adds the clicked movie to the user's selected movies, or removes it if it's already there
  const handleMovieClick = useCallback((id: string) => {
    const movieId = Number(id);
    setSelectedMovies((prevMovies) =>
      prevMovies.includes(movieId)
        ? prevMovies.filter((movie) => movie !== movieId)
        : [...prevMovies, movieId]
    );
  }, []);

  // Get movie recommendations based on the user's selected movies
  const getRecommendations = (
    SelectedMoviesArray: number[]
  ): { movieId: number; count: number }[] => {
    // Find users who liked at least one of the same movies
    let similarUsers = data.users.filter((user) =>
      SelectedMoviesArray.some((movieId) => user.movies.includes(movieId))
    );

    // Count the occurrences of each movie among the similar users
    let recommendations: { [id: number]: number } = {};
    similarUsers.forEach((user) => {
      user.movies.forEach((movie) => {
        if (!SelectedMoviesArray.includes(movie)) {
          if (recommendations[movie]) {
            recommendations[movie]++;
          } else {
            recommendations[movie] = 1;
          }
        }
      });
    });

    // Sort the movies by count and take the top 5
    let sortedRecommendations = Object.entries(recommendations)
      .sort((a, b) => b[1] - a[1])
      .map(([movieId, count]) => ({
        movieId: Number(movieId),
        count: Number(count),
      }))
      .slice(0, 5);

    return sortedRecommendations;
  };

  // Update recommendations when the user's selected movies change
  useEffect(() => {
    const SelectedMoviesArray = SelectedMovies.map(Number);
    const recommendations = getRecommendations(SelectedMoviesArray);

    // Immediately fetch movie details for the recommended movies
    const fetchRecommendedMovies = async () => {
      const movies = await Promise.all(
        recommendations.map(async ({ movieId, count }) => {
          const movieName = data.movies[movieId];
          const movie = await fetchMovieWithPoster(
            movieName,
            movieId.toString()
          );
          return { movie, count };
        })
      );
      setRecommendedMovies(movies);
      setContainerKey((prevKey) => prevKey + 1); // increment containerKey for animation re-render
    };

    fetchRecommendedMovies();
  }, [SelectedMovies, fetchMovieWithPoster]);

  return (
    <div className={styles.container}>
      <div className={styles.titleBar}>
        <div>Movie recommendation engine</div>
        <div className={styles.signature}>
          <div className={styles.mikeIcon}>
            <Image src={mikeImage} alt='Mike Gamaroff' height={20} width={20} />
          </div>
          <div>Mike Gamaroff - Front-end Engineer</div>
        </div>
        <div className='a' onClick={sendEmail}>
          mike@gamaroff.net
        </div>
      </div>
      <div className={styles.movieTitleContainer}>
        <h2>Choose a movie</h2>
      </div>
      <MovieSelector
        movies={moviesWithPosters}
        setMovies={setMoviesWithPosters}
        onMovieClick={handleMovieClick}
      />

      {recommendedMovies.length > 0 && (
        <>
          <div className={styles.movieTitleContainer}>
            <h2>Recommended Movies:</h2>
          </div>
          <div key={containerKey} className={styles.recommendedMoviesContainer}>
            {recommendedMovies.map((recommendedMovie, index) => (
              <RecommendedMovieItem
                key={recommendedMovie.movie.title + index}
                movie={recommendedMovie.movie}
                count={recommendedMovie.count}
                index={index}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
