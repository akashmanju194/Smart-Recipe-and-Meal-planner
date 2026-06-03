import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { mealPlanService } from "../services/mealPlanService";
import { recipeService } from "../services/recipeService";
import Modal from "../components/ui/Modal";
import { Clock, Flame, Plus, Trash2, Settings2, Sparkles, ShieldAlert } from "lucide-react";
import { formatCookingTime } from "../utils/timeConverter";

const SVGCircularProgress = ({ value, target, label, unit, colorClass = "stroke-emerald-500" }) => {
  const percentage = Math.min((value / target) * 100, 100);
  const radius = 32;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isExceeded = value > target;
  
  const activeColor = isExceeded ? "stroke-red-500" : colorClass;

  return (
    <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)', minWidth: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s', boxShadow: 'var(--shadow)' }} className="hover:shadow-md">
      <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            className="fill-transparent"
            style={{ stroke: 'var(--border)' }}
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className={`${activeColor} fill-transparent transition-all duration-300 ease-in-out`}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute font-bold ${isExceeded ? 'text-red-500' : ''}`} style={{ fontSize: '10px', color: isExceeded ? undefined : 'var(--text)' }}>
          {Math.round(percentage)}%
        </span>
      </div>
      <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div className={`text-xs font-black ${isExceeded ? 'text-red-500' : ''}`} style={{ color: isExceeded ? undefined : 'var(--text)' }}>
        {value}/{target}{unit}
      </div>
    </div>
  );
};

const MealPlannerPage = () => {
  const { isAuthenticated } = useAuth();
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekDates, setWeekDates] = useState([]);
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  // Phase 2: Date Navigation Logic
  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date()));

  // Daily goals state
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 130,
    carbs: 250,
    fats: 70
  });

  // Modal state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // { date, mealType, planId }
  const [allRecipes, setAllRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(false);

  const mealTypes = ["Breakfast", "Lunch", "Dinner"];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Calculate dates based on currentWeekStart
  useEffect(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      dates.push(d);
    }
    setWeekDates(dates);

    // If current week contains today, set active day to today. Otherwise, Monday.
    const todayStr = new Date().toISOString().split("T")[0];
    const todayIdx = dates.findIndex(d => d.toISOString().split("T")[0] === todayStr);
    setActiveDayIdx(todayIdx !== -1 ? todayIdx : 0);
  }, [currentWeekStart]);

  const goToPreviousWeek = () => {
    setCurrentWeekStart(prev => {
      const nextDate = new Date(prev);
      nextDate.setDate(prev.getDate() - 7);
      return nextDate;
    });
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => {
      const nextDate = new Date(prev);
      nextDate.setDate(prev.getDate() + 7);
      return nextDate;
    });
  };

  const jumpToDate = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      setCurrentWeekStart(getMonday(date));
    }
  };

  // Fetch meal plans for the current week
  const fetchPlans = useCallback(async () => {
    if (!isAuthenticated || weekDates.length === 0) return;
    setLoading(true);
    try {
      const startDate = weekDates[0].toISOString();
      const endOfWeek = new Date(weekDates[6]);
      endOfWeek.setHours(23, 59, 59, 999);
      const endDate = endOfWeek.toISOString();
      
      const data = await mealPlanService.getAll({ startDate, endDate });
      setMealPlans(data);
    } catch (err) {
      console.error("Failed to fetch meal plans:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, weekDates]);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  // Calculate totals for the selected active day dynamically
  const activeDayTotals = useMemo(() => {
    const activeDate = weekDates[activeDayIdx];
    if (!activeDate || mealPlans.length === 0) {
      return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    }
    const dateStr = activeDate.toISOString().split("T")[0];
    const plan = mealPlans.find((p) => new Date(p.date).toISOString().split("T")[0] === dateStr);
    
    const totals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
    if (!plan || !plan.items) return totals;

    plan.items.forEach((item) => {
      if (item.recipe) {
        totals.calories += item.recipe.calories || 0;
        totals.protein += item.recipe.protein || 0;
        totals.carbs += item.recipe.carbs || 0;
        totals.fats += item.recipe.fats || 0;
      }
    });

    return totals;
  }, [activeDayIdx, weekDates, mealPlans]);

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

  // Open recipe picker
  const handleSlotClick = async (date, mealType) => {
    const { planId } = getItemsForSlot(date, mealType);
    setSelectedSlot({ date, mealType, planId });
    setPickerOpen(true);

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
      if (!planId) {
        const newPlan = await mealPlanService.create(selectedSlot.date.toISOString());
        planId = newPlan.id;
      }
      await mealPlanService.addItem(planId, recipeId, selectedSlot.mealType);
      setPickerOpen(false);
      setSelectedSlot(null);
      fetchPlans();
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
    <div className="meal-planner-page p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 style={{ color: 'var(--text)' }} className="text-3xl font-black tracking-tight flex items-center gap-2">
            Visual Macro Planner <Sparkles className="text-orange-500" size={24} />
          </h1>
          <p className="text-slate-500 text-sm">Track your dynamic targets beautifully in real-time.</p>
        </div>

      </div>

      {/* Unified Macro Dashboard */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} className="mb-6 p-8 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div style={{ background: 'var(--bg-card-hover)' }} className="p-4 rounded-2xl">
            <Flame size={32} className="text-orange-500 animate-pulse" />
          </div>
          <div>
            <h3 style={{ color: 'var(--text)' }} className="text-lg font-black">
              {weekDates[activeDayIdx] ? dayLabels[activeDayIdx] + " (" + weekDates[activeDayIdx].getDate() + "/" + (weekDates[activeDayIdx].getMonth() + 1) + ")" : ""} Dashboard
            </h3>
            <p style={{ color: 'var(--text-muted)' }} className="text-xs">Set targets and track dynamic macronutrient status.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Calories Column */}
          <div className="flex flex-col items-center gap-6">
            <input 
              type="range" min="1200" max="4000" step="50"
              value={goals.calories} 
              onChange={(e) => setGoals({...goals, calories: parseInt(e.target.value)})}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <SVGCircularProgress value={activeDayTotals.calories} target={goals.calories} label="Calories" unit="" colorClass="stroke-orange-500" />
          </div>

          {/* Protein Column */}
          <div className="flex flex-col items-center gap-4">
            <input 
              type="range" min="40" max="250" step="5"
              value={goals.protein} 
              onChange={(e) => setGoals({...goals, protein: parseInt(e.target.value)})}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <SVGCircularProgress value={activeDayTotals.protein} target={goals.protein} label="Protein" unit="g" colorClass="stroke-emerald-500" />
          </div>

          {/* Carbs Column */}
          <div className="flex flex-col items-center gap-4">
            <input 
              type="range" min="100" max="500" step="10"
              value={goals.carbs} 
              onChange={(e) => setGoals({...goals, carbs: parseInt(e.target.value)})}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <SVGCircularProgress value={activeDayTotals.carbs} target={goals.carbs} label="Carbs" unit="g" colorClass="stroke-orange-500" />
          </div>

          {/* Fats Column */}
          <div className="flex flex-col items-center gap-4">
            <input 
              type="range" min="30" max="150" step="5"
              value={goals.fats} 
              onChange={(e) => setGoals({...goals, fats: parseInt(e.target.value)})}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <SVGCircularProgress value={activeDayTotals.fats} target={goals.fats} label="Fats" unit="g" colorClass="stroke-emerald-500" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="page-loading">Loading meal plans...</div>
      ) : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} className="weekly-grid rounded-2xl shadow-sm overflow-hidden">
          {/* Header row */}
          <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }} className="weekly-grid-header">
            <div className="grid-cell header-cell" />
            {weekDates.map((date, i) => (
              <div 
                key={i} 
                style={activeDayIdx === i ? { background: 'var(--bg-card-hover)', borderBottom: '2px solid var(--primary)', fontWeight: 'bold' } : {}}
                className={`grid-cell header-cell cursor-pointer transition-all duration-200`}
                onClick={() => setActiveDayIdx(i)}
              >
                <div style={{ color: 'var(--text)' }} className="text-sm">{dayLabels[i]}</div>
                <div style={{ color: 'var(--text-muted)' }} className="header-date text-xs">{date.getDate()}/{date.getMonth() + 1}</div>
              </div>
            ))}
          </div>

          {/* Meal type rows */}
          {mealTypes.map((type) => (
            <div key={type} style={{ borderBottom: '1px solid var(--border)' }} className="weekly-grid-row last:border-0">
              <div style={{ color: 'var(--text)' }} className="grid-cell meal-type-cell font-bold text-sm">{type}</div>
              {weekDates.map((date, i) => {
                const { items, planId } = getItemsForSlot(date, type);
                return (
                  <div 
                    key={i} 
                    style={activeDayIdx === i ? { background: 'rgba(255, 255, 255, 0.05)' } : {}}
                    className={`grid-cell meal-slot min-h-[100px] p-3 transition-all duration-200`} 
                    onClick={() => handleSlotClick(date, type)}
                  >
                    {items.map((item) => (
                      <div key={item.id} style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)' }} className="meal-slot-item p-2 rounded-xl shadow-sm flex justify-between items-center group hover:-translate-y-0.5 transition-all duration-200">
                        <div className="flex flex-col">
                          <span style={{ color: 'var(--text)' }} className="text-xs font-bold">{item.recipe?.title}</span>
                          <span style={{ color: 'var(--text-muted)' }} className="text-[10px] flex items-center gap-1 mt-0.5">
                            <Flame size={10} /> {item.recipe?.calories} cal
                          </span>
                        </div>
                        <button
                          className="meal-item-remove p-1 text-slate-400 hover:text-red-500 transition-colors"
                          onClick={(e) => { e.stopPropagation(); handleRemoveItem(planId, item.id); }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <span className="meal-slot-empty flex items-center justify-center h-full text-slate-300 group-hover:text-orange-500 transition-colors">
                        <Plus size={18} />
                      </span>
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
                    {recipe.protein !== undefined && (
                      <span className="text-emerald-500 font-bold ml-2">P: {recipe.protein}g</span>
                    )}
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
