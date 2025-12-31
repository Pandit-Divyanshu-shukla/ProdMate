import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { addRoutine, getRoutines } from "../api/routineApi";
import TaskList from "../components/TaskList";
import { useAuth } from "../context/AuthContext";
import { getStats } from "../api/statsApi";
import { toast } from "react-hot-toast";
import Spinner from "../components/Spinner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Dashboard() {
  const { token } = useAuth();

  const [routines, setRoutines] = useState([]);
  const [stats, setStats] = useState(null);

  const [title, setTitle] = useState("Study");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [addingRoutine, setAddingRoutine] = useState(false);
  const [activeRoutineId, setActiveRoutineId] = useState(null);

  // Fetch routines
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const data = await getRoutines(token);
        setRoutines(data.routines || []);
      } catch {
        toast.error("Failed to load routines");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchRoutines();
    else setLoading(false);
  }, [token]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats(token);
        setStats(data.stats);
      } catch {
        toast.error("Failed to load stats");
      }
    };

    if (token) fetchStats();
  }, [token]);

  // Add routine
  const handleAddRoutine = async (e) => {
    e.preventDefault();

    if (!title || !startTime || !endTime) {
      toast.error("Please fill all required fields");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setAddingRoutine(true);

      await addRoutine(token, {
        title,
        description,
        startTime,
        endTime,
        category: title.toLowerCase(),
      });

      await refreshDashboard();

      setDescription("");
      setStartTime("");
      setEndTime("");

      toast.success("Routine added successfully");
    } catch {
      toast.error("Failed to add routine");
    } finally {
      setAddingRoutine(false);
    }
  };

  // Refresh routines + stats together
  const refreshDashboard = async () => {
    try {
      const [routinesData, statsData] = await Promise.all([
        getRoutines(token),
        getStats(token),
      ]);

      setRoutines(routinesData.routines || []);
      setStats(statsData.stats);
    } catch {
      toast.error("Failed to refresh dashboard");
    }
  };

  return (
    <>
      <Navbar />

      {/* ADD ROUTINE */}
      <div className="p-6 bg-gray-100">
        <form
          onSubmit={handleAddRoutine}
          className="bg-white p-4 rounded shadow mb-6"
        >
          <h2 className="font-semibold mb-3">Add Routine</h2>

          <Select value={title} onValueChange={setTitle}>
            <SelectTrigger className="mb-2">
              <SelectValue placeholder="Select routine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Study">Study</SelectItem>
              <SelectItem value="Gym">Gym</SelectItem>
              <SelectItem value="Travel">Travel</SelectItem>
              <SelectItem value="College">College</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
            </SelectContent>
          </Select>

          <textarea
            placeholder="Description (optional)"
            className="border p-2 w-full mb-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-3 mb-3">
            <input
              type="time"
              className="border p-2 w-full"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <input
              type="time"
              className="border p-2 w-full"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={addingRoutine}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-70"
          >
            {addingRoutine ? <Spinner /> : "Add Routine"}
          </button>
        </form>
      </div>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 px-6">
          {[
            ["Routines", stats.totalRoutines],
            ["Tasks", stats.totalTasks],
            ["Completed", stats.completedTasks],
            ["Completion", `${stats.completionPercentage}%`],
            ["Done Today", stats.tasksCompletedToday],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-white p-4 rounded shadow text-center"
            >
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* DASHBOARD */}
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {loading && <p>Loading routines...</p>}

        {!loading && routines.length === 0 && <p>No routines found.</p>}

        {!loading &&
          routines.map((routine) => (
            <div
              key={routine._id}
              className="bg-white p-4 rounded shadow mb-3 cursor-pointer"
              onClick={() =>
                setActiveRoutineId(
                  activeRoutineId === routine._id ? null : routine._id
                )
              }
            >
              <h2 className="font-semibold text-lg">{routine.title}</h2>
              <p className="text-sm text-gray-600">{routine.description}</p>

              <p className="mt-2 text-sm">
                Completion: {routine.completionPercentage}%
              </p>

              <div className="w-full bg-gray-200 rounded h-3 mt-1">
                <div
                  className="bg-green-500 h-3 rounded"
                  style={{
                    width: `${routine.completionPercentage}%`,
                  }}
                />
              </div>

              {activeRoutineId === routine._id && (
                <TaskList
                  routineId={routine._id}
                  onTaskChange={refreshDashboard}
                />
              )}
            </div>
          ))}
      </div>
    </>
  );
}

export default Dashboard;
