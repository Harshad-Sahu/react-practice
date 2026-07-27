/* eslint-disable react/prop-types */
import React, { useCallback, useMemo, useState } from "react";
import "./TableWithForm.css";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

const EMPTY_FORM_VALUES = {
  id: "",
  name: "",
  age: "",
  dob: "",
  city: "",
  role: "frontend",
};

const ROLE_OPTIONS = [
  { value: "frontend", label: "Frontend Engineer" },
  { value: "backend", label: "Backend Engineer" },
  { value: "fullstack", label: "Full-Stack Engineer" },
];

const getRoleLabel = (role) =>
  ROLE_OPTIONS.find((option) => option.value === role)?.label ??
  role ??
  "Not specified";

// Column config lives at module scope (not inside the component) since it
// never depends on props/state - no reason to recreate it, or re-derive it
// with useMemo, on every render. `type` drives sort comparisons below and
// `filterType`/`filterOptions` drive which filter control renders per column.
const COLUMNS = [
  { key: "id", label: "Employee ID", type: "text" },
  { key: "name", label: "Name", type: "text" },
  { key: "age", label: "Age", type: "number" },
  { key: "city", label: "City", type: "text" },
  { key: "dob", label: "DOB", type: "date" },
  {
    key: "role",
    label: "Role",
    type: "text",
    filterType: "select",
    filterOptions: ROLE_OPTIONS,
  },
];

// Role is derived purely from `role` - never store a precomputed `roleLabel`
// on the record itself, since a duplicated derived field can drift out of
// sync with its source. Compute it on render instead.
const getDisplayValue = (row, column) =>
  column.key === "role" ? getRoleLabel(row.role) : row[column.key];

// Comparator dispatches on the column's declared `type` rather than a
// hardcoded key name, so adding a new numeric/date column automatically
// sorts correctly without touching this function.
const compareValues = (a, b, column) => {
  const aValue = a[column.key];
  const bValue = b[column.key];

  if (column.type === "number") return Number(aValue) - Number(bValue);
  if (column.type === "date") return new Date(aValue) - new Date(bValue);

  return String(aValue ?? "").localeCompare(String(bValue ?? ""), undefined, {
    sensitivity: "base",
  });
};

// A row passes the filter set only if EVERY active column filter matches.
// Select-type filters (role) compare the raw value exactly; text filters do
// a case-insensitive substring match against the same value the user sees.
const matchesFilters = (row, filters) =>
  COLUMNS.every((column) => {
    const filterValue = filters[column.key];
    if (!filterValue) return true;

    if (column.filterType === "select") {
      return row[column.key] === filterValue;
    }

    const displayValue = String(getDisplayValue(row, column) ?? "").toLowerCase();
    return displayValue.includes(filterValue.trim().toLowerCase());
  });

const createUniqueKey = (id) =>
  typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : `${id}-${Date.now()}`;

const Form = ({ formValues, setFormValues, tableData, setTableData }) => {
  const [formError, setFormError] = useState("");

  const resetForm = useCallback(() => {
    setFormValues(EMPTY_FORM_VALUES);
  }, [setFormValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const id = formValues.id.trim();
    const isDuplicate = tableData.some((row) => row.id === id);
    if (isDuplicate) {
      setFormError(`Employee ID "${id}" already exists.`);
      return;
    }

    const newRecord = {
      ...formValues,
      id,
      role: formValues.role || "frontend",
      uniqueKey: createUniqueKey(id),
    };

    setTableData((prev) => [...prev, newRecord]);
    setFormError("");
    resetForm();
  };

  return (
    <div className="form-wrapper">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="id">Employee ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formValues.id}
            onChange={handleInputChange}
            placeholder="Please enter employee id"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            placeholder="Please enter employee name"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formValues.age}
            onChange={handleInputChange}
            placeholder="Please enter employee age"
            min="18"
            max="70"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formValues.dob}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formValues.city}
            onChange={handleInputChange}
            placeholder="Please enter employee City"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formValues.role}
            onChange={handleInputChange}
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>

      {formError && <p className="form-error">{formError}</p>}
    </div>
  );
};

const Table = ({ tableData }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "default",
  });
  const [filters, setFilters] = useState({});

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };

      const nextDirection = {
        default: "asc",
        asc: "desc",
        desc: "default",
      }[prev.direction];

      return {
        key: nextDirection === "default" ? null : key,
        direction: nextDirection,
      };
    });
  };

  const getSortIcon = (colKey) => {
    if (sortConfig.key !== colKey) return null;
    return sortConfig.direction === "asc" ? <FaArrowUp /> : <FaArrowDown />;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const clearFilters = () => setFilters({});

  // Filter first (cheaper, shrinks the array), then sort what's left. Both
  // steps are pure functions of [tableData, filters, sortConfig], so
  // useMemo correctly skips recomputation when none of them changed.
  const visibleData = useMemo(() => {
    const filtered = tableData.filter((row) => matchesFilters(row, filters));

    if (!sortConfig.key || sortConfig.direction === "default") {
      return filtered;
    }

    const column = COLUMNS.find((col) => col.key === sortConfig.key);
    return [...filtered].sort((a, b) => {
      const comparison = compareValues(a, b, column);
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [tableData, filters, sortConfig]);

  return (
    <div className="table-container">
      <div className="table-header-row">
        <div>
          <h2 className="table-title">Employee Records</h2>
          <span className="table-subtitle">
            Showing {visibleData.length} of {tableData.length} records
          </span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.key} className="table-header">
                  <button
                    type="button"
                    className="sort-btn"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                    {getSortIcon(column.key)}
                  </button>
                </th>
              ))}
            </tr>
            <tr className="filter-row">
              {COLUMNS.map((column) => (
                <th key={column.key} className="table-filter-cell">
                  {column.filterType === "select" ? (
                    <select
                      value={filters[column.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(column.key, e.target.value)
                      }
                      aria-label={`Filter by ${column.label}`}
                    >
                      <option value="">All</option>
                      {column.filterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={filters[column.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(column.key, e.target.value)
                      }
                      placeholder={`Filter ${column.label}`}
                      aria-label={`Filter by ${column.label}`}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleData.length ? (
              visibleData.map((row) => (
                <tr key={row.uniqueKey}>
                  {COLUMNS.map((column) => (
                    <td key={column.key} className="table-cell">
                      {getDisplayValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={COLUMNS.length} className="empty-state">
                  {tableData.length
                    ? "No records match the current filters."
                    : "No records yet. Add an employee to get started."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableWithForm = () => {
  const [formValues, setFormValues] = useState(EMPTY_FORM_VALUES);
  const [tableData, setTableData] = useState([]);

  return (
    <div className="container">
      <Form
        formValues={formValues}
        setFormValues={setFormValues}
        tableData={tableData}
        setTableData={setTableData}
      />
      <Table tableData={tableData} />
    </div>
  );
};

export default TableWithForm;
