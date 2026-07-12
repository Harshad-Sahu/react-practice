import React, { useState } from "react";
import "./KanbanDragAndDrop.css";

// Sample initial data for the kanban columns.
// This object should remain unchanged by the component logic
// because tests depend on the initial distribution of tasks.
const initialData = {
  todo: [
    { id: "task-1", label: "Task 1" },
    { id: "task-2", label: "Task 2" },
  ],
  "in progress": [{ id: "task-3", label: "Task 3" }],
  done: [{ id: "task-4", label: "Task 4" }],
};

export default function KanbanBoard() {
  // columns holds the current task arrays for each column.
  // We clone initialData to avoid mutating the original object.
  const [columns, setColumns] = useState(() =>
    Object.fromEntries(
      Object.entries(initialData).map(([key, tasks]) => [
        key,
        tasks.map((task) => ({ ...task })),
      ]),
    ),
  );

  // editingTaskId tracks which task is currently being edited.
  const [editingTaskId, setEditingTaskId] = useState(null);
  // editingValue stores the current value of the edit input field.
  const [editingValue, setEditingValue] = useState("");
  // isAdding controls whether the new task input is shown in the To Do column.
  const [isAdding, setIsAdding] = useState(false);
  // newTaskLabel stores the text for a new task before it is submitted.
  const [newTaskLabel, setNewTaskLabel] = useState("");

  const getColumnTitle = (columnId) => {
    if (columnId === "todo") return "To Do";
    if (columnId === "in progress") return "In Progress";
    return "Done";
  };

  // When dragging starts, store the task id and source column in the drag payload.
  const handleDragStart = (event, taskId, sourceColumn) => {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ taskId, sourceColumn }),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  // Allow dropping by preventing the default dragover behavior.
  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  // Handle dropping a task into a target column.
  const handleDrop = (event, targetColumn) => {
    event.preventDefault();
    // Get the data stored during drag start.
    const payload = event.dataTransfer.getData("text/plain");
    if (!payload) return;

    try {
      const { taskId, sourceColumn } = JSON.parse(payload);
      // Do nothing if the task is dropped into the same column.
      if (sourceColumn === targetColumn) return;
      if (!columns[sourceColumn] || !columns[targetColumn]) return;

      setColumns((prevColumns) => {
        const taskToMove = prevColumns[sourceColumn].find(
          (task) => task.id === taskId,
        );
        if (!taskToMove) return prevColumns;

        // Remove the task from the source column and append it to the target column.
        return {
          ...prevColumns,
          [sourceColumn]: prevColumns[sourceColumn].filter(
            (task) => task.id !== taskId,
          ),
          [targetColumn]: [...prevColumns[targetColumn], taskToMove],
        };
      });
    } catch {
      // If parsing fails, ignore the drop.
      return;
    }
  };

  // Start editing when the user clicks a task label.
  const handleLabelClick = (taskId, currentLabel) => {
    setEditingTaskId(taskId);
    setEditingValue(currentLabel);
  };

  // Save the edited label and update state immutably.
  const saveEditedTask = () => {
    if (!editingTaskId) {
      setEditingTaskId(null);
      setEditingValue("");
      return;
    }

    const trimmedLabel = editingValue.trim();
    // Do not save empty text; discard changes instead.
    if (trimmedLabel === "") {
      setEditingTaskId(null);
      setEditingValue("");
      return;
    }

    setColumns((prevColumns) => {
      const updatedColumns = {};
      Object.entries(prevColumns).forEach(([columnId, tasks]) => {
        updatedColumns[columnId] = tasks.map((task) =>
          task.id === editingTaskId ? { ...task, label: trimmedLabel } : task,
        );
      });
      return updatedColumns;
    });

    setEditingTaskId(null);
    setEditingValue("");
  };

  // Cancel editing without saving changes.
  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingValue("");
  };

  const handleEditKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEditedTask();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  };

  // Remove the task from whichever column currently holds it.
  const deleteTask = (taskId) => {
    setColumns((prevColumns) => {
      const updatedColumns = {};
      Object.entries(prevColumns).forEach(([columnId, tasks]) => {
        updatedColumns[columnId] = tasks.filter((task) => task.id !== taskId);
      });
      return updatedColumns;
    });
  };

  // Show the inline input field for creating a new task in the To Do column.
  const addNewTaskInline = () => {
    setIsAdding(true);
    setNewTaskLabel("");
  };

  // Validate and persist the new task, then close the inline form.
  const saveNewTask = () => {
    const trimmedLabel = newTaskLabel.trim();
    if (trimmedLabel === "") {
      setIsAdding(false);
      setNewTaskLabel("");
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      label: trimmedLabel,
    };

    setColumns((prevColumns) => ({
      ...prevColumns,
      todo: [...prevColumns.todo, newTask],
    }));

    setNewTaskLabel("");
    setIsAdding(false);
  };

  // Submit or cancel the inline new task input via keyboard.
  const handleAddKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveNewTask();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setIsAdding(false);
      setNewTaskLabel("");
    }
  };

  return (
    <div className="kanban-root">
      <h2 style={{ textAlign: "center" }}>Drag & Drop</h2>
      <div className="board">
        {Object.keys(columns).map((columnId) => (
          <div
            key={columnId}
            className="column"
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, columnId)}
          >
            <h4>{getColumnTitle(columnId)}</h4>
            {columnId === "todo" && (
              <div className="add-task-inline">
                {isAdding ? (
                  <input
                    className="add-task-input-inline"
                    type="text"
                    value={newTaskLabel}
                    placeholder="Enter task label"
                    onChange={(event) => setNewTaskLabel(event.target.value)}
                    onBlur={saveNewTask}
                    onKeyDown={handleAddKeyPress}
                    autoFocus
                  />
                ) : (
                  <button
                    type="button"
                    className="add-task-button"
                    onClick={addNewTaskInline}
                  >
                    + Add a task
                  </button>
                )}
              </div>
            )}

            {columns[columnId].map((task) => (
              <div
                key={task.id}
                className="task"
                draggable
                onDragStart={(event) =>
                  handleDragStart(event, task.id, columnId)
                }
              >
                {editingTaskId === task.id ? (
                  <input
                    className="task-edit-input"
                    type="text"
                    value={editingValue}
                    onChange={(event) => setEditingValue(event.target.value)}
                    onBlur={saveEditedTask}
                    onKeyDown={handleEditKeyPress}
                    autoFocus
                  />
                ) : (
                  <span
                    className="task-label"
                    onClick={() => handleLabelClick(task.id, task.label)}
                  >
                    {task.label}
                  </span>
                )}
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.label}`}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
