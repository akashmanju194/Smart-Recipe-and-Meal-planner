import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { recipeService } from "../services/recipeService";
import RecipeGrid from "../components/recipe/RecipeGrid";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await recipeService.search(query);
        setRecipes(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  }, [query]);

  return (
    <div className="search-results-page">
      <h1>Search Results for "{query}"</h1>
      <RecipeGrid recipes={recipes} loading={loading} />
    </div>
  );
};

export default SearchResultsPage;
