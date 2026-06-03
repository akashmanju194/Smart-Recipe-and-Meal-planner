const MealSlot = ({ items, mealType, onClick }) => {
  return (
    <div className="meal-slot-card" onClick={onClick}>
      <h5 className="meal-slot-type">{mealType}</h5>
      {items && items.length > 0 ? (
        items.map((item) => (
          <div key={item.id} className="meal-slot-recipe">
            <span>{item.recipe?.title}</span>
            <span className="meal-slot-cal">{item.recipe?.calories} cal</span>
          </div>
        ))
      ) : (
        <p className="meal-slot-placeholder">Click to add a meal</p>
      )}
    </div>
  );
};

export default MealSlot;
