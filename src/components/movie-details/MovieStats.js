import noImg from "../../images/noImg.jpg";

export default function MovieStats({ onCloseMovie, movie }) {
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
          {movie.Released} &bull; {movie.Runtime}
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
