import api from "./api";

export const recipeService = {
  getAll: async (params = {}) => {
    const response = await api.get("/recipes", { params });
    return response.data;
  },

  search: async (query) => {
    const response = await api.get("/recipes/search", { params: { q: query } });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  create: async (recipeData) => {
    const response = await api.post("/recipes", recipeData);
    return response.data;
  },

  update: async (id, recipeData) => {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },
};
