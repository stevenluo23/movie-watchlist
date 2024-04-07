import { useEffect, useState } from "react";
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
          console.log(res);
          throw new Error(res.ErrorMessage);
        }

        const data = await res.json();
        // Check if the query was valid (data.Response === "False")
        if (data.Response === "False") {
          console.log(data);
          throw new Error(data.Error);
        }

        setMovies(data.Search);
      } catch (err) {
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
    } else if (query) fetchMovies();
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
