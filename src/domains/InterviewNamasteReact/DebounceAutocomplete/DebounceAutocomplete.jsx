import React, { useCallback, useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import "./DebounceAutocomplete.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const normalizeSuggestion = (user) => ({
  id: user.id,
  label: user.name,
  subtitle: user.email,
});

const DebounceAutocomplete = () => {
  // 1. Local state tracks the user's current input, the fetched suggestions,
  // the currently highlighted option, and the UI states for loading/error.
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. The debounced query delays network calls until the user stops typing,
  // which prevents a request on every keystroke and improves performance.
  const debouncedQuery = useDebounce(query, 350);

  // 3. Fetch suggestions from an API when the debounced value changes.
  // We keep this callback memoized so the effect can depend on a stable reference.
  const fetchSuggestions = useCallback(async (searchValue, signal) => {
    if (!searchValue.trim()) {
      setSuggestions([]);
      setError("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, { signal });
      if (!response.ok) {
        throw new Error("Failed to fetch suggestions.");
      }

      const users = await response.json();
      const filteredUsers = users
        .filter((user) => {
          const searchText = searchValue.toLowerCase();
          return (
            user.name.toLowerCase().includes(searchText) ||
            user.email.toLowerCase().includes(searchText)
          );
        })
        .slice(0, 6)
        .map(normalizeSuggestion);

      setSuggestions(filteredUsers);

      if (filteredUsers.length === 0) {
        setError("No matching users found.");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }

      setSuggestions([]);
      setError("Something went wrong while loading suggestions.");
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  // 4. This effect reacts to the debounced input value. It cancels any previous request
  // before starting a new one so stale results do not overwrite fresh data.
  useEffect(() => {
    const controller = new AbortController();
    const value = debouncedQuery.trim();

    if (!value) {
      setSuggestions([]);
      setError("");
      setIsLoading(false);
      return () => controller.abort();
    }

    fetchSuggestions(value, controller.signal);

    return () => controller.abort();
  }, [debouncedQuery, fetchSuggestions]);

  // 5. When a user selects a suggestion, we populate the input with the chosen value
  // and clear the dropdown so the UI feels instant and predictable.
  const selectSuggestion = (item) => {
    setQuery(item.label);
    setSuggestions([]);
    setActiveIndex(-1);
    setError("");
  };

  // 6. Keyboard support makes the autocomplete feel complete and accessible.
  // Arrow keys move the highlight, Enter confirms the selected suggestion,
  // and Escape closes the list.
  const onKeyDown = (event) => {
    if (!suggestions.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((currentIndex) =>
        currentIndex < suggestions.length - 1 ? currentIndex + 1 : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((currentIndex) =>
        currentIndex > 0 ? currentIndex - 1 : suggestions.length - 1,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0) {
        selectSuggestion(suggestions[activeIndex]);
      }
    } else if (event.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  // 7. Input changes update the query immediately, while the debounce hook ensures
  // the request waits until the user pauses typing.
  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setActiveIndex(-1);

    if (!event.target.value.trim()) {
      setSuggestions([]);
      setError("");
    }
  };

  // 8. The dropdown is only expanded when there is a real search value and some UI state
  // to show, such as loading data, matching results, or an error message.
  const isExpanded = Boolean(
    query.trim() && (isLoading || suggestions.length > 0 || error),
  );

  return (
    <div className="autocomplete-shell">
      <div
        className="autocomplete-card"
        role="combobox"
        aria-expanded={isExpanded}
        aria-controls="autocomplete-listbox"
        aria-haspopup="listbox">
        <div className="autocomplete-header">
          <p className="autocomplete-eyebrow">Debounced search</p>
          <h2>Find a user</h2>
          <p>Search names or emails using a performant delayed request.</p>
        </div>

        <div className="autocomplete-field">
          <input
            className="autocomplete-input"
            value={query}
            onKeyDown={onKeyDown}
            onChange={handleInputChange}
            aria-autocomplete="list"
            aria-controls="autocomplete-listbox"
            placeholder="Search users…"
          />
          <span className="autocomplete-icon" aria-hidden="true">
            ⌕
          </span>
        </div>

        {isExpanded && (
          <ul
            className="suggestions-list"
            id="autocomplete-listbox"
            role="listbox">
            {isLoading && (
              <li className="suggestion-state">Loading suggestions…</li>
            )}

            {!isLoading &&
              !error &&
              suggestions.length > 0 &&
              suggestions.map((item, index) => (
                <li
                  key={item.id}
                  className={`suggestion-item ${index === activeIndex ? "active" : ""}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={() => selectSuggestion(item)}>
                  <span className="suggestion-label">{item.label}</span>
                  <span className="suggestion-subtitle">{item.subtitle}</span>
                </li>
              ))}

            {!isLoading &&
              !error &&
              suggestions.length === 0 &&
              query.trim() && (
                <li className="suggestion-state">No matching users found.</li>
              )}

            {error && (
              <li className="suggestion-state suggestion-error">{error}</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DebounceAutocomplete;
