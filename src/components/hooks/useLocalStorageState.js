import { useState, useEffect } from "react";
// The goal of this is to initialize state based on local storage.
// Includes handling for empty local storage.
export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(() => {
    const localStoredValue = localStorage.getItem(key);
    return localStoredValue
      ? JSON.parse(localStorage.getItem(key))
      : initialState;
  });

  // Update local storage with watched movies everytime a new watched movie is added
  useEffect(() => {
    // Key value pair
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
