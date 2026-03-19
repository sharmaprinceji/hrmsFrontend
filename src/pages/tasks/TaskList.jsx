// import { useEffect, useState } from "react";
// import api from "../../services/api";
// import Sidebar from "../../components/common/Sidebar";
// import "../../styles/task.css";

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);

//   const fetchTasks = async () => {
//     try {
//       const res = await api.get("/tasks");
//       setTasks(res.data.data || []);
//     } catch (err) {
//       alert("Failed to load tasks");
//     }
//   };

//   const updateStatus = async (id, status) => {
//     try {
//       await api.put(`/tasks/${id}`, { status });
//       fetchTasks();
//     } catch (err) {
//       alert("Update failed");
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   // Filter by status
//   const todo = tasks.filter((t) => t.status === "todo");
//   const inProgress = tasks.filter((t) => t.status === "in_progress");
//   const completed = tasks.filter((t) => t.status === "completed");

//   return (
//     <div className="task-container">
//       <Sidebar />

//       <div className="task-main">
//         <h2>Task Board</h2>

//         <div className="task-board">

//           {/* TODO */}
//           <div className="task-column">
//             <div className="column-title">📝 To Do</div>

//             {todo.map((t) => (
//               <div key={t.id} className="task-card">
//                 <div>{t.title}</div>

//                 <button
//                   className="task-btn start-btn"
//                   onClick={() => updateStatus(t.id, "in_progress")}
//                 >
//                   Start
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* IN PROGRESS */}
//           <div className="task-column">
//             <div className="column-title">⚡ In Progress</div>

//             {inProgress.map((t) => (
//               <div key={t.id} className="task-card">
//                 <div>{t.title}</div>

//                 <button
//                   className="task-btn done-btn"
//                   onClick={() => updateStatus(t.id, "completed")}
//                 >
//                   Done
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* COMPLETED */}
//           <div className="task-column">
//             <div className="column-title">✅ Completed</div>

//             {completed.map((t) => (
//               <div key={t.id} className="task-card">
//                 <div>{t.title}</div>
//               </div>
//             ))}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskList;

import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import "../../styles/task.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data.data || []);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Group tasks
  const columns = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  // Drag End
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

      // 🔥 FIX HERE
      dueDate: task.dueDate ? task.dueDate : null,
    });

    fetchTasks();
  } catch (err) {
    console.error(err);
    alert("Update failed");
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
                            <div>{task.title}</div>
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