import { useState } from "react";

const WheelPicker = ({ value, onChange, label = "Cooking Time" }) => {
  const [hours, setHours] = useState(Math.floor((value || 0) / 60));
  const [minutes, setMinutes] = useState((value || 0) % 60);
  const [manualMode, setManualMode] = useState(false);

  const handleChange = (h, m) => {
    setHours(h);
    setMinutes(m);
    onChange?.(h * 60 + m);
  };

  if (manualMode) {
    return (
      <div className="wheel-picker">
        <label>{label}</label>
        <input
          type="number"
          placeholder="Total minutes"
          value={value || ""}
          onChange={(e) => onChange?.(parseInt(e.target.value) || 0)}
          min="0"
          className="wheel-picker-manual"
        />
        <button type="button" className="btn-text" onClick={() => setManualMode(false)}>
          Use Picker
        </button>
      </div>
    );
  }

  return (
    <div className="wheel-picker">
      <label>{label}</label>
      <div className="wheel-picker-selects">
        <select value={hours} onChange={(e) => handleChange(parseInt(e.target.value), minutes)}>
          {[...Array(24)].map((_, i) => (
            <option key={i} value={i}>{String(i).padStart(2, "0")} hrs</option>
          ))}
        </select>
        <span>:</span>
        <select value={minutes} onChange={(e) => handleChange(hours, parseInt(e.target.value))}>
          {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
            <option key={m} value={m}>{String(m).padStart(2, "0")} min</option>
          ))}
        </select>
      </div>
      <button type="button" className="btn-text" onClick={() => setManualMode(true)}>
        Enter manually
      </button>
    </div>
  );
};

export default WheelPicker;
