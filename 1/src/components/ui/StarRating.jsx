import { Star } from "lucide-react";

const StarRating = ({ value = 0, onChange, max = 5, size = 20 }) => {
  return (
    <div className="star-rating">
      {[...Array(max)].map((_, i) => (
        <button
          key={i}
          type="button"
          className={`star-btn ${i < value ? "star-filled" : "star-empty"}`}
          onClick={() => onChange?.(i + 1)}
        >
          <Star size={size} />
        </button>
      ))}
      <span className="star-value">{value}/{max}</span>
    </div>
  );
};

export default StarRating;
