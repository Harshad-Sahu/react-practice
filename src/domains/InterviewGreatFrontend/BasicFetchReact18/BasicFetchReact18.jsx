import { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export default function PostsGridReact18() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    // AbortController so we cancel the fetch if the component unmounts
    // mid-flight (e.g. user navigates away) — avoids the classic
    // "Can't perform a React state update on an unmounted component" warning.
    const controller = new AbortController();

    async function fetchPosts() {
      setStatus("loading");
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPosts(data);
        setStatus("success");
      } catch (err) {
        if (err.name === "AbortError") return; // unmounted, ignore
        setError(err.message);
        setStatus("error");
      }
    }

    fetchPosts();

    return () => controller.abort();
  }, []); // empty dep array — run once on mount

  if (status === "loading") {
    return (
      <Shell subtitle="React 18 — useEffect + useState">
        <div style={styles.grid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={styles.skeleton} />
          ))}
        </div>
      </Shell>
    );
  }

  if (status === "error") {
    return (
      <Shell subtitle="React 18 — useEffect + useState">
        <div style={{ color: "#f14c4c", fontSize: 13 }}>Error: {error}</div>
      </Shell>
    );
  }

  return (
    <Shell subtitle={`React 18 — ${posts.length} posts loaded`}>
      <div style={styles.grid}>
        {posts.map((post) => (
          <Card key={post.id} post={post} />
        ))}
      </div>
    </Shell>
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

function Shell({ subtitle, children }) {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.h1}>// posts.grid.jsx</h1>
        <div style={styles.sub}>{subtitle}</div>
      </div>
      {children}
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
