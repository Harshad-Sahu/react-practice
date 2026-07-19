import React, { useState, useEffect, useRef } from "react";
import CharacterCard from "./CharacterCard";
import "./InfiniteScroll.css";

const API_URL = "https://rickandmortyapi.com/api/character";

/**
 * Infinite scroll list of Rick & Morty characters.
 *
 * Design:
 * 1. `page` is the single source of truth for "what to fetch next".
 *    Bumping it is the only thing the observer callback is allowed to do -
 *    the actual fetching lives in one useEffect keyed on [page].
 * 2. Every fetch uses AbortController so that if `page` changes again (or the
 *    component unmounts) before the previous request resolves, the stale
 *    request is cancelled instead of racing to setState after the fact.
 * 3. A dedicated sentinel div sits at the bottom of the list and is watched by
 *    a single IntersectionObserver created once on mount. The sentinel is
 *    ALWAYS rendered - during loading, and even once hasMore is false - so
 *    the observer never needs to be disconnected/recreated as pages load.
 *    All the "should we actually fetch?" logic lives inside the observer
 *    callback, reading `loading`/`hasMore` off refs so the effect that
 *    creates the observer can stay mount-only ([] deps) without going stale.
 */
const InfiniteScroll = () => {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}?page=${page}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          // API responds 404 once `page` exceeds the total number of pages.
          if (res.status === 404) {
            setHasMore(false);
            return;
          }
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        setCharacters((prev) => [...prev, ...data.results]);
        setHasMore(Boolean(data.info?.next));
      } catch (err) {
        // Swallow AbortError - it's an intentional cancellation, not a real failure.
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();

    return () => controller.abort();
  }, [page]);

  // Sentinel = an invisible, zero-height div pinned to the bottom of the list.
  const sentinelRef = useRef(null);

  // Mirror the latest loading/hasMore into refs so the observer callback
  // (created once, below) always reads fresh values without needing to be
  // recreated - the classic fix for stale closures inside a mount-only effect.
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        if (isVisible && hasMoreRef.current && !loadingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" }  // pre-fetch 200px before the sentinel is actually on screen -> no jitter
    );

    const node = sentinelRef.current;
    if (node) observer.observe(node);

    // Single observer for the component's whole lifetime - just disconnect on unmount.
    return () => observer.disconnect();
  }, []);

  return (
    <div className="infinite-scroll-page">
      <h2>Rick and Morty Characters</h2>

      <div className="character-list">
        {characters.map((char) => (
          <CharacterCard key={char.id} character={char} />
        ))}
      </div>

      {/* Always mounted so the observer always has a target to watch. */}
      <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />

      {loading && <p className="status-text">Loading more characters…</p>}
      {error && <p className="status-text status-text--error">Error: {error}</p>}
      {!hasMore && !loading && (
        <p className="status-text">No more characters to load.</p>
      )}
    </div>
  );
};

export default InfiniteScroll;
