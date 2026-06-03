const WeeklyGrid = ({ mealPlans, onSlotClick }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];

  return (
    <div className="weekly-grid">
      <div className="weekly-grid-header">
        <div className="grid-cell header-cell" />
        {days.map((day) => (
          <div key={day} className="grid-cell header-cell">{day}</div>
        ))}
      </div>
      {mealTypes.map((type) => (
        <div key={type} className="weekly-grid-row">
          <div className="grid-cell meal-type-cell">{type}</div>
          {days.map((day) => {
            const plan = mealPlans?.find((p) => {
              const d = new Date(p.date);
              return days[d.getDay() === 0 ? 6 : d.getDay() - 1] === day;
            });
            const items = plan?.items?.filter((i) => i.mealType === type) || [];
            return (
              <div
                key={`${type}-${day}`}
                className="grid-cell meal-slot"
                onClick={() => onSlotClick?.(day, type, plan)}
              >
                {items.map((item) => (
                  <div key={item.id} className="meal-slot-item">
                    {item.recipe?.title}
                  </div>
                ))}
                {items.length === 0 && <span className="meal-slot-empty">+</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WeeklyGrid;
