import { useState } from "react";
import { Upload } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { uploadService } from "../../services/uploadService";

const SignupForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    profileBio: "",
    profilePicUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(formData);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const result = await uploadService.uploadImage(file);
      updateField("profilePicUrl", result.url);
      setAvatarPreview(result.url);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Image upload failed. Check Cloudinary config.");
      setAvatarPreview("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      {/* Profile Picture */}
      <div className="form-group" style={{ alignItems: "center" }}>
        <label>Profile Picture (optional)</label>
        <label className="avatar-upload-label" htmlFor="signup-avatar-input">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="avatar-upload-preview" />
          ) : (
            <div className="avatar-upload-placeholder">
              <Upload size={20} />
              <span>{uploading ? "..." : "Upload"}</span>
            </div>
          )}
        </label>
        <input id="signup-avatar-input" type="file" accept="image/*" onChange={handleAvatarUpload} hidden />
      </div>

      <div className="form-group">
        <label htmlFor="signup-name">Full Name</label>
        <input id="signup-name" type="text" value={formData.name} onChange={(e) => updateField("name", e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="signup-username">Username</label>
        <input id="signup-username" type="text" value={formData.username} onChange={(e) => updateField("username", e.target.value)} required minLength={3} maxLength={30} />
      </div>
      <div className="form-group">
        <label htmlFor="signup-email">Email</label>
        <input id="signup-email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="signup-password">Password</label>
        <input id="signup-password" type="password" value={formData.password} onChange={(e) => updateField("password", e.target.value)} required minLength={6} />
      </div>
      <div className="form-group">
        <label htmlFor="signup-bio">Bio (optional)</label>
        <textarea id="signup-bio" value={formData.profileBio} onChange={(e) => updateField("profileBio", e.target.value)} placeholder="Tell us about yourself..." rows={3} />
      </div>
      <button type="submit" className="btn-primary" disabled={loading || uploading}>
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
};

export default SignupForm;
