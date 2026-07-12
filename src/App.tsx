import "./index.css";

import { Routes, Route, useLocation, Link } from "react-router-dom";
import Home from "./domains/home/Home";
import ImageCarousel from "./domains/ImageCarousel/ImageCarousel";
import NamasteDevRoute from "./domains/NamasteDev-React/NamasteDevRoute";
import {
  Routes_GFE,
  MainRoutes,
  Routes_NamasteReact,
} from "./constants/RouteConstants";

// Small back-link so each component page doesn't dead-end —
// shown on every route except "/".
function NavBack() {
  const location = useLocation();
  const pathname = location.pathname;

  const isMainRoute = MainRoutes.some((route) => route.path === pathname);
  const isGFERoute = Routes_GFE.some((route) => route.path === pathname);
  const isNamasteRoute = Routes_NamasteReact.some(
    (route) => route.path === pathname,
  );

  const backTo = isMainRoute
    ? "/"
    : isGFERoute
      ? (MainRoutes[0]?.path ?? "/")
      : isNamasteRoute
        ? (MainRoutes[1]?.path ?? "/")
        : "/";

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Link to={backTo}>← back</Link>
    </div>
  );
}

const App = () => {
  return (
    <>
      <NavBack />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image-carousel" element={<ImageCarousel />} />
        <Route path="/namaste-react-example" element={<NamasteDevRoute />} />
        {MainRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {Routes_GFE.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {Routes_NamasteReact.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {/* Fallback for unknown paths */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
