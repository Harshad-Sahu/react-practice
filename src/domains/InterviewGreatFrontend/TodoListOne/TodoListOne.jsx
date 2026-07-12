import { useState } from "react";

export default function TodoListOne() {
  const [task, setTask] = useState();
  const [todoList, setTodoList] = useState([
    "Walk the dog",
    "Water the plants",
    "Wash the dishes",
  ]);

  const onDeleteTask = (index) => {
    const newTodoList = [...todoList];
    newTodoList.splice(index, 1);
    setTodoList(newTodoList);
  };

  const addTaskInList = (e) => {
    e.preventDefault();
    const newTodoList = [...todoList, task];
    setTodoList(newTodoList);
    setTask("");
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          placeholder="Add your task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <div>
          <button onClick={addTaskInList}>Submit</button>
        </div>
      </div>
      <ul style={{ margin: "1rem" }}>
        {todoList.map((task, index) => (
          <li
            key={`task-${index}`}
            style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{task}</span>
            <button onClick={() => onDeleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
