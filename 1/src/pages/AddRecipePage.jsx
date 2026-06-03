import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { recipeService } from "../services/recipeService";
import RecipeForm from "../components/recipe/RecipeForm";

const AddRecipePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    try {
      const recipe = await recipeService.create(formData);
      navigate(`/recipe/${recipe.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create recipe.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-auth-required">
        <h2>Please sign in to add a recipe.</h2>
      </div>
    );
  }

  return (
    <div className="add-recipe-page">
      <h1>Create a New Recipe</h1>
      {error && <div className="error-banner">{error}</div>}
      <RecipeForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default AddRecipePage;
