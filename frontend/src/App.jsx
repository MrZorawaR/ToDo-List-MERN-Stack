import { Input, Button as NextUIButton } from "@nextui-org/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePickerDemo from "./components/ui/date"; // Ensure this import path is correct
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch todos from the backend when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/todos")
      .then((response) => {
        const updatedTodos = response.data.map((todo) => {
          if (new Date(todo.dueDate) < new Date() && todo.completed) {
            return { ...todo, completed: false };
          }
          return todo;
        });
        setTodos(updatedTodos);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
  };

  const handleDueDateChange = (date) => {
    setDueDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTodo = { task, priority, dueDate };

    if (isEditing) {
      axios
        .put(`http://localhost:5000/api/todos/${editingId}`, newTodo)
        .then((response) => {
          setTodos(
            todos.map((todo) => (todo._id === editingId ? response.data : todo))
          );
          clearForm();
        })
        .catch((error) => console.error(error));
    } else {
      axios
        .post("http://localhost:5000/api/todos", newTodo)
        .then((response) => {
          setTodos([...todos, response.data]);
          clearForm();
        })
        .catch((error) => console.error(error));
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/todos/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((error) => console.error(error));
  };

  const handleEdit = (id, currentTask, currentPriority, currentDueDate) => {
    setTask(currentTask);
    setPriority(currentPriority);
    setDueDate(new Date(currentDueDate));
    setIsEditing(true);
    setEditingId(id);
  };

  const handleComplete = (id) => {
    axios
      .put(`http://localhost:5000/api/todos/${id}`, { completed: true })
      .then((response) => {
        setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      })
      .catch((error) => console.error(error));
  };

  const clearForm = () => {
    setTask("");
    setPriority("Medium");
    setDueDate(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const sortedTodos = todos.sort((a, b) => {
    const priorities = { High: 1, Medium: 2, Low: 3 };
    return priorities[a.priority] - priorities[b.priority];
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Todo List</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <Input
            type="text"
            value={task}
            onChange={handleChange}
            required
            label="Add Task"
            className="w-full md:w-1/3"
          />
          <Select value={priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-[180px] h-[50px]">
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High Priority</SelectItem>
              <SelectItem value="Medium">Medium Priority</SelectItem>
              <SelectItem value="Low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerDemo onChange={handleDueDateChange} />
          <NextUIButton size="lg" type="submit">
            {isEditing ? "Update Task" : "Add Task"}
          </NextUIButton>
        </div>
      </form>
      <div className="flex flex-col gap-4 mt-6">
        {sortedTodos.length === 0 ? (
          <p className="text-center">No todos available.</p>
        ) : (
          sortedTodos.map((todo) => (
            <div key={todo._id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
              <div>
                <h3 className={`text-lg font-semibold ${todo.completed ? "line-through text-gray-400" : ""}`}>
                  {todo.task}
                  {todo.completed && <span className="text-green-600 ml-2">(Completed)</span>}
                </h3>
                <p className="text-sm text-gray-500">
                  Priority: {todo.priority} | Due Date: {new Date(todo.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                {!todo.completed && (
                  <NextUIButton
                    onClick={() => handleComplete(todo._id)}
                    variant="primary"
                    className="transition duration-200 hover:bg-green-600 hover:text-white"
                  >
                    Complete
                  </NextUIButton>
                )}
                <NextUIButton
                  onClick={() => handleEdit(todo._id, todo.task, todo.priority, todo.dueDate)}
                  variant="secondary"
                  className="transition duration-200 hover:bg-blue-600 hover:text-white"
                >
                  Edit
                </NextUIButton>
                <NextUIButton
                  onClick={() => handleDelete(todo._id)}
                  variant="danger"
                  className="transition duration-200 hover:bg-red-600 hover:text-white"
                >
                  Delete
                </NextUIButton>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
