import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { recipeService } from "../services/recipeService";
import RecipeForm from "../components/recipe/RecipeForm";

const EditRecipePage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getById(id);
        if (data.authorId !== user?.id) {
          setError("You do not have permission to edit this recipe.");
        } else {
          setRecipe({
            ...data,
            // Extract IDs for tags since RecipeForm expects an array of IDs
            tasteTags: data.tasteTags?.map(t => t.taste.id) || [],
            dietaryTags: data.dietaryTags?.map(d => d.tag.id) || [],
            ingredients: data.ingredients?.map(i => ({ name: i.ingredient.name, quantity: i.quantity })) || [{ name: "", quantity: "" }]
          });
        }
      } catch (err) {
        setError("Failed to load recipe.");
      } finally {
        setFetching(false);
      }
    };
    if (isAuthenticated) {
      fetchRecipe();
    } else {
      setFetching(false);
    }
  }, [id, isAuthenticated, user]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await recipeService.update(id, formData);
      navigate(`/recipe/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update recipe.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-auth-required">
        <h2>Please sign in to edit this recipe.</h2>
      </div>
    );
  }

  if (fetching) return <div className="page-loading">Loading recipe...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="add-recipe-page">
      <h1>Edit Recipe</h1>
      {error && <div className="error-banner">{error}</div>}
      {recipe && <RecipeForm onSubmit={handleSubmit} initialData={recipe} loading={loading} />}
    </div>
  );
};

export default EditRecipePage;
