import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasksByRoutine, addTask, updateTask } from "../api/taskApi";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

function TaskList({ routineId, onTaskChange }) {
  const { token } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);

  // Task form states
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");
  const [duration, setDuration] = useState("");

  // Fetch tasks for a routine
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasksByRoutine(token, routineId);
        setTasks(data.tasks || []);
      } catch (err) {
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [routineId, token]);

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      toast.error("Task title is required");
      return;
    }

    try {
      setAddingTask(true);

      await addTask(token, routineId, {
        title: taskTitle,
        description,
        priority,
        deadline: deadline ? new Date(deadline) : null,
        duration: duration ? Number(duration) : 0,
      });

      // Reset form
      setTaskTitle("");
      setDescription("");
      setPriority("medium");
      setDeadline("");
      setDuration("");

      const data = await getTasksByRoutine(token, routineId);
      setTasks(data.tasks || []);

      onTaskChange();
      toast.success("Task added successfully");
    } catch (err) {
      toast.error("Failed to add task");
    } finally {
      setAddingTask(false);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (taskId, isCompleted) => {
    try {
      await updateTask(token, taskId, {
        isCompleted: !isCompleted,
      });

      const data = await getTasksByRoutine(token, routineId);
      setTasks(data.tasks || []);

      onTaskChange();
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  return (
    <div
      className="mt-4 bg-gray-50 p-4 rounded"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="font-semibold mb-3">Tasks</h3>

      {/* ADD TASK FORM */}
      <form onSubmit={handleAddTask} className="space-y-2 mb-4">
        <Input
          placeholder="Task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />

        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Priority */}
        <select
          className="border p-2 rounded w-full"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Deadline */}
        <Input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        {/* Duration */}
        <Input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <Button
          type="submit"
          disabled={addingTask}
          className="w-full flex items-center justify-center gap-2"
        >
          {addingTask ? <Spinner size={16} /> : "Add Task"}
        </Button>
      </form>

      {/* TASK LIST */}
      {loading && <p className="text-sm">Loading tasks...</p>}

      {!loading && tasks.length === 0 && (
        <p className="text-sm text-gray-500">No tasks yet.</p>
      )}

      {!loading &&
        tasks.map((task) => (
          <div
            key={task._id}
            className="flex items-center gap-3 mb-2 bg-white p-2 rounded"
          >
            <Checkbox
              checked={task.isCompleted}
              onCheckedChange={() =>
                handleToggleComplete(task._id, task.isCompleted)
              }
            />

            <span
              className={`text-sm ${
                task.isCompleted ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </span>
          </div>
        ))}
    </div>
  );
}

export default TaskList;