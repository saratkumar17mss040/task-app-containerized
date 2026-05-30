import { useState, useEffect } from "react";
import { userService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

/**
 * Admin Panel Component
 * Allows administrators to manage user roles
 * Lists all users with option to promote/demote
 */
const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <p>Manage user roles and permissions</p>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Actions</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className={user._id === currentUser._id ? "current-user" : ""}
              >
                <td>
                  <div className="user-cell">
                    <span className="user-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                    <span>{user.username}</span>
                    {user._id === currentUser._id && (
                      <span className="you-badge">You</span>
                    )}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td>
                  {user._id !== currentUser._id && (
                    <div className="role-actions">
                      {user.role === "user" ? (
                        <button
                          onClick={() => handleRoleChange(user._id, "admin")}
                          className="btn-promote"
                        >
                          Promote to Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user._id, "user")}
                          className="btn-demote"
                        >
                          Demote to User
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
