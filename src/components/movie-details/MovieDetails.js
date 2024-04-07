import { useEffect, useState } from "react";
import { KEY } from "../../App";
import Loader from "../error-loading/Loader";
import MovieDescription from "./MovieDescription";
import MovieStats from "./MovieStats";

export default function MovieDetails({
  watched,
  selectedId,
  onCloseMovie,
  onAddWatched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.some((item) => item.imdbID === selectedId);

  const watchedUserRating = watched.find(
    (item) => item.imdbID === selectedId
  )?.userRating;

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      runtime: Number(movie.Runtime.split(" ").at(0)),
      imdbRating: Number(movie.imdbRating),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  };

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <MovieStats onCloseMovie={onCloseMovie} movie={movie} />
          <MovieDescription
            watchedUserRating={watchedUserRating}
            isWatched={isWatched}
            handleAdd={handleAdd}
            movie={movie}
            userRating={userRating}
            onSetUserRating={setUserRating}
          />
        </>
      )}
    </div>
  );
}
