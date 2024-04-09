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
  const [watched, setWatched] = useState(() =>
    JSON.parse(localStorage.getItem("watched"))
  );
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
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        // On query change, reset the error message
        setErrorMsg("");
        // Attach the controller to the fetch request
        const res = await fetch(
          `https://www.omdbapi.com/?s=${query.trimEnd()}&apikey=${KEY}`,
          { signal: controller.signal }
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
        setErrorMsg("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setErrorMsg(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    // Prevent error msg when the query is less than 3 characters
    if (query.length < 3) {
      setErrorMsg("");
      // Essential to clear the movies array when the query is less than 3 characters
      setMovies([]);
      return;
    }
    handleCloseMovie();
    fetchMovies();
    return () => {
      // Abort the fetch request when the query changes
      controller.abort();
    };
  }, [query]);

  // Update local storage with watched movies everytime a new watched movie is added
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

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
