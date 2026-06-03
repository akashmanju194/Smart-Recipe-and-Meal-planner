import { useState } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {mode === "login" ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <SignupForm onSuccess={onClose} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
