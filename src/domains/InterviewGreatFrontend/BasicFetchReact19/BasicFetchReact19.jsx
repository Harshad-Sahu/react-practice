import React, { Suspense, use, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

// --- Critical detail interviewers probe for ---
// `use()` unwraps a Promise, but it must NOT be a *new* promise created
// during render — that would refire on every render and loop forever.
// The promise has to be created once and cached/memoized outside the
// render path (a module cache, a ref, or — in frameworks — a server/RSC
// boundary). Here we use a tiny in-memory cache keyed by URL.

const cache = new Map();

function fetchPosts(url) {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      }),
    );
  }
  return cache.get(url);
}

// This component calls use() directly. Because use() can "suspend"
// (throw the pending promise), this component must be rendered inside
// a <Suspense> boundary, and errors must be caught by an Error Boundary
// (use() rethrows rejected promises as errors — no try/catch needed here).
function PostsGrid({ promise }) {
  const posts = use(promise); // suspends until resolved, then returns data

  return (
    <div style={styles.grid}>
      {posts.map((post) => (
        <Card key={post.id} post={post} />
      ))}
    </div>
  );
}

function Card({ post }) {
  return (
    <div style={styles.card}>
      <div style={styles.id}>#{post.id}</div>
      <div style={styles.title}>{post.title}</div>
      <div style={styles.body}>{post.body}</div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div style={styles.grid}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={styles.skeleton} />
      ))}
    </div>
  );
}

// Minimal class-based Error Boundary — React 19 still has no hook
// equivalent for catching render errors, so this piece doesn't change.
class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ color: "#f14c4c", fontSize: 13 }}>
          Error: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function PostsGridReact19() {
  // Create the promise once per "fetch session" — re-created only when
  // the user explicitly asks to refetch, never on every render.
  const [promise] = useState(() => fetchPosts(API_URL));

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.h1}>// posts.grid.jsx</h1>
        <div style={styles.sub}>React 19 — use() hook + Suspense</div>
      </div>
      <ErrorBoundary>
        <Suspense fallback={<GridSkeleton />}>
          <PostsGrid promise={promise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

const styles = {
  page: {
    background: "#1e1e1e",
    color: "#d4d4d4",
    fontFamily: "Consolas, 'Fira Code', monospace",
    padding: 24,
    minHeight: "100vh",
  },
  header: { maxWidth: 1200, margin: "0 auto 20px" },
  h1: { fontSize: 18, fontWeight: 600, margin: "0 0 4px", color: "#4ec9b0" },
  sub: { color: "#8a8a8a", fontSize: 13 },
  grid: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 14,
  },
  card: {
    background: "#252526",
    border: "1px solid #3c3c3c",
    borderRadius: 6,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  id: { fontSize: 11, color: "#569cd6", letterSpacing: "0.05em" },
  title: {
    fontSize: 13,
    fontWeight: 600,
    textTransform: "capitalize",
    lineHeight: 1.4,
  },
  body: {
    fontSize: 12,
    color: "#8a8a8a",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  skeleton: {
    background: "#252526",
    border: "1px solid #3c3c3c",
    borderRadius: 6,
    height: 110,
  },
};
