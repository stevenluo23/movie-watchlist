import { WatchedMovie } from "./WatchedMovie";

// Stateless component
export function WatchedMoviesList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie, i) => (
        <WatchedMovie key={movie.imdbID || i} movie={movie} />
      ))}
    </ul>
  );
}
