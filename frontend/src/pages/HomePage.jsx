import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/layout/Sidebar";
import RecipeGrid from "../components/recipe/RecipeGrid";
import { useRecipes } from "../hooks/useRecipes";
import { useAuth } from "../hooks/useAuth";
import { mealPlanService } from "../services/mealPlanService";

const HomePage = () => {
  const { recipes, loading, error, fetchRecipes } = useRecipes();
  const { isAuthenticated } = useAuth();
  
  const [smartSort, setSmartSort] = useState(false);
  const [remainingCalories, setRemainingCalories] = useState(2000);

  // Load today's remaining calories
  useEffect(() => {
    const fetchTodayRemaining = async () => {
      if (!isAuthenticated) return;
      try {
        const todayStr = new Date().toISOString().split("T")[0];
        const plans = await mealPlanService.getAll({ startDate: todayStr, endDate: todayStr });
        const todayPlan = plans.find(p => new Date(p.date).toISOString().split("T")[0] === todayStr);
        const consumed = todayPlan?.totalCalories || 0;
        setRemainingCalories(Math.max(2000 - consumed, 0));
      } catch (err) {
        console.error("Failed to fetch remaining calories:", err);
      }
    };
    fetchTodayRemaining();
  }, [isAuthenticated, recipes]);

  const handleFilterChange = (filters) => {
    let cleanFilters = { ...filters };
    
    // Intercept smart sort token
    if (filters.taste && filters.taste.includes("__SMART_SORT__")) {
      setSmartSort(true);
      const filteredTastes = filters.taste
        .split(",")
        .filter(t => t !== "__SMART_SORT__")
        .join(",");
      cleanFilters.taste = filteredTastes || undefined;
    } else {
      setSmartSort(false);
    }
    
    fetchRecipes(cleanFilters);
  };

  // Dynamically sort recipes on the frontend to push matching ones to the top
  const sortedRecipes = useMemo(() => {
    if (!smartSort) return recipes;
    return [...recipes].sort((a, b) => {
      const aFits = a.calories <= remainingCalories;
      const bFits = b.calories <= remainingCalories;
      if (aFits && !bFits) return -1;
      if (!aFits && bFits) return 1;
      return 0;
    });
  }, [recipes, smartSort, remainingCalories]);

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>Discover Delicious Recipes</h1>
        <p>Browse, cook, and share recipes with our community</p>
      </div>

      <div className="home-content">
        <Sidebar onFilterChange={handleFilterChange} />
        <main className="home-main">
          {error && <div className="error-banner">{error}</div>}
          
          {smartSort && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-orange-700">
                ✨ Macro-Matched: Pushing recipes with under {remainingCalories} calories (your today's remaining target) to the top!
              </span>
            </div>
          )}
          
          <RecipeGrid recipes={sortedRecipes} loading={loading} />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
