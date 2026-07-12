import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Routes_GFE,
  MainRoutes,
  Routes_NamasteReact,
} from "../../constants/RouteConstants";
import "../../styles/home.css";

function InterviewQuestionsMainPage() {
  const location = useLocation();

  const routes = useMemo(() => {
    if (location.pathname === MainRoutes[0].path) {
      return Routes_GFE;
    } else if (location.pathname === MainRoutes[1].path) {
      return Routes_NamasteReact;
    }
    return Routes_GFE; // default
  }, [location.pathname]);

  return (
    <>
      <div style={styles.page}>
        <h1 style={styles.h1}>Practice React questions</h1>
        <p style={styles.sub}>Pick an implementation to open it.</p>
        <ul style={styles.list}>
          {routes.map((route) => (
            <li key={route.path} style={styles.listItem}>
              <Link to={route.path} style={styles.link}>
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const styles = {
  page: {
    background: "#1e1e1e",
    color: "#d4d4d4",
    fontFamily: "Consolas, 'Fira Code', monospace",
    minHeight: "100vh",
    padding: 32,
  },
  h1: { fontSize: 18, fontWeight: 600, margin: "0 0 4px", color: "#4ec9b0" },
  sub: { color: "#8a8a8a", fontSize: 13, margin: "0 0 20px" },
  list: { listStyle: "none", padding: 0, margin: 0, maxWidth: 420 },
  listItem: {
    borderBottom: "1px solid #3c3c3c",
  },
  link: {
    display: "block",
    padding: "12px 4px",
    color: "#569cd6",
    textDecoration: "none",
    fontSize: 14,
  },
  back: {
    display: "inline-block",
    margin: 16,
    color: "#8a8a8a",
    fontSize: 13,
    textDecoration: "none",
  },
};

export default InterviewQuestionsMainPage;
