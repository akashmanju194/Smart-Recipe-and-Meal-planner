import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthModal from "./components/auth/AuthModal";

// Pages
import HomePage from "./pages/HomePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import AddRecipePage from "./pages/AddRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import MealPlannerPage from "./pages/MealPlannerPage";
import ProfilePage from "./pages/ProfilePage";
import SearchResultsPage from "./pages/SearchResultsPage";

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar onAuthClick={() => setAuthModalOpen(true)} />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipe/:id" element={<RecipeDetailPage />} />
              <Route path="/add-recipe" element={<AddRecipePage />} />
              <Route path="/recipe/:id/edit" element={<EditRecipePage />} />
              <Route path="/meal-planner" element={<MealPlannerPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
            </Routes>
          </main>
          <Footer />
          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
