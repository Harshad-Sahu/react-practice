import React from "react";
import "./ResizeableSplitPanel.css";

const ResizeableSplitPanel = () => {
  const [leftPanelWidth, setLeftPanelWidth] = React.useState(100);
  const containerRef = React.useRef(null);

  const startDrag = (event) => {
    event.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    const handlePointerMove = (moveEvent) => {
      const nextWidth = Math.max(
        100,
        Math.min(
          moveEvent.clientX - containerRect.left,
          containerRect.width - 100,
        ),
      );
      setLeftPanelWidth(nextWidth);
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <div>
      <h1>Resizeable Split Panel</h1>
      <div className="split-panel" ref={containerRef}>
        <div
          className="panel left"
          style={{
            flexBasis: leftPanelWidth,
            minWidth: 100,
            width: leftPanelWidth,
          }}
        >
          Left Panel
        </div>
        <div className="resizer" onPointerDown={startDrag} />
        <div className="panel right">Right Panel</div>
      </div>
    </div>
  );
};

export default ResizeableSplitPanel;
