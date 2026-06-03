import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { mealPlanService } from "../services/mealPlanService";
import { recipeService } from "../services/recipeService";
import CalorieTracker from "../components/meal-plan/CalorieTracker";
import Modal from "../components/ui/Modal";
import { Clock, Flame, Plus, Trash2 } from "lucide-react";
import { formatCookingTime } from "../utils/timeConverter";

const MealPlannerPage = () => {
  const { isAuthenticated } = useAuth();
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekDates, setWeekDates] = useState([]);
  const [targetCalories, setTargetCalories] = useState(2000);

  // Modal state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // { date, mealType, planId }
  const [allRecipes, setAllRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(false);

  const mealTypes = ["Breakfast", "Lunch", "Dinner"];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Calculate current week dates
  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    setWeekDates(dates);
  }, []);

  // Fetch meal plans for the current week
  const fetchPlans = useCallback(async () => {
    if (!isAuthenticated || weekDates.length === 0) return;
    setLoading(true);
    try {
      const startDate = weekDates[0].toISOString();
      const endDate = weekDates[6].toISOString();
      const data = await mealPlanService.getAll({ startDate, endDate });
      setMealPlans(data);
    } catch (err) {
      console.error("Failed to fetch meal plans:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, weekDates]);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  // Get items for a specific date + mealType
  const getItemsForSlot = (date, mealType) => {
    const dateStr = date.toISOString().split("T")[0];
    const plan = mealPlans.find((p) => {
      const planDateStr = new Date(p.date).toISOString().split("T")[0];
      return planDateStr === dateStr;
    });
    if (!plan) return { items: [], planId: null };
    const items = plan.items?.filter((i) => i.mealType === mealType) || [];
    return { items, planId: plan.id };
  };

  // Calculate today's calories
  const getTodayCalories = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const plan = mealPlans.find((p) => new Date(p.date).toISOString().split("T")[0] === todayStr);
    return plan?.totalCalories || 0;
  };

  // Open recipe picker
  const handleSlotClick = async (date, mealType) => {
    const { planId } = getItemsForSlot(date, mealType);
    setSelectedSlot({ date, mealType, planId });
    setPickerOpen(true);

    // Fetch recipes if not loaded
    if (allRecipes.length === 0) {
      setRecipesLoading(true);
      try {
        const data = await recipeService.getAll({ limit: 50 });
        setAllRecipes(data.recipes || []);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      } finally {
        setRecipesLoading(false);
      }
    }
  };

  // Add recipe to slot
  const handleAddRecipe = async (recipeId) => {
    if (!selectedSlot) return;

    try {
      let planId = selectedSlot.planId;

      // Create a meal plan for this date if it doesn't exist
      if (!planId) {
        const newPlan = await mealPlanService.create(selectedSlot.date.toISOString());
        planId = newPlan.id;
      }

      await mealPlanService.addItem(planId, recipeId, selectedSlot.mealType);
      setPickerOpen(false);
      setSelectedSlot(null);
      fetchPlans(); // Refresh
    } catch (err) {
      console.error("Failed to add recipe:", err);
      alert(err.response?.data?.error || "Failed to add recipe to meal plan.");
    }
  };

  // Remove item from slot
  const handleRemoveItem = async (planId, itemId) => {
    try {
      await mealPlanService.removeItem(planId, itemId);
      fetchPlans();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-auth-required">
        <h2>Please sign in to use the Meal Planner.</h2>
      </div>
    );
  }

  return (
    <div className="meal-planner-page">
      <h1>Meal Planner</h1>

      <CalorieTracker 
        totalCalories={getTodayCalories()} 
        targetCalories={targetCalories}
        onTargetChange={setTargetCalories}
      />

      {loading ? (
        <div className="page-loading">Loading meal plans...</div>
      ) : (
        <div className="weekly-grid">
          {/* Header row */}
          <div className="weekly-grid-header">
            <div className="grid-cell header-cell" />
            {weekDates.map((date, i) => (
              <div key={i} className="grid-cell header-cell">
                <div>{dayLabels[i]}</div>
                <div className="header-date">{date.getDate()}/{date.getMonth() + 1}</div>
              </div>
            ))}
          </div>

          {/* Meal type rows */}
          {mealTypes.map((type) => (
            <div key={type} className="weekly-grid-row">
              <div className="grid-cell meal-type-cell">{type}</div>
              {weekDates.map((date, i) => {
                const { items, planId } = getItemsForSlot(date, type);
                return (
                  <div key={i} className="grid-cell meal-slot" onClick={() => handleSlotClick(date, type)}>
                    {items.map((item) => (
                      <div key={item.id} className="meal-slot-item">
                        <span>{item.recipe?.title}</span>
                        <button
                          className="meal-item-remove"
                          onClick={(e) => { e.stopPropagation(); handleRemoveItem(planId, item.id); }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <span className="meal-slot-empty"><Plus size={18} /></span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Recipe Picker Modal */}
      <Modal
        isOpen={pickerOpen}
        onClose={() => { setPickerOpen(false); setSelectedSlot(null); }}
        title={`Add ${selectedSlot?.mealType || ""} Recipe`}
      >
        {recipesLoading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-dim)" }}>Loading recipes...</p>
        ) : (
          <div className="recipe-picker-list">
            {allRecipes.map((recipe) => (
              <div key={recipe.id} className="recipe-picker-item" onClick={() => handleAddRecipe(recipe.id)}>
                <div className="recipe-picker-info">
                  <h4>{recipe.title}</h4>
                  <div className="recipe-picker-meta">
                    <span><Clock size={12} /> {formatCookingTime(recipe.cookingTime)}</span>
                    <span><Flame size={12} /> {recipe.calories} cal</span>
                  </div>
                </div>
                <Plus size={18} className="recipe-picker-add" />
              </div>
            ))}
            {allRecipes.length === 0 && (
              <p style={{ textAlign: "center", padding: "20px", color: "var(--text-dim)" }}>No recipes found. Create some first!</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MealPlannerPage;
