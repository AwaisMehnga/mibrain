import { Suspense, useEffect } from 'react'
import { useRoutes, useLocation, useNavigate } from 'react-router'
import { routes } from './_routes'
import { useAuth } from '../mibrain/hooks/useAuth'

function ProtectedRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
  const { auth, isHydrated, isBootstrapped, actions } = useAuth()
  const element = useRoutes(routes)
  const currentPath = location.pathname
  const guestPaths = ['/setup/login', '/setup/register', '/setup/welcome']
  const onboardingPaths = ['/setup/conditions', '/setup/triggers', '/setup/medications', '/setup/notifications']

  useEffect(() => {
    if (isHydrated && !isBootstrapped) {
      void actions.bootstrapAuth()
      return
    }

    if (!isHydrated || !isBootstrapped) {
      return
    }

    if (auth.isAuthenticated && auth.isOnboarded && currentPath !== '/') {
      window.location.replace('/')
      return
    }

    if (auth.isAuthenticated && !auth.isOnboarded && !onboardingPaths.includes(currentPath)) {
      navigate('/setup/conditions', { replace: true })
      return
    }

    if (!auth.isAuthenticated && !guestPaths.includes(currentPath)) {
      navigate('/setup/register', { replace: true })
      return
    }
  }, [actions, auth.isAuthenticated, auth.isOnboarded, currentPath, isBootstrapped, isHydrated, navigate])

  if (!isHydrated || !isBootstrapped) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary">
        <div className="text-fg">Loading...</div>
      </div>
    )
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-primary">
      <div className="text-fg">Loading...</div>
    </div>}>
      {element}
    </Suspense>
  )
}

export default ProtectedRoutes
