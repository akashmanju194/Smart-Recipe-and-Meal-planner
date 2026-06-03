import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ratingService } from "../../services/ratingService";
import StarRating from "../ui/StarRating";

const RatingPanel = ({ recipeId, tasteTags = [], existingRatings = [], onRated }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Check if current user has already rated
  const hasRated = existingRatings.some(r => r.userId === user?.id);

  const [scores, setScores] = useState({
    tasteScore: 0,
    healthScore: 0,
    overallScore: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!isAuthenticated || hasRated) return;
    setLoading(true);
    setError("");
    try {
      const result = await ratingService.submitRating(recipeId, scores);
      onRated?.(result);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit rating.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <p className="rating-login-prompt">Sign in to rate this recipe.</p>;
  }

  return (
    <div className="rating-panel">
      <h4>Rate this Recipe</h4>
      {error && <div className="form-error">{error}</div>}
      {hasRated && <div style={{ color: 'var(--accent)', fontSize: '0.85rem', marginBottom: '12px' }}>You have already rated this recipe.</div>}

      {tasteTags.length > 0 && (
        <div className="rating-row">
          <span>Taste</span>
          <StarRating value={scores.tasteScore} onChange={(v) => !hasRated && setScores({ ...scores, tasteScore: v })} />
        </div>
      )}
      
      <div className="rating-row">
        <span>Health</span>
        <StarRating value={scores.healthScore} onChange={(v) => !hasRated && setScores({ ...scores, healthScore: v })} />
      </div>
      <div className="rating-row">
        <span>Overall</span>
        <StarRating value={scores.overallScore} onChange={(v) => !hasRated && setScores({ ...scores, overallScore: v })} />
      </div>

      <button onClick={handleSubmit} className="btn-primary" disabled={loading || hasRated}>
        {hasRated ? "Rated" : loading ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
};

export default RatingPanel;
