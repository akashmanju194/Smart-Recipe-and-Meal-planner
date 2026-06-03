import { useState, useEffect, useCallback } from "react";
import { recipeService } from "../services/recipeService";

/**
 * Custom hook for recipe CRUD operations and state management.
 */
export const useRecipes = (initialFilters = {}) => {
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeService.getAll({ ...initialFilters, ...filters });
      setRecipes(data.recipes);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch recipes.");
    } finally {
      setLoading(false);
    }
  }, []);

  const searchRecipes = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeService.search(query);
      setRecipes(data);
      setPagination(null);
    } catch (err) {
      setError(err.response?.data?.error || "Search failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return { recipes, pagination, loading, error, fetchRecipes, searchRecipes };
};
