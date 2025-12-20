import api from "./axios";

// Get all routines for logged-in user
export const getRoutines = async (token) => {
  const res = await api.get("/routines", {
    headers: {
      Authorization: token,
    },
  });

  return res.data;
};

export const addRoutine = async (token, routineData) => {
  const res = await api.post(
    "/routines/add",
    routineData,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return res.data;
};
