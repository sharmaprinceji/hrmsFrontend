import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../utils/rbac";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import "../../styles/task.css";

const TaskList = () => {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "low",
    dueDate: "",
  });

  // ================= FETCH TASKS =================
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      const taskData =
        res.data.data || res.data || [];
      setTasks(Array.isArray(taskData) ? taskData : []);
    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  };

  // ================= FETCH USERS (FIXED) =================
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");

      const userData =
        res.data.data.data ||
        res.data.data ||
        res.data ||
        [];

      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  // ================= CREATE TASK =================
  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await api.post("/tasks", form);

      alert("✅ Task created successfully");

      setForm({
        title: "",
        description: "",
        assignedTo: "",
        priority: "low",
        dueDate: "",
      });

      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create task");
    }
  };

  // ================= DRAG =================
  const columns = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    const task = tasks.find((t) => String(t.id) === taskId);
    if (!task) return;

    try {
      await api.put(`/tasks/${taskId}`, {
        ...task,
        status: newStatus,
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error(err);
      alert("Update failed");
      fetchTasks();
    }
  };

  return (
    <div className="task-container">
      <Sidebar />

      <div className="task-main">
        <h2>Task Board</h2>

        {hasPermission(user, "task", "create") && (
          <form className="task-form" onSubmit={handleCreateTask}>
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            
            <select
              value={form.assignedTo}
              onChange={(e) =>
                setForm({ ...form, assignedTo: e.target.value })
              }
              required
            >
              <option value="">Assign User</option>

              {Array.isArray(users) &&
                users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.email}
                  </option>
                ))}
            </select>

            <select
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
            />

            <button type="submit">Create Task</button>
          </form>
        )}

        {/* ================= BOARD ================= */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="task-board">
            {Object.entries(columns).map(([status, taskList]) => (
              <Droppable key={status} droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    className={`task-column ${
                      snapshot.isDraggingOver ? "drag-over" : ""
                    }`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="column-title">
                      {status === "todo" && "📝 To Do"}
                      {status === "in_progress" && "⚡ In Progress"}
                      {status === "completed" && "✅ Completed"}
                    </div>

                    {taskList.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={String(task.id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`task-card ${
                              snapshot.isDragging ? "dragging" : ""
                            }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <strong>Title: {task.title}</strong>
                            <p>Des: {task.description}</p>
                            <small>
                              Prio: {task.priority}
                            </small><br/>
                            <small>Emp: {task.assignedTo}</small>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskList;