import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dueDate, setDueDate] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleString()
  );

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name");
  

  const events = tasks
  .filter(task => task.dueDate)
  .map(task => ({
    id: task._id,
    title: task.text,
    start: task.dueDate,

    color: task.completed
      ? "#22c55e"
      : new Date(task.dueDate) < new Date()
      ? "#ef4444"
      : new Date(task.dueDate).toDateString() ===
        new Date().toDateString()
      ? "#f59e0b"
      : "#2563eb"
  }));
  const todayTasks = tasks.filter(task =>
      !task.completed &&
      task.dueDate &&
      new Date(task.dueDate).toDateString() ===
        new Date().toDateString()
    );

    const overdueTasks = tasks.filter(task =>
      !task.completed &&
      task.dueDate &&
      new Date(task.dueDate) < new Date()
    );

    const nextWeekTasks = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;

      const due = new Date(task.dueDate);

      const today = new Date();

      const week = new Date();
      week.setDate(today.getDate() + 7);

      return due > today && due <= week;
    });
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
      setCurrentTime(
        new Date().toLocaleString()
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  const todayTasks = tasks.filter(task =>
  task.dueDate &&
  !task.completed &&
  new Date(task.dueDate).toDateString() === new Date().toDateString()
);

const overdueTasks = tasks.filter(task =>
  task.dueDate &&
  !task.completed &&
  new Date(task.dueDate) < new Date()
);

const nextWeekTasks = tasks.filter(task => {
  if (!task.dueDate || task.completed) return false;

  const due = new Date(task.dueDate);
  const now = new Date();
  const week = new Date(now);
  week.setDate(now.getDate() + 7);

  return due > now && due <= week;
});
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
            Current Time: {currentTime}
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>
<div className="stats-container">

  <div className="stat-card">
    <div className="stat-number">
      {tasks.length}
    </div>
    <div className="stat-label">
      Total Tasks
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-number">
      {
        tasks.filter(
          task => !task.completed
        ).length
      }
    </div>
    <div className="stat-label">
      Pending
    </div>
  </div>

  <div className="stat-card">
          <div className="stat-number">
            {
              tasks.filter(
                task => task.completed
              ).length
            }
          </div>
          <div className="stat-label">
            Completed
          </div>
        </div>
   

</div>
  <div className="search-box">
  <input
    type="text"
    placeholder="🔍 Search tasks..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
  <div className="filter-buttons">
  <button onClick={() => setFilter("all")}>All</button>
  <button onClick={() => setFilter("pending")}>Pending</button>
  <button onClick={() => setFilter("completed")}>Completed</button>
  <button onClick={() => setFilter("today")}>Today</button>
  <button onClick={() => setFilter("overdue")}>Overdue</button>
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
      <div className="stats-container">

  <div className="stat-card">
    <div className="stat-number">{tasks.length}</div>
    <div className="stat-label">Total Tasks</div>
  </div>

  <div className="stat-card">
    <div className="stat-number">
      {tasks.filter(task => !task.completed).length}
    </div>
    <div className="stat-label">Pending</div>
  </div>

  <div className="stat-card">
    <div className="stat-number">
      {tasks.filter(task => task.completed).length}
    </div>
    <div className="stat-label">Completed</div>
  </div>

  <div className="search-box">
    <input
      type="text"
      placeholder="🔍 Search tasks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  <div className="filter-buttons">
    <button onClick={() => setFilter("all")}>All</button>
    <button onClick={() => setFilter("pending")}>Pending</button>
    <button onClick={() => setFilter("completed")}>Completed</button>
    <button onClick={() => setFilter("today")}>Today</button>
    <button onClick={() => setFilter("overdue")}>Overdue</button>
  </div>

</div>

<div className="summary-container">

  <div className="summary-box">
    <h3>📌 Today</h3>

    {todayTasks.map(task => (
      <div className="summary-task" key={task._id}>
        <span>{task.text}</span>

        <div>
          <button
            className="edit-btn"
            onClick={() => {
              setEditId(task._id);
              setEditText(task.text);
              setEditDueDate(
                task.dueDate
                  ? new Date(task.dueDate)
                      .toLocaleString("sv-SE")
                      .replace(" ", "T")
                      .slice(0, 16)
                  : ""
              );
            }}
          >
            Edit
          </button>

          <button
            className="delete-btn"
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>

  <div className="summary-box">
    <h3>⚠️ Overdue</h3>

    {overdueTasks.map(task => (
      <div className="summary-task" key={task._id}>
        <span>{task.text}</span>

        <div>
          <button
            className="edit-btn"
            onClick={() => {
              setEditId(task._id);
              setEditText(task.text);
              setEditDueDate(
                task.dueDate
                  ? new Date(task.dueDate)
                      .toLocaleString("sv-SE")
                      .replace(" ", "T")
                      .slice(0, 16)
                  : ""
              );
            }}
          >
            Edit
          </button>

          <button
            className="delete-btn"
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>

  <div className="summary-box">
    <h3>⏳ Next 7 Days</h3>

    {nextWeekTasks.map(task => (
      <div className="summary-task" key={task._id}>
        <span>{task.text}</span>

        <div>
          <button
            className="edit-btn"
            onClick={() => {
              setEditId(task._id);
              setEditText(task.text);
              setEditDueDate(
                task.dueDate
                  ? new Date(task.dueDate)
                      .toLocaleString("sv-SE")
                      .replace(" ", "T")
                      .slice(0, 16)
                  : ""
              );
            }}
          >
            Edit
          </button>

          <button
            className="delete-btn"
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>

</div>

      {/* TASKS */}
      <div className="dashboard-content">
        <div className="tasks-side">
          <div className="tasks-container">
        {tasks.length === 0 ? (
          <p className="empty-text">
            No tasks added yet
          </p>
        ) : (
          tasks
            .filter(task =>
              task.text.toLowerCase().includes(search.toLowerCase())
            )
            .filter(task => {
              if (filter === "pending") return !task.completed;
              if (filter === "completed") return task.completed;

              if (filter === "overdue")
                return task.dueDate &&
                  !task.completed &&
                  new Date(task.dueDate) < new Date();

              if (filter === "today") {
                if (!task.dueDate) return false;

                const today = new Date();
                const due = new Date(task.dueDate);

                return (
                  today.toDateString() === due.toDateString()
                );
              }

              return true;
            })
              .map((task) => {
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

    <div className="calendar-container">
     <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin
            ]}

            initialView="dayGridMonth"

            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}

            events={events}

            eventClick={(info)=>{

                    const task=tasks.find(
                    t=>t._id===info.event.id
                    );

                    if(!task) return;

                    setEditId(task._id);

                    setEditText(task.text);

                    setEditDueDate(
                    task.dueDate
                    ? new Date(task.dueDate)
                    .toLocaleString("sv-SE")
                    .replace(" ","T")
                    .slice(0,16)
                    : ""
                    );

                    }}

            editable={false}

            selectable={true}

            height="700px"
          />
          
        
    </div>

  </div>
</div>
  );
}

