import WatchedMovie from "./WatchedMovie";

// Stateless component
export default function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie, i) => (
        <WatchedMovie
          key={movie.imdbID || i}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
