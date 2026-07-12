import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Pagination from "../../../component/Pagination";
import useDebounce from "../../../hooks/useDebounce";
import "./RickAndMorty.css";
import {
  RICK_AND_MORTY_API_URL,
  RICK_AND_MORTY_SORT_OPTIONS,
  RICK_AND_MORTY_STATUS_OPTIONS,
} from "../../../constants/InterviewNamasteReactConstants/constant";

function RickAndMortyCharacters() {
  const [requestStatus, setRequestStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [error, setError] = useState("");
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    // AbortController allows us to cancel the fetch if the component unmounts
    // before the request finishes, which keeps the UI safe and avoids warnings.
    const controller = new AbortController();

    async function fetchCharacters() {
      setRequestStatus("loading");
      setError("");

      try {
        const params = new URLSearchParams({ page: String(page) });

        if (debouncedSearchTerm.trim()) {
          params.set("name", debouncedSearchTerm.trim());
        }

        if (statusFilter !== "All") {
          params.set("status", statusFilter);
        }

        const res = await fetch(
          `${RICK_AND_MORTY_API_URL}?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setCharacters(Array.isArray(data.results) ? data.results : []);
        setTotalPages(Number(data.info?.pages) || 1);
        setRequestStatus("success");
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        setError(
          err.message || "Something went wrong while loading characters.",
        );
        setRequestStatus("error");
      }
    }

    fetchCharacters();
    return () => controller.abort();
  }, [page, debouncedSearchTerm, statusFilter]);

  const displayedCharacters = useMemo(() => {
    const nextCharacters = [...characters];

    if (sortOrder === "asc") {
      nextCharacters.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortOrder === "desc") {
      nextCharacters.sort((a, b) => b.name.localeCompare(a.name));
    }

    return nextCharacters;
  }, [characters, sortOrder]);

  return (
    <>
      <div className="rick-and-morty-container">
        <h1>Rick And Morty Characters</h1>
        <div className="container">
          <div className="controls">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Search by name..."
              data-testid="search-input"
            />
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              data-testid="status-filter"
            >
              {RICK_AND_MORTY_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              data-testid="sort-order"
            >
              {RICK_AND_MORTY_SORT_OPTIONS.map((sort) => (
                <option key={sort.id} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
          </div>

          <div className="character-grid">
            {requestStatus === "loading" && (
              <div data-testid="loading" className="loading-container">
                <AiOutlineLoading3Quarters className="loading-icon" />
                <p>Loading...</p>
              </div>
            )}

            {requestStatus === "error" && (
              <div data-testid="error-message">
                <p>{error}</p>
              </div>
            )}

            {requestStatus === "success" &&
              displayedCharacters.length === 0 && <p>No Characters found</p>}

            {requestStatus === "success" &&
              displayedCharacters.map((character) => (
                <div
                  key={character.id}
                  className="card"
                  data-testid={`character-${character.id}`}
                >
                  <img src={character.image} alt={character.name} />
                  <h3 className="char-name">{character.name}</h3>
                  <p className="char-status">
                    <span style={{ fontWeight: 600 }}>Status:</span>{" "}
                    {character.status}
                  </p>
                  <p className="char-species">
                    <span style={{ fontWeight: 600 }}>Species:</span>{" "}
                    {character.species}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        siblingCount={1}
      />
    </>
  );
}

export default RickAndMortyCharacters;
