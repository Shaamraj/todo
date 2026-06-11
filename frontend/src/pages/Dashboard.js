import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [, setCurrentTime] = useState(Date.now());
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name");

  const currentUTC =
  new Date()
    .toISOString()
    .slice(0, 16)
    .replace("T", " ") + " UTC";

  const now = new Date();

  now.setMinutes(now.getMinutes() + 5);

  const minDateTime = new Date(
    now.getTime() -
      now.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await fetch(
        "https://todo-11qz.onrender.com/api/tasks",
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      const data = await res.json();

        setTasks(
          data.sort((a, b) => {
            // Pending tasks first
            if (a.completed !== b.completed) {
              return a.completed - b.completed;
            }

            // Tasks without due date go to bottom
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;

            // Nearest deadline first
            return (
              new Date(a.dueDate) -
              new Date(b.dueDate)
            );
          })
        );
            } catch (err) {
              console.log(err);
            }
          };

  // ADD TASK
  const addTask = async () => {
    if (!text.trim()) return;

    if (
      dueDate &&
      new Date(dueDate) < new Date()
    ) {
      alert(
        "Please select a future date and time"
      );
      return;
    }

    try {
      await fetch(
        "https://todo-11qz.onrender.com/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({
            text,
            dueDate: dueDate
              ? new Date(dueDate).toISOString()
              : null
          })
        }
      );

      setText("");
      setDueDate("");

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await fetch(
        `https://todo-11qz.onrender.com/api/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // TOGGLE TASK
  const toggleTask = async (id) => {
    try {
      await fetch(
        `https://todo-11qz.onrender.com/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // EDIT TASK
  const editTask = async (id) => {
    if (
      editDueDate &&
      new Date(editDueDate) < new Date()
    ) {
      alert(
        "Please select a future date and time"
      );
      return;
    }

    try {
      await fetch(
        `https://todo-11qz.onrender.com/api/tasks/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({
            text: editText,
            dueDate: editDueDate
              ? new Date(editDueDate).toISOString()
              : null
          })
        }
      );

      setEditId(null);
      setEditText("");
      setEditDueDate("");

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    window.location.href = "/";
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(Date.now());
  }, 60000);

  return () => clearInterval(interval);
}, []);
  return (
    <div className="dashboard-container">
      {/* TOP BAR */}
      <div className="top-bar">
        <div>
          <h1>
            Welcome, {userName}
          </h1>

         <p
            style={{
              color: "white",
              margin: "5px 0 0 0",
              fontSize: "14px"
            }}
          >
            Current UTC: {currentUTC}
          </p>
        </div>

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
          min={minDateTime}
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
              Date.now() >
                new Date(task.dueDate).getTime();

            return (
              <div
                className="task-card"
                key={task._id}
              >
                <div className="task-left">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      toggleTask(task._id)
                    }
                  />

                  <div className="task-details">
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

                        <input
                          type="datetime-local"
                          value={editDueDate}
                          min={minDateTime}
                          onChange={(e) =>
                            setEditDueDate(
                              e.target.value
                            )
                          }
                        />

                        <div className="edit-actions">
                          <button
                            className="save-btn"
                            onClick={() =>
                              editTask(task._id)
                            }
                          >
                            Save
                          </button>

                          <button
                            className="cancel-btn"
                            onClick={() => {
                              setEditId(null);
                              setEditText("");
                              setEditDueDate("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
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
                              ? `Due (UTC): ${new Date(
                                  task.dueDate
                                ).toUTCString()}`
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

                {editId !== task._id && (
                  <div className="task-actions">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditId(task._id);

                        setEditText(task.text);

                        setEditDueDate(
                          task.dueDate
                            ? new Date(
                                task.dueDate
                              )
                                .toLocaleString(
                                  "sv-SE"
                                )
                                .replace(
                                  " ",
                                  "T"
                                )
                                .slice(0, 16)
                            : ""
                        );
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
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}