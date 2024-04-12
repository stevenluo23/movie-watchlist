import { useRef } from "react";
import { useKey } from "../hooks/useKey";
// Stateless component
export default function Search({ query, setQuery, setSelectedId }) {
  const inputEl = useRef(null);

  // A useKey for focusing the input element when the user presses the "Enter" key, which clears the query
  useKey("Enter", () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
    setSelectedId(null);
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      // Ref for focusing the input element
      ref={inputEl}
      // Focus on mount
      autofocus="true"
    />
  );
}
