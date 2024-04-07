import { Movie } from "./Movie";

// Stateful component
export function MovieList({ movies, onSelectMovie, onCloseMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          onSelectMovie={onSelectMovie}
          onCloseMovie={onCloseMovie}
        />
      ))}
    </ul>
  );
}
