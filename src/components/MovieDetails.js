import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { KEY } from "../App";
import { Loader } from "./Loader";
import noImg from "../images/noImg.jpg";

export function MovieDetails({ selectedId, onCloseMovie, onAddWatched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

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
            handleAdd={handleAdd}
            movie={movie}
            onSetUserRating={setUserRating}
          />
        </>
      )}
    </div>
  );
}

function MovieStats({ onCloseMovie, movie }) {
  return (
    <header>
      <button className="btn-back" onClick={onCloseMovie}>
        &larr;
      </button>
      <img
        src={movie.Poster === "N/A" ? noImg : movie.Poster}
        alt={`Poster of ${movie.Title} movie`}
      ></img>
      <div className="details-overview">
        <h2>{movie.Title}</h2>
        <p>
          {movie.Released} &bull;{" "}
          {movie.Runtime === "N/A" ? "0 min" : movie.Runtime}
        </p>
        <p>{movie.Genre}</p>
        <p>
          <span>⭐</span>
          {movie.imdbRating} IMDb rating
        </p>
      </div>
    </header>
  );
}

function MovieDescription({ handleAdd, movie, onSetUserRating }) {
  return (
    <section>
      <StarRating maxRating={10} size={24} onSetRating={onSetUserRating} />
      <button className="btn-add" onClick={handleAdd}>
        + Add to list
      </button>
      <p>
        <em>{movie.Plot}</em>
      </p>
      <p>Starring {movie.Actors}</p>
      <p>Directed by {movie.Director}</p>
    </section>
  );
}
