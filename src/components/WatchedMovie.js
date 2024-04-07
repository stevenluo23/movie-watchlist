// Stateless component
import noImg from "../images/noImg.jpg";
export function WatchedMovie({ movie }) {
  console.log(movie);
  return (
    <li>
      <img
        src={movie.poster === "N/A" ? noImg : movie.poster}
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{!movie.runtime ? 0 : movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
