import { Flame } from "lucide-react";

const CalorieTracker = ({ totalCalories, targetCalories, onTargetChange }) => {
  const percentage = Math.min((totalCalories / targetCalories) * 100, 100);

  return (
    <div className="calorie-tracker">
      <div className="calorie-tracker-header">
        <Flame size={20} />
        <span>Daily Calories</span>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <input 
          type="range" 
          min="1000" 
          max="4000" 
          step="100" 
          value={targetCalories} 
          onChange={(e) => onTargetChange(parseInt(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>1000</span>
          <span>Target: {targetCalories} cal</span>
          <span>4000</span>
        </div>
      </div>

      <div className="calorie-bar-container">
        <div className="calorie-bar" style={{ width: `${percentage}%` }} />
      </div>
      <div className="calorie-numbers">
        <span>{totalCalories} cal</span>
        <span>/ {targetCalories} cal target</span>
      </div>
    </div>
  );
};

export default CalorieTracker;
