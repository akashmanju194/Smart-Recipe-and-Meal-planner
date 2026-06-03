import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import IngredientInput from "./IngredientInput";
import PillTag from "../ui/PillTag";
import api from "../../services/api";
import { uploadService } from "../../services/uploadService";

const RecipeForm = ({ onSubmit, initialData = {}, loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    instructions: initialData.instructions || "",
    cookingTime: initialData.cookingTime || "",
    calories: initialData.calories || "",
    imageUrl: initialData.imageUrl || "",
    ingredients: initialData.ingredients || [{ name: "", quantity: "" }],
    tasteTags: initialData.tasteTags || [],
    dietaryTags: initialData.dietaryTags || [],
  });

  const [availableTaste, setAvailableTaste] = useState([]);
  const [availableDietary, setAvailableDietary] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl || "");

  // Fetch available tags from the database
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const [tasteRes, dietaryRes] = await Promise.all([
          api.get("/tags/taste"),
          api.get("/tags/dietary"),
        ]);
        setAvailableTaste(tasteRes.data);
        setAvailableDietary(dietaryRes.data);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
        // Fallback hardcoded tags
        setAvailableTaste([
          { id: 1, tasteName: "Spicy" }, { id: 2, tasteName: "Sweet" },
          { id: 3, tasteName: "Sour" }, { id: 4, tasteName: "Salty" },
          { id: 5, tasteName: "Bitter" }, { id: 6, tasteName: "Umami" },
          { id: 7, tasteName: "Savory" }, { id: 8, tasteName: "Tangy" },
        ]);
        setAvailableDietary([
          { id: 1, tagName: "Vegetarian" }, { id: 2, tagName: "Vegan" },
          { id: 3, tagName: "Gluten-Free" }, { id: 4, tagName: "Keto" },
          { id: 5, tagName: "Paleo" }, { id: 6, tagName: "Dairy-Free" },
          { id: 7, tagName: "Low-Carb" }, { id: 8, tagName: "High-Protein" },
        ]);
      }
    };
    fetchTags();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTasteTag = (id) => {
    const current = formData.tasteTags;
    const updated = current.includes(id) ? current.filter((t) => t !== id) : [...current, id];
    updateField("tasteTags", updated);
  };

  const toggleDietaryTag = (id) => {
    const current = formData.dietaryTags;
    const updated = current.includes(id) ? current.filter((t) => t !== id) : [...current, id];
    updateField("dietaryTags", updated);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const result = await uploadService.uploadImage(file);
      updateField("imageUrl", result.url);
      setImagePreview(result.url);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed. Please check your Cloudinary configuration.");
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="recipe-title">Recipe Title</label>
        <input id="recipe-title" type="text" value={formData.title} onChange={(e) => updateField("title", e.target.value)} required placeholder="E.g., Garlic Honey Chicken" />
      </div>

      {/* Image Upload */}
      <div className="form-group">
        <label>Recipe Image</label>
        <div className="image-upload-area">
          {imagePreview ? (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button type="button" className="btn-text" onClick={() => { setImagePreview(""); updateField("imageUrl", ""); }}>
                Remove
              </button>
            </div>
          ) : (
            <label className="image-upload-label" htmlFor="recipe-image-input">
              <Upload size={24} />
              <span>{uploading ? "Uploading..." : "Click to upload an image"}</span>
            </label>
          )}
          <input id="recipe-image-input" type="file" accept="image/*" onChange={handleImageUpload} hidden />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="recipe-instructions">Instructions</label>
        <textarea id="recipe-instructions" value={formData.instructions} onChange={(e) => updateField("instructions", e.target.value)} required rows={6} placeholder="Step-by-step instructions..." />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="recipe-time">Cooking Time (minutes)</label>
          <input id="recipe-time" type="number" value={formData.cookingTime} onChange={(e) => updateField("cookingTime", e.target.value)} required min="1" />
        </div>
        <div className="form-group">
          <label htmlFor="recipe-calories">Calories</label>
          <input id="recipe-calories" type="number" value={formData.calories} onChange={(e) => updateField("calories", e.target.value)} min="0" />
        </div>
      </div>

      <IngredientInput
        ingredients={formData.ingredients}
        onChange={(ingredients) => updateField("ingredients", ingredients)}
      />

      {/* Taste Tags */}
      <div className="form-group">
        <label>Taste Tags</label>
        <div className="pill-group">
          {availableTaste.map((tag) => (
            <PillTag
              key={tag.id}
              label={tag.tasteName}
              active={formData.tasteTags.includes(tag.id)}
              onClick={() => toggleTasteTag(tag.id)}
            />
          ))}
        </div>
      </div>

      {/* Dietary Tags */}
      <div className="form-group">
        <label>Dietary Tags</label>
        <div className="pill-group">
          {availableDietary.map((tag) => (
            <PillTag
              key={tag.id}
              label={tag.tagName}
              active={formData.dietaryTags.includes(tag.id)}
              onClick={() => toggleDietaryTag(tag.id)}
            />
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={loading || uploading}>
        {loading ? "Saving..." : "Save Recipe"}
      </button>
    </form>
  );
};

export default RecipeForm;
