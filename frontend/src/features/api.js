import api from "../services/api.js";

export const saveGraph = async (graph) => {
  const response = await api.post("/graphs", graph);
  return response.data;
};

export const getGraph = async (id) => {
  const response = await api.get(`/graphs/${id}`);
  return response.data;
};

export const listStudentGraphs = async () => {
  const response = await api.get("/graphs");
  return response.data;
};
