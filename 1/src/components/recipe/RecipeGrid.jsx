import RecipeCard from "./RecipeCard";

const RecipeGrid = ({ recipes, loading }) => {
  if (loading) {
    return (
      <div className="recipe-grid-loading">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="recipe-card-skeleton" />
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="recipe-grid-empty">
        <p>No recipes found. Try adjusting your filters!</p>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeGrid;
