import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);

  const API = "http://localhost:5000";

  // REGISTER
  const register = async () => {
    const res = await fetch(API + "/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    alert(data.message);
  };

  // LOGIN
  const login = async () => {
    const res = await fetch(API + "/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      alert("Login successful");
    } else {
      alert(data.message);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    alert("Logged out");
  };

  // ADD TODO
  const addTodo = async () => {
    await fetch(API + "/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ text })
    });

    setText("");
    getTodos();
  };

  // GET TODOS
  const getTodos = async () => {
    const res = await fetch(API + "/api/todos", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();
    setTodos(data);
  };

  // DELETE TODO
  const deleteTodo = async (id) => {
    await fetch(API + "/api/todos/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    });

    getTodos();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Todo App</h2>

      {/* AUTH SECTION */}
      <h3>Authentication</h3>

      <input
        placeholder="Name (for register)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>

      <hr />

      {/* TODO SECTION */}
      <h3>Todo List</h3>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTodo}>Add</button>

      <br /><br />

      <button onClick={getTodos}>Load Todos</button>

      <ul>
        {todos.map((t) => (
          <li key={t._id}>
            {t.text}
            <button onClick={() => deleteTodo(t._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;