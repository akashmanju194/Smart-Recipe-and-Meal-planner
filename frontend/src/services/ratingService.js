import api from "./api";

export const ratingService = {
  submitRating: async (recipeId, ratingData) => {
    const response = await api.post(`/ratings/${recipeId}`, ratingData);
    return response.data;
  },

  getRecipeRatings: async (recipeId) => {
    const response = await api.get(`/ratings/${recipeId}`);
    return response.data;
  },
};
