import { useState, useCallback } from "react";
import { mealPlanService } from "../services/mealPlanService";

/**
 * Custom hook for meal plan operations.
 */
export const useMealPlan = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMealPlans = useCallback(async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mealPlanService.getAll({ startDate, endDate });
      setMealPlans(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch meal plans.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlan = useCallback(async (date) => {
    const data = await mealPlanService.create(date);
    setMealPlans((prev) => [...prev, data]);
    return data;
  }, []);

  const addItem = useCallback(async (mealPlanId, recipeId, mealType) => {
    const data = await mealPlanService.addItem(mealPlanId, recipeId, mealType);
    // Refresh to get updated totals
    return data;
  }, []);

  const removeItem = useCallback(async (mealPlanId, itemId) => {
    const data = await mealPlanService.removeItem(mealPlanId, itemId);
    return data;
  }, []);

  return { mealPlans, loading, error, fetchMealPlans, createPlan, addItem, removeItem };
};
