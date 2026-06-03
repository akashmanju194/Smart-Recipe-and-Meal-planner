import api from "./api";

export const mealPlanService = {
  getAll: async (params = {}) => {
    const response = await api.get("/meal-plans", { params });
    return response.data;
  },

  create: async (date) => {
    const response = await api.post("/meal-plans", { date });
    return response.data;
  },

  addItem: async (mealPlanId, recipeId, mealType) => {
    const response = await api.post(`/meal-plans/${mealPlanId}/items`, {
      recipeId,
      mealType,
    });
    return response.data;
  },

  removeItem: async (mealPlanId, itemId) => {
    const response = await api.delete(`/meal-plans/${mealPlanId}/items/${itemId}`);
    return response.data;
  },
};
