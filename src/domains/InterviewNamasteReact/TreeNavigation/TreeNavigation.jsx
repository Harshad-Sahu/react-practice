/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./TreeNavigation.css";

// Helper to collect a node and all of its descendants.
// We use this when a user checks a folder so the selection can be applied
// to the entire subtree without mutating the original prop data.
// The guard clauses below make this safe even if the incoming tree data is
// partially missing or malformed, which prevents runtime crashes.
const getAllNodeIds = (node) => {
  if (!node || typeof node !== "object") {
    return [];
  }

  const ids = node.id ? [node.id] : [];
  const children = Array.isArray(node.children) ? node.children : [];

  if (node.type === "folder") {
    children.forEach((child) => {
      ids.push(...getAllNodeIds(child));
    });
  }

  return ids;
};

function TreeNode({
  node,
  selectedIds,
  toggleCheckbox,
  toggleFolder,
  expandedIds,
}) {
  const isFolder = node?.type === "folder";
  const isExpanded = expandedIds?.has(node?.id) ?? false;
  const nodeChildren = Array.isArray(node?.children) ? node.children : [];
  const nodeName = node?.name ?? "Untitled";
  const nodeId = node?.id;

  // A folder is considered checked when every node in its subtree is selected.
  // This keeps parent/child state consistent without needing separate state.
  const isNodeChecked = () => {
    const idsToCheck = getAllNodeIds(node);

    return idsToCheck.every((id) => selectedIds.has(id));
  };

  return (
    <div
      className={`node ${node?.type ?? "file"}`}
      data-testid={`node-${nodeId}`}
    >
      <div className="node-content">
        {isFolder && (
          <button
            onClick={() => toggleFolder(nodeId)}
            data-testid={`toggle-${nodeId}`}
            aria-label={`Toggle ${nodeName}`}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        )}
        <input
          type="checkbox"
          checked={isNodeChecked()}
          onChange={() => toggleCheckbox(node, !isNodeChecked())}
          data-testid={`checkbox-${nodeId}`}
        />
        <span>{nodeName}</span>
      </div>
      {isFolder && isExpanded && (
        <div className="children">
          {nodeChildren.map((child) => (
            <TreeNode
              key={child?.id ?? `${nodeId}-${Math.random()}`}
              node={child}
              selectedIds={selectedIds}
              toggleCheckbox={toggleCheckbox}
              toggleFolder={toggleFolder}
              expandedIds={expandedIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TreeNavigation({ tree = [] }) {
  // We keep selection state in a Set so updates stay fast and predictable.
  // A Set is ideal here because we only care about membership checks.
  const [selectedIds, setSelectedIds] = useState(new Set());

  // We keep expansion state in a Set as well. This makes toggling folders simple
  // and avoids mutating the original tree data structure.
  const [expandedIds, setExpandedIds] = useState(() => {
    const initialExpandedIds = new Set();
    const safeTree = Array.isArray(tree) ? tree : [];

    safeTree.forEach((node) => {
      if (node?.type === "folder" && node.id) {
        initialExpandedIds.add(node.id);
      }
    });

    return initialExpandedIds;
  });

  // Toggle a folder's expanded/collapsed state.
  const toggleFolder = (id) => {
    setExpandedIds((previousExpandedIds) => {
      const nextExpandedIds = new Set(previousExpandedIds);

      if (nextExpandedIds.has(id)) {
        nextExpandedIds.delete(id);
      } else {
        nextExpandedIds.add(id);
      }

      return nextExpandedIds;
    });
  };

  // Toggle a node's selection and propagate that change to its subtree.
  // We do not mutate the incoming tree prop; instead we update component state.
  const toggleCheckbox = (node, checked) => {
    setSelectedIds((previousSelectedIds) => {
      const nextSelectedIds = new Set(previousSelectedIds);
      const nodeIdsToUpdate = getAllNodeIds(node);

      nodeIdsToUpdate.forEach((id) => {
        if (checked) {
          nextSelectedIds.add(id);
        } else {
          nextSelectedIds.delete(id);
        }
      });

      return nextSelectedIds;
    });
  };

  return (
    <div className="tree-container" data-testid="tree-container">
      <h1>Folder Navigation</h1>
      {(Array.isArray(tree) ? tree : []).map((node) => (
        <TreeNode
          key={node?.id ?? `node-${Math.random()}`}
          node={node}
          selectedIds={selectedIds}
          toggleCheckbox={toggleCheckbox}
          toggleFolder={toggleFolder}
          expandedIds={expandedIds}
        />
      ))}
    </div>
  );
}

export default TreeNavigation;
