import { Suspense, useEffect } from 'react'
import { useRoutes, useNavigate, useLocation } from 'react-router'
import { routes } from './_routes'
import { useAuth } from './hooks/useAuth'

function ProtectedRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
  const { auth, onboarding } = useAuth()

  useEffect(() => {
    // Skip protection for setup routes
    if (location.pathname.startsWith('/setup')) {
      return
    }

    // If user is not onboarded, redirect to welcome
    if (!auth.isOnboarded) {
      navigate('/setup/welcome')
      return
    }

    // If user is not authenticated, redirect to signin
    if (!auth.isAuthenticated) {
      navigate('/setup/signin')
      return
    }
  }, [auth.isAuthenticated, auth.isOnboarded, location.pathname, navigate])

  const element = useRoutes(routes)

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-primary">
      <div className="text-fg">Loading...</div>
    </div>}>
      {element}
    </Suspense>
  )
}

export default ProtectedRoutes

