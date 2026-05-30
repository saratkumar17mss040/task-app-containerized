import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import PrivateRoute from './components/PrivateRoute'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute roles={['admin']}>
            <AdminPanel />
          </PrivateRoute>
        } />
      </Routes>
    </Layout>
  )
}

export default App