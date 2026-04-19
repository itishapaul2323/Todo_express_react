import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api, getAuthHeaders } from "../api";

function Todo() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadTodos = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }
    try {
      const res = await api.get("/todo", { headers: getAuthHeaders() });
      setItems(res.data.todosList || []);
      setError("");
    } catch (e) {
      if (e.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/signin", { replace: true });
        return;
      }
      setError("Could not load todos");
    }
  }, [navigate]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  async function addTodo(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setError("");
    try {
      const res = await api.post(
        "/todo",
        { todo: trimmed },
        { headers: getAuthHeaders() }
      );
      setText("");
      setItems((prev) => [
        ...prev,
        { id: res.data.id, todo: trimmed },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add todo");
    }
  }

  async function removeTodo(id) {
    setError("");
    try {
      await api.delete("/todo", {
        data: { id },
        headers: getAuthHeaders(),
      });
      setItems((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete todo");
    }
  }

  function signOut() {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  }

  return (
    <div className="signup-box todo-page">
      <div className="Heading">
        <h1>Your todos</h1>
        <button type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
      <form onSubmit={addTodo} className="input-container">
        <input
          type="text"
          placeholder="New todo"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <div className="error">
        <span>{error}</span>
      </div>
      <ul className="todo-list">
        {items.map((t) => (
          <li key={t.id}>
            <span>{t.todo}</span>
            <button type="button" onClick={() => removeTodo(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
