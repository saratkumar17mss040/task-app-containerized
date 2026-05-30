import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FiSun, FiMoon, FiLogOut, FiUser } from "react-icons/fi";

/**
 * Header Component
 * Navigation bar with auth controls and theme toggle
 * Shows different options based on authentication and role
 */
const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Task Manager</h1>
        </Link>

        <nav className="nav">
          {user ? (
            <>
              <Link to="/" className="nav-link">
                Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  Admin Panel
                </Link>
              )}

              <div className="user-menu">
                <div className="user-info">
                  <FiUser className="user-icon" />
                  <span className="username">{user.username}</span>
                  {isAdmin && <span className="admin-badge">Admin</span>}
                </div>

                <button
                  onClick={toggleTheme}
                  className="icon-button"
                  title="Toggle theme"
                >
                  {isDarkMode ? <FiSun /> : <FiMoon />}
                </button>

                <button onClick={logout} className="icon-button" title="Logout">
                  <FiLogOut />
                </button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <button
                onClick={toggleTheme}
                className="icon-button"
                title="Toggle theme"
              >
                {isDarkMode ? <FiSun /> : <FiMoon />}
              </button>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
