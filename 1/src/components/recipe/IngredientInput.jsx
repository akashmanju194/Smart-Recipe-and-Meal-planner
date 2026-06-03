import { Plus, Trash2 } from "lucide-react";

const IngredientInput = ({ ingredients, onChange }) => {
  const addIngredient = () => {
    onChange([...ingredients, { name: "", quantity: "" }]);
  };

  const removeIngredient = (index) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index, field, value) => {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    onChange(updated);
  };

  return (
    <div className="ingredient-input-group">
      <label>Ingredients</label>
      {ingredients.map((ing, index) => (
        <div key={index} className="ingredient-row">
          <input
            type="text"
            placeholder="Ingredient name"
            value={ing.name}
            onChange={(e) => updateIngredient(index, "name", e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Quantity (e.g., 2 cups)"
            value={ing.quantity}
            onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
            required
          />
          {ingredients.length > 1 && (
            <button type="button" onClick={() => removeIngredient(index)} className="btn-icon-danger">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addIngredient} className="btn-add-ingredient">
        <Plus size={16} /> Add Ingredient
      </button>
    </div>
  );
};

export default IngredientInput;
