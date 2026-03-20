import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import "../../styles/task.css";

const TaskList = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data.data || []);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "low",
        status: newStatus,
        dueDate: task.dueDate || null,
      });

      // ✅ optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: newStatus } : t
        )
      );

    } catch (err) {
      console.error(err);
      alert("Update failed or not allowed");
      fetchTasks(); // revert
    }
  };

  return (
    <div className="task-container">
      <Sidebar />

      <div className="task-main">
        <h2>Task Board</h2>

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
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                            <small>Priority: {task.priority}</small>
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