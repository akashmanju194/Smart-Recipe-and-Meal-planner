import { Search, ChefHat, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = ({ onAuthClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <ChefHat size={28} />
          <span>SmartRecipe</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search recipes, authors, tastes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/">Discover</Link>
          <Link to="/meal-planner">Meal Planner</Link>
          {isAuthenticated ? (
            <>
              <Link to="/add-recipe">Add Recipe</Link>
              <Link to={`/profile/${user?.username}`}>{user?.name}</Link>
              <button onClick={logout} className="btn-logout">Logout</button>
            </>
          ) : (
            <button onClick={onAuthClick} className="btn-login">Sign In</button>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
