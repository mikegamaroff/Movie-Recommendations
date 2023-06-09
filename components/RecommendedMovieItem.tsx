import Image from "next/image";
import LikeIcon from "../assets/likeIcon.svg";
import { MovieWithPoster } from "../types/movie";
import styles from "./RecommendedMovieItem.module.css";
interface RecommendedMovieProps {
  movie: MovieWithPoster;
  count: number;
  index: number;
}

export const RecommendedMovieItem: React.FC<RecommendedMovieProps> = ({
  movie,
  count,
  index,
}) => {
  return (
    <div
      className={styles.recommendedMovieContainer}
      style={{ animationDuration: `${index / 2}s` }}
    >
      <div className={styles.titleContainer}>
        <div className={styles.thumbnail}>
          <Image src={movie.poster} alt={movie.title} fill />
        </div>

        <div className={styles.title}>{movie.title}</div>
      </div>
      <div className={styles.countContainer}>
        <Image src={LikeIcon} alt='likes' height={20} width={20} />

        <div className={styles.count}>{count}</div>
      </div>
    </div>
  );
};
