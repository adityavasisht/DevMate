import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRole?: 'DEVELOPER' | 'COMPANY'
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()

  // Show nothing while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  // Not logged in — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Wrong role — redirect to dashboard
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute