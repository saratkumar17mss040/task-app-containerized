import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import toast from "react-hot-toast";

/**
 * Auth Context
 * Manages authentication state and provides auth-related functions
 * Handles user login, registration, logout, and token management
 */
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authService.getMe();
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await authService.register(username, email, password);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
