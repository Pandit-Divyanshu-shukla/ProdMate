import api from "./axios";

// Get productivity stats
export const getStats = async (token) => {
  const res = await api.get("/stats", {
    headers: {
      Authorization: token,
    },
  });

  return res.data;
};
