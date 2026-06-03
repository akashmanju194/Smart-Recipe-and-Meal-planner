import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Clock, Flame, Users, Star, Edit, Trash2 } from "lucide-react";
import { recipeService } from "../services/recipeService";
import { formatCookingTime } from "../utils/timeConverter";
import { useAuth } from "../hooks/useAuth";
import RatingPanel from "../components/recipe/RatingPanel";
import AuthorHoverCard from "../components/user/AuthorHoverCard";
import { useNavigate } from "react-router-dom";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getById(id);
        setRecipe(data);
      } catch (err) {
        console.error("Failed to load recipe:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <div className="page-loading">Loading recipe...</div>;
  if (!recipe) return <div className="page-error">Recipe not found.</div>;

  return (
    <div className="recipe-detail-page">
      <div className="recipe-detail-header">
        {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} className="recipe-detail-image" />}
        <h1>{recipe.title}</h1>
        <div className="recipe-detail-meta">
          <span><Clock size={16} /> {formatCookingTime(recipe.cookingTime)}</span>
          <span><Flame size={16} /> {recipe.calories} cal</span>
          <span><Users size={16} /> {recipe.totalRatings || 0} ratings</span>
          {recipe.averageRating?.overallScore && (
            <span><Star size={16} className="text-yellow-400" /> {recipe.averageRating.overallScore.toFixed(1)} Overall</span>
          )}
        </div>
        
        {isAuthenticated && user?.id === recipe.authorId && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
              onClick={() => navigate(`/recipe/${recipe.id}/edit`)}
            >
              <Edit size={16} /> Edit Recipe
            </button>
            <button 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--danger)' }}
              disabled={isDeleting}
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete this recipe?")) {
                  setIsDeleting(true);
                  try {
                    await recipeService.delete(recipe.id);
                    navigate('/');
                  } catch (err) {
                    alert("Failed to delete recipe.");
                    setIsDeleting(false);
                  }
                }
              }}
            >
              <Trash2 size={16} /> {isDeleting ? "Deleting..." : "Delete Recipe"}
            </button>
          </div>
        )}
      </div>

      <div className="recipe-detail-body">
        <div className="recipe-detail-main">
          <section className="recipe-section">
            <h2>Ingredients</h2>
            <ul className="ingredient-list">
              {recipe.ingredients?.map((ri) => (
                <li key={ri.ingredient.id}>
                  <strong>{ri.quantity}</strong> {ri.ingredient.name}
                </li>
              ))}
            </ul>
          </section>

          <section className="recipe-section">
            <h2>Instructions</h2>
            <div className="instructions-text">
              {recipe.instructions.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>

          <section className="recipe-section">
            <h2>Tags</h2>
            <div className="recipe-tags-display">
              {recipe.tasteTags?.map((tt) => (
                <span key={tt.taste.id} className="tag taste-tag">{tt.taste.tasteName}</span>
              ))}
              {recipe.dietaryTags?.map((dt) => (
                <span key={dt.tag.id} className="tag dietary-tag">{dt.tag.tagName}</span>
              ))}
            </div>
          </section>
        </div>

        <aside className="recipe-detail-sidebar">
          <AuthorHoverCard author={recipe.author} />
          <RatingPanel 
            recipeId={recipe.id} 
            tasteTags={recipe.tasteTags} 
            existingRatings={recipe.ratings} 
            onRated={(newRating) => {
              // Optimistically update the ratings list so it shows as rated
              setRecipe(prev => ({
                ...prev,
                ratings: [...prev.ratings, newRating]
              }));
            }} 
          />
        </aside>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
