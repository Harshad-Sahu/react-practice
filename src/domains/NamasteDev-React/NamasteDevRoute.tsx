import { useState } from "react";
import { ROUTES } from "../../constants/NamasteDev-React/RoutingConstants";
import { FaArrowLeft } from "react-icons/fa6";

const NamasteDevRoute = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (selectedIndex !== null) {
    const SelectedComponent = ROUTES[selectedIndex].component;
    return (
      <div>
        <button
          onClick={() => setSelectedIndex(null)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            marginBottom: "16px",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
          }}>
          <FaArrowLeft style={{ marginRight: "8px" }} />
          Back
        </button>
        <SelectedComponent />
      </div>
    );
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {ROUTES.map((route, idx) => (
        <li
          key={route.name}
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #eee",
            cursor: "pointer",
          }}
          onClick={() => setSelectedIndex(idx)}>
          {route.name}
        </li>
      ))}
    </ul>
  );
};

export default NamasteDevRoute;
