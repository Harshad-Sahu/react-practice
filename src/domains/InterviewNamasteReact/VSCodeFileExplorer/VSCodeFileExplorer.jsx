/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { FaFile, FaFolder } from "react-icons/fa6";

const fileExplorerData = {
  name: "root",
  type: "folder",
  children: [
    {
      name: "src",
      type: "folder",
      children: [
        { name: "App.js", type: "file" },
        { name: "index.js", type: "file" },
        {
          name: "components",
          type: "folder",
          children: [
            { name: "App.js", type: "file" },
            { name: "Header.js", type: "file" },
            { name: "Menu.js", type: "file" },
            { name: "Footer.js", type: "file" },
            { name: "Home.js", type: "file" },
          ],
        },
      ],
    },
    { name: "package.json", type: "file" },
  ],
};

export function File({ name }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "4px 0 4px 20px",
      }}>
      <FaFile size={14} />
      <span>{name}</span>
    </div>
  );
}

export function Folder({ children, name, isExpanded, handleFolderToggle }) {
  return (
    <div>
      <button
        type="button"
        onClick={handleFolderToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "inherit",
        }}
        aria-expanded={isExpanded}>
        <FaFolder size={14} />
        <span>{name}</span>
        <span>{isExpanded ? "▾" : "▸"}</span>
      </button>
      {isExpanded && <div style={{ marginLeft: "16px" }}>{children}</div>}
    </div>
  );
}

const VSCodeFileExplorer = ({ nodes = fileExplorerData }) => {
  const [isOpen, setIsOpen] = useState({});

  // Handle expand/collapse state for each folder using a stable object map.
  const handleFolderToggle = (node) => {
    const { name } = node || {};

    if (!name) {
      return;
    }

    setIsOpen((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Normalize the incoming payload so the component can render either:
  // 1) a single root node object, or 2) an array of nodes.
  const nodeList = Array.isArray(nodes) ? nodes : nodes ? [nodes] : [];

  return (
    <div>
      {nodeList.map((node, index) => {
        const { name, type, children } = node || {};

        if (!name) {
          return null;
        }

        // Render files as leaf nodes.
        if (type === "file") {
          return <File key={`${name}-${type}-${index}`} name={name} />;
        }

        // Render folders recursively and pass their nested children.
        if (type === "folder") {
          const isExpanded = Boolean(isOpen[name]);

          return (
            <Folder
              key={`${name}-${type}-${index}`}
              name={name}
              isExpanded={isExpanded}
              handleFolderToggle={() => handleFolderToggle(node)}>
              <VSCodeFileExplorer nodes={children} />
            </Folder>
          );
        }

        return null;
      })}
    </div>
  );
};

export default VSCodeFileExplorer;

/**
 * Open by default the root folder and its first child folder, if any.
 * 
 * 
const VSCodeFileExplorer = ({ nodes = fileExplorerData }) => {
  const [isOpen, setIsOpen] = useState(() => {
    const initialState = {};

    // Expand every folder by default so the tree is fully visible on first render.
    const collectFolderNames = (currentNodes) => {
      if (!currentNodes) {
        return;
      }

      const nodeList = Array.isArray(currentNodes)
        ? currentNodes
        : [currentNodes];

      nodeList.forEach((node) => {
        if (!node || !node.name) {
          return;
        }

        if (node.type === "folder") {
          initialState[node.name] = true;
          collectFolderNames(node.children);
        }
      });
    };

    collectFolderNames(nodes);

    return initialState;
  });

  // Handle expand/collapse state for each folder using a stable object map.
  const handleFolderToggle = (node) => {
    const { name } = node || {};

    if (!name) {
      return;
    }

    setIsOpen((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Normalize the incoming payload so the component can render either:
  // 1) a single root node object, or 2) an array of nodes.
  const nodeList = Array.isArray(nodes) ? nodes : nodes ? [nodes] : [];

  return (
    <div>
      {nodeList.map((node, index) => {
        const { name, type, children } = node || {};

        if (!name) {
          return null;
        }

        // Render files as leaf nodes.
        if (type === "file") {
          return <File key={`${name}-${type}-${index}`} name={name} />;
        }

        // Render folders recursively and pass their nested children.
        if (type === "folder") {
          const isExpanded = Boolean(isOpen[name]);

          return (
            <Folder
              key={`${name}-${type}-${index}`}
              name={name}
              isExpanded={isExpanded}
              handleFolderToggle={() => handleFolderToggle(node)}>
              <VSCodeFileExplorer nodes={children} />
            </Folder>
          );
        }

        return null;
      })}
    </div>
  );
};

export default VSCodeFileExplorer;

 */
