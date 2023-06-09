import classNames from "classnames";
import Image from "next/image";
import checkIcon from "../assets/checkIcon.svg";
import { MovieWithPoster } from "../types/movie";
import styles from "./MovieSelector.module.css";

interface MovieSelectorProps {
  movies: MovieWithPoster[];
  setMovies: React.Dispatch<React.SetStateAction<MovieWithPoster[]>>;
  onMovieClick: (id: string) => void;
}

export const MovieSelector: React.FC<MovieSelectorProps> = ({
  movies,
  setMovies,
  onMovieClick,
}) => {
  const handleClick = (id: string) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, selected: !movie.selected } : movie
      )
    );
    onMovieClick(id);
  };

  return (
    <div className={styles.movieGrid}>
      {movies.length > 0 ? (
        <>
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={classNames(
                styles.movieposter,
                movie.selected ? styles.movieposterSelected : ""
              )}
              onClick={() => handleClick(movie.id)}
            >
              {movie.selected && (
                <div className={styles.selector}>
                  <Image src={checkIcon} alt='likes' height={20} width={20} />
                </div>
              )}
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                loading='eager'
              />
              <p>{movie.title}</p>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.loaderContainer}>
          <div className='loading-wheel' />
          <div>Loading movies...</div>
        </div>
      )}
    </div>
  );
};
