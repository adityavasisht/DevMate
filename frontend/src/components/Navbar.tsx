import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold text-blue-600">
          DevMate
        </Link>

        <div className="flex items-center gap-6">
          {user?.role === 'DEVELOPER' && (
            <>
              <Link
                to="/jobs"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Browse Jobs
              </Link>
              <Link
                to="/profile"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                My Profile
              </Link>
            </>
          )}

          {user?.role === 'COMPANY' && (
            <Link
              to="/post-job"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Post a Job
            </Link>
          )}

          <div className="flex items-center gap-3">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {user?.role}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar