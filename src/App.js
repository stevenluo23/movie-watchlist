import { useState } from "react";
import { useMovies } from "./components/hooks/useMovies";
import { useLocalStorageState } from "./components/hooks/useLocalStorageState";
import ErrorMessage from "./components/error-loading/ErrorMessage";
import Loader from "./components/error-loading/Loader";
import MovieList from "./components/movie-list/MovieList";
import MovieDetails from "./components/movie-details/MovieDetails";
import WatchedSummary from "./components/watched-movies/WatchedSummary";
import WatchedMoviesList from "./components/watched-movies/WatchedMoviesList";
import NavBar from "./components/nav-bar/NavBar";
import Search from "./components/nav-bar/Search";
import NumResults from "./components/nav-bar/NumResults";
import Main from "./components/structural/Main";
import Box from "./components/structural/Box";

export const KEY = "615779e3";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// Structural Component
// Error handling : check for offline connection, check for invalid query
export default function App() {
  const [query, setQuery] = useState("");
  // Initialize watched movies with local storage (empty array used to initalize watched on mount for an empty local storage)
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectMovie = (curId) => {
    setSelectedId((prevId) => (curId === prevId ? null : curId));
  };

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  const handleDeleteWatched = (id) => {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  };

  // Custom hook to fetch current movies being searched
  const { movies, isLoading, errorMsg } = useMovies(query);

  return (
    <>
      <NavBar>
        <Search
          query={query}
          setQuery={setQuery}
          setSelectedId={setSelectedId}
        />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/*First, check if an error was thrown*/}
          {errorMsg && <ErrorMessage message={errorMsg} />}
          {/*Second, check if it is loading*/}
          {isLoading && <Loader />}
          {/*Third, check if it is done loading and no error was thrown*/}
          {!isLoading && !errorMsg && (
            <MovieList
              movies={movies}
              onSelectMovie={handleSelectMovie}
              onCloseMovie={handleCloseMovie}
            />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              watched={watched}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
