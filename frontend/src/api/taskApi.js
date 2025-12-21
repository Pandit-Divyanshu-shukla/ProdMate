import api from "./axios";

// Get tasks for a routine
export const getTasksByRoutine = async (token, routineId) => {
  const res = await api.get(`/tasks/${routineId}`, {
    headers: {
      Authorization: token,
    },
  });

  return res.data;
};

// Add a new task (FINAL FIX)
export const addTask = async (token, routineId, taskData) => {
  const res = await api.post(
    `/tasks/add/${routineId}`,   // ✅ correct URL
    taskData,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return res.data;
};

// Update task
export const updateTask = async (token, taskId, data) => {
  const res = await api.put(`/tasks/update/${taskId}`, data, {
    headers: {
      Authorization: token,
    },
  });

  return res.data;
};
