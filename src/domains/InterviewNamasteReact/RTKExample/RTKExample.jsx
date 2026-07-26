import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import "./RTKExample.css";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

// ---- Plain fetch helpers ----
// Just three thin wrappers around fetch - no axios/service-layer abstraction
// needed for a demo this small. React Query only cares that queryFn/mutationFn
// return a Promise; it doesn't care how you make the request.

const fetchPosts = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Failed to fetch posts (${res.status})`);
  return res.json();
};

const createPost = async (newPost) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  });
  if (!res.ok) throw new Error(`Failed to create post (${res.status})`);
  return res.json(); // JSONPlaceholder echoes the created object back with id: 101
};

const deletePost = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete post (${res.status})`);
  return id; // JSONPlaceholder returns {} on delete - we hand back the id ourselves
  // so the onSuccess handler below knows which cache entry to remove.
};

/**
 * QueryClient is created ONCE at module scope, outside the component.
 *
 * Why outside: the QueryClient owns the in-memory cache (a Map of
 * queryKey -> data/status). If it were created inside the component with
 * `new QueryClient()` on every render, every re-render would hand child
 * components a brand-new, empty cache - defeating the entire point of a
 * caching library and re-fetching from scratch constantly. Module scope (or
 * useState(() => new QueryClient()) if you need it per-mount) guarantees
 * exactly one instance for the app's lifetime.
 *
 * defaultOptions.queries apply to every useQuery call that doesn't override
 * them - this is where you encode your app's caching *policy* in one place
 * instead of repeating it at every call site.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 min "fresh" — during this window, remounting/refocusing
      // reuses cached data with NO network request. After it elapses, data is
      // "stale" and eligible for a background refetch on next trigger.
      gcTime: 5 * 60 * 1000, // (formerly cacheTime in v4) - how long UNUSED data stays in
      // memory after its last observer unmounts, before being garbage collected.
      // Lets you navigate away and back within 5 min and still see instant cached data.
      retry: 2, // a failed query is retried twice (3 attempts total) with
      // exponential backoff before landing in the `error` state - guards
      // against transient network blips without infinite-looping on a real 404/500.
      refetchOnWindowFocus: true, // refetch stale queries when the tab regains
      // focus - keeps data fresh if the user tabbed away and something changed elsewhere.
    },
  },
});

/**
 * Top-level export: wires up QueryClientProvider so every hook inside
 * <PostsBoard /> (and any future children) can reach the shared cache via
 * context. This provider only needs to wrap the part of the tree that uses
 * React Query - here that's this whole demo page.
 */
const RTKExample = () => (
  <QueryClientProvider client={queryClient}>
    <PostsBoard />
  </QueryClientProvider>
);

const PostsBoard = () => {
  // useQueryClient() gives mutation callbacks access to the same cache
  // instance the provider above is holding, without prop-drilling it down.
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // ---------------------------------------------------------------------
  // GET — useQuery
  // ---------------------------------------------------------------------
  // `queryKey: ["posts"]` is both the cache's lookup key AND its dependency
  // array. React Query hashes it to dedupe: any other component that calls
  // useQuery({ queryKey: ["posts"], ... }) anywhere in the tree shares this
  // exact cache entry and in-flight request instead of firing a second
  // network call. If the key included a variable (e.g. ["posts", userId]),
  // changing that variable would be treated as a *different* cache entry
  // and trigger its own fetch - that's how per-argument caching works.
  const {
    data: posts,
    isLoading, // true only on the very first fetch (no cached data yet)
    isFetching, // true on ANY fetch, including silent background refetches
    isError,
    error,
    refetch, // manual trigger — ignores staleTime and re-runs queryFn now
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    select: (data) => data.slice(0, 12), // API returns 100 posts; trim for a tidy demo grid
  });

  // ---------------------------------------------------------------------
  // POST — useMutation
  // ---------------------------------------------------------------------
  // Mutations are NOT cached/deduped like queries (no queryKey) — each
  // .mutate() call is a one-off side effect. onSuccess is where we tell the
  // *query* cache about the result.
  //
  // Note on invalidateQueries vs. this: the "textbook" move after a mutation
  // is `qc.invalidateQueries({ queryKey: ["posts"] })`, which marks the
  // ["posts"] cache stale and triggers a refetch - the server's response
  // becomes the new source of truth. That's what you'd want against a real
  // backend. JSONPlaceholder is a fake API though: it always echoes back a
  // fake `id: 101` but never actually persists the post server-side, so an
  // invalidate+refetch here would just silently make the new post vanish
  // again. To make the demo actually show a created post, we instead do a
  // manual cache write with setQueryData - prepending the server's response
  // straight into the existing ["posts"] cache entry, no extra round trip.
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (created) => {
      qc.setQueryData(["posts"], (old) => [created, ...(old ?? [])]);
    },
  });

  // ---------------------------------------------------------------------
  // DELETE — useMutation
  // ---------------------------------------------------------------------
  // Same shape as the create mutation: on success, surgically update the
  // cache rather than refetching. `mutation.variables` (used in the JSX
  // below) still holds the id that was passed to .mutate(), which is how we
  // show a per-card "Deleting…" state instead of one global spinner.
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: (deletedId) => {
      qc.setQueryData(["posts"], (old) =>
        (old ?? []).filter((post) => post.id !== deletedId)
      );
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate({ title, body, userId: 1 });
    setTitle("");
    setBody("");
  };

  if (isLoading) {
    return <p className="status-text">Loading posts…</p>;
  }

  if (isError) {
    return (
      <p className="status-text status-text--error">Error: {error.message}</p>
    );
  }

  return (
    <div className="rtk-page">
      <header className="rtk-header">
        <h2>React Query Demo — JSONPlaceholder Posts</h2>
        {/* Manual cache invalidation trigger: refetch() ignores staleTime
            and re-runs the queryFn right now, regardless of freshness. */}
        <button
          className="rtk-refetch-btn"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing…" : "Refetch"}
        </button>
      </header>

      <form className="rtk-form" onSubmit={handleCreate}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
        />
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Post body"
        />
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating…" : "Add Post"}
        </button>
      </form>
      {createMutation.isError && (
        <p className="status-text status-text--error">
          Create failed: {createMutation.error.message}
        </p>
      )}

      <div className="rtk-grid">
        {posts.map((post) => {
          const isDeletingThis =
            deleteMutation.isPending && deleteMutation.variables === post.id;
          return (
            <article key={post.id} className="rtk-card">
              <h3 className="rtk-card__title">{post.title}</h3>
              <p className="rtk-card__body">{post.body}</p>
              <button
                className="rtk-card__delete"
                onClick={() => deleteMutation.mutate(post.id)}
                disabled={isDeletingThis}
              >
                {isDeletingThis ? "Deleting…" : "Delete"}
              </button>
            </article>
          );
        })}
      </div>
      {deleteMutation.isError && (
        <p className="status-text status-text--error">
          Delete failed: {deleteMutation.error.message}
        </p>
      )}
    </div>
  );
};

export default RTKExample;
