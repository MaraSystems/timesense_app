import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth"

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Route guard component that requires authentication.
 * Redirects unauthenticated users to the login page while preserving the intended destination.
 * Shows a loading spinner while authentication state is being determined.
 * @param children - Child components to render if authenticated
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0052FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#6B7280]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}