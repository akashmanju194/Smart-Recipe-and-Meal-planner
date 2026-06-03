import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import RecipeGrid from "../components/recipe/RecipeGrid";

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/users/${username}`);
        setProfile(res.data.user);
        setRecipes(res.data.recipes);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("User not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <div className="page-loading">Loading profile...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="profile-page">
      {profile && (
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.profilePicUrl ? (
              <img src={profile.profilePicUrl} alt={profile.name} />
            ) : (
              <div className="profile-avatar-placeholder">{profile.name?.[0]}</div>
            )}
          </div>
          <h1>{profile.name}</h1>
          <p className="profile-username">@{profile.username}</p>
          {profile.profileBio && <p className="profile-bio">{profile.profileBio}</p>}
          <p className="profile-stats">{profile._count?.recipes || 0} recipes shared</p>
        </div>
      )}

      <div className="profile-recipes">
        <h2>Recipes by @{username}</h2>
        <RecipeGrid recipes={recipes} loading={false} />
      </div>
    </div>
  );
};

export default ProfilePage;
