import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to consume the AuthContext.
 * Provides: user, token, loading, login, register, logout, isAuthenticated
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
