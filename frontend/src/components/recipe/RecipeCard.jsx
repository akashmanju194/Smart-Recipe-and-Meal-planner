import { useState } from "react";
import { Clock, Flame, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCookingTime } from "../../utils/timeConverter";
import AvatarZoomModal from "../ui/AvatarZoomModal";

const RecipeCard = ({ recipe }) => {
  const [zoomOpen, setZoomOpen] = useState(false);

  return (
    <>
      <div className="recipe-card">
        <Link to={`/recipe/${recipe.id}`} className="recipe-card-image-link">
          <div className="recipe-card-image">
            {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.title} />
            ) : (
              <div className="recipe-card-placeholder">🍽️</div>
            )}
          </div>
        </Link>

        <div className="recipe-card-body">
          <Link to={`/recipe/${recipe.id}`}>
            <h3 className="recipe-card-title">{recipe.title}</h3>
          </Link>

          <div className="recipe-card-stats">
            <span><Clock size={14} /> {formatCookingTime(recipe.cookingTime)}</span>
            <span><Flame size={14} /> {recipe.calories} cal</span>
            {recipe._count?.ratings > 0 && (
              <span><Star size={14} /> {recipe._count.ratings} ratings</span>
            )}
          </div>

          <div className="recipe-card-tags">
            {recipe.tasteTags?.map((tt) => (
              <span key={tt.taste.id} className="tag taste-tag">{tt.taste.tasteName}</span>
            ))}
          </div>

          <Link to={`/profile/${recipe.author?.username}`} className="recipe-card-author">
            {recipe.author?.profilePicUrl && (
              <img 
                src={recipe.author.profilePicUrl} 
                alt={recipe.author.name} 
                className="author-avatar-small cursor-zoom-in transition-transform hover:scale-110 active:scale-95" 
                title="Click to zoom profile picture"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setZoomOpen(true);
                }}
              />
            )}
            <span>{recipe.author?.name} <span className="author-handle">@{recipe.author?.username}</span></span>
          </Link>
        </div>
      </div>

      <AvatarZoomModal 
        isOpen={zoomOpen} 
        onClose={() => setZoomOpen(false)} 
        imageUrl={recipe.author?.profilePicUrl} 
        name={recipe.author?.name} 
        username={recipe.author?.username} 
      />
    </>
  );
};

export default RecipeCard;
