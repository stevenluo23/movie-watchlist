import { useEffect, useState } from "react";
import { KEY } from "../../App";

export function useMovies(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
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
    // handleCloseMovie();
    fetchMovies();
    return () => {
      // Abort the fetch request when the query changes
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, errorMsg };
}
