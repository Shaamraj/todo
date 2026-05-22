import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";

export default function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const token = localStorage.getItem("token");

  // FETCH TASKS
  const fetchTasks = async () => {
    try {

      const res = await fetch(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      const data = await res.json();

      setTasks(data);

    } catch (err) {
      console.log(err);
    }
  };

  // ADD TASK
  const addTask = async () => {

    if (!text.trim()) return;

    try {

      const res = await fetch(
        "http://localhost:5000/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({
            text,
            dueDate
          })
        }
      );

      const data = await res.json();

      setTasks([data, ...tasks]);

      setText("");
      setDueDate("");

    } catch (err) {
      console.log(err);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {

      await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      setTasks(
        tasks.filter((task) => task._id !== id)
      );

    } catch (err) {
      console.log(err);
    }
  };

  // TOGGLE TASK
  const toggleTask = async (id) => {
    try {

      const res = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      const updatedTask = await res.json();

      setTasks(
        tasks.map((task) =>
          task._id === id
            ? updatedTask
            : task
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  // EDIT TASK
  const editTask = async (id) => {
    try {

      const res = await fetch(
        `http://localhost:5000/api/tasks/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({
            text: editText
          })
        }
      );

      const updatedTask = await res.json();

      setTasks(
        tasks.map((task) =>
          task._id === id
            ? updatedTask
            : task
        )
      );

      setEditId(null);
      setEditText("");

    } catch (err) {
      console.log(err);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="dashboard-container">

      {/* TOP BAR */}
      <div className="top-bar">

        <h1>TODO Dashboard</h1>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      {/* INPUT SECTION */}
      <div className="task-input-box">

        <input
          type="text"
          placeholder="Enter task..."
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
        />

        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />

        <button onClick={addTask}>
          Add Task
        </button>

      </div>

      {/* TASKS */}
      <div className="tasks-container">

        {tasks.length === 0 ? (

          <p className="empty-text">
            No tasks added yet
          </p>

        ) : (

          tasks.map((task) => {

            const isOverdue =
              task.dueDate &&
              !task.completed &&
              new Date(task.dueDate) < new Date();

            return (

              <div
                className="task-card"
                key={task._id}
              >

                {/* LEFT */}
                <div className="task-left">

                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      toggleTask(task._id)
                    }
                  />

                  <div className="task-details">

                    {/* EDIT MODE */}
                    {editId === task._id ? (

                      <div className="edit-box">

                        <input
                          type="text"
                          value={editText}
                          onChange={(e) =>
                            setEditText(
                              e.target.value
                            )
                          }
                        />

                        <button
                          className="save-btn"
                          onClick={() =>
                            editTask(task._id)
                          }
                        >
                          Save
                        </button>

                      </div>

                    ) : (

                      <>
                        <span
                          className={
                            task.completed
                              ? "completed-task"
                              : ""
                          }
                        >
                          {task.text}
                        </span>

                        <p className="due-date">
                          {task.dueDate
                            ? `Due: ${new Date(
                                task.dueDate
                              ).toLocaleString()}`
                            : "No deadline"}
                        </p>

                        {isOverdue && (
                          <p className="overdue-text">
                            OVERDUE
                          </p>
                        )}
                      </>

                    )}

                  </div>

                </div>

                {/* RIGHT */}
                <div className="task-actions">

                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditId(task._id);
                      setEditText(task.text);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteTask(task._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            );
          })
        )}

      </div>

    </div>
  );
}