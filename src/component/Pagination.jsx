/* eslint-disable react/prop-types */
import React, { useMemo } from "react";

/**
 * A reusable pagination component for any list-based UI.
 *
 * Props:
 * - currentPage: the active page number (1-based)
 * - totalPages: total number of pages available
 * - onPageChange: callback that receives the next page number
 * - siblingCount: how many page buttons to show before/after the current page
 *
 * This component is intentionally simple so it can be reused in multiple places,
 * including the Rick & Morty characters screen.
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) {
      return [];
    }

    const range = [];
    const startPage = Math.max(1, currentPage - siblingCount);
    const endPage = Math.min(totalPages, currentPage + siblingCount);

    for (let page = startPage; page <= endPage; page += 1) {
      range.push(page);
    }

    return range;
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination" aria-label="Pagination controls">
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
