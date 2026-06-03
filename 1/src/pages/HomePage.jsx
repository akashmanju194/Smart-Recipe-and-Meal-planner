import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import RecipeGrid from "../components/recipe/RecipeGrid";
import { useRecipes } from "../hooks/useRecipes";

const HomePage = () => {
  const { recipes, loading, error, fetchRecipes } = useRecipes();

  const handleFilterChange = (filters) => {
    fetchRecipes(filters);
  };

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
          <RecipeGrid recipes={recipes} loading={loading} />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
