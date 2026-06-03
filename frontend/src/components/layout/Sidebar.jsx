import { useState } from "react";
import PillTag from "../ui/PillTag";

const Sidebar = ({ onFilterChange }) => {
  const [selectedTastes, setSelectedTastes] = useState([]);
  const [maxTime, setMaxTime] = useState("");
  const [selectedDietary, setSelectedDietary] = useState([]);

  const tasteTags = ["Spicy", "Sweet", "Sour", "Salty", "Bitter", "Umami", "Savory", "Tangy"];
  const dietaryTags = ["Vegetarian", "Vegan", "Gluten-Free", "Keto", "Paleo", "Dairy-Free", "Low-Carb", "High-Protein"];

  const applyFilters = (overrides = {}) => {
    const tastes = overrides.tastes ?? selectedTastes;
    const dietary = overrides.dietary ?? selectedDietary;
    const time = overrides.maxTime ?? maxTime;

    onFilterChange?.({
      taste: tastes.length > 0 ? tastes.join(",") : undefined,
      dietaryTag: dietary.length > 0 ? dietary.join(",") : undefined,
      maxTime: time ? time : undefined,
    });
  };

  const toggleTaste = (tag) => {
    const updated = selectedTastes.includes(tag)
      ? selectedTastes.filter((t) => t !== tag)
      : [...selectedTastes, tag];
    setSelectedTastes(updated);
    applyFilters({ tastes: updated });
  };

  const toggleDietary = (tag) => {
    const updated = selectedDietary.includes(tag)
      ? selectedDietary.filter((t) => t !== tag)
      : [...selectedDietary, tag];
    setSelectedDietary(updated);
    applyFilters({ dietary: updated });
  };

  const handleTimeChange = (value) => {
    setMaxTime(value);
    applyFilters({ maxTime: value });
  };

  const handleClearAll = () => {
    setSelectedTastes([]);
    setSelectedDietary([]);
    setMaxTime("");
    applyFilters({ tastes: [], dietary: [], maxTime: "" });
  };

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
        <h3 className="sidebar-title" style={{ marginBottom: 0 }}>Filters</h3>
        {(selectedTastes.length > 0 || selectedDietary.length > 0 || maxTime) && (
          <button onClick={handleClearAll} className="btn-text" style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
            Clear All
          </button>
        )}
      </div>
      <div className="sidebar-section">
        <h4>Taste Profile</h4>
        <div className="pill-group">
          {tasteTags.map((tag) => (
            <PillTag
              key={tag}
              label={tag}
              active={selectedTastes.includes(tag)}
              onClick={() => toggleTaste(tag)}
            />
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Dietary</h4>
        <div className="pill-group">
          {dietaryTags.map((tag) => (
            <PillTag
              key={tag}
              label={tag}
              active={selectedDietary.includes(tag)}
              onClick={() => toggleDietary(tag)}
            />
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Max Cooking Time (minutes)</h4>
        <input
          type="number"
          placeholder="e.g., 30"
          value={maxTime}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="sidebar-input"
          min="1"
        />
      </div>

      <div style={{ background: 'var(--bg-card-hover)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '16px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Smart Visual Planner
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="checkbox" 
            id="smart-sort"
            checked={selectedTastes.includes("__SMART_SORT__")} 
            onChange={(e) => {
              const updated = e.target.checked 
                ? [...selectedTastes, "__SMART_SORT__"] 
                : selectedTastes.filter(t => t !== "__SMART_SORT__");
              setSelectedTastes(updated);
              applyFilters({ tastes: updated });
            }}
            style={{ borderRadius: '4px', cursor: 'pointer', height: '16px', width: '16px', accentColor: 'var(--primary)' }}
          />
          <label htmlFor="smart-sort" style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', cursor: 'pointer' }}>
            Fit remaining calories first
          </label>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
