import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Private Route Component
 * Protects routes that require authentication
 * Supports role-based access control
 */
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check role-based access
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PrivateRoute