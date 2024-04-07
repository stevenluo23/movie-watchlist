import { useEffect, useState } from "react";
import { WatchedMoviesList } from "./components/WatchedMoviesList";
import { WatchedSummary } from "./components/WatchedSummary";
import { MovieDetails } from "./components/MovieDetails";
import { MovieList } from "./components/MovieList";
import { Box } from "./components/Box";
import { Main } from "./components/Main";
import { Search } from "./components/Search";
import { NumResults } from "./components/NumResults";
import { NavBar } from "./components/NavBar";
import { ErrorMessage } from "./components/ErrorMessage";
import { Loader } from "./components/Loader";

export const KEY = "615779e3";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// Structural Component
// Error handling : check for offline connection, check for invalid query
export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
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

  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        // On query change, reset the error message
        setErrorMsg("");
        const res = await fetch(
          `https://www.omdbapi.com/?s=${query.trimEnd()}&apikey=${KEY}`
        );

        // Check if the res is fetched successfully
        if (!res.ok) {
          throw new Error(res.ErrorMessage);
        }

        const data = await res.json();
        // Check if the query was valid (data.Response === "False")
        if (data.Response === "False") {
          throw new Error(data.Error);
        }

        setMovies(data.Search);
        console.log(data.Search);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    // Prevent error msg when the query is less than 3 characters
    if (query.length < 3) {
      setErrorMsg("");
      // Essential to clear the movies array when the query is less than 3 characters
      setMovies([]);
    } else fetchMovies();
  }, [query]);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
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
