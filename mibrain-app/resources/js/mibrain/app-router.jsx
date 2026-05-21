import { Suspense, useEffect } from 'react'
import { useRoutes, useLocation, useNavigate } from 'react-router'
import { routes } from './_routes'
import { useAuth } from './hooks/useAuth'

function ProtectedRoutes() {
  const location = useLocation()
  const navigate = useNavigate()
  const { auth, isHydrated, isBootstrapped, actions } = useAuth()
  const element = useRoutes(routes)

  useEffect(() => {
    if (isHydrated && !isBootstrapped) {
      void actions.bootstrapAuth()
      return
    }

    if (!isHydrated || !isBootstrapped) {
      return
    }

    if (!auth.isAuthenticated) {
      navigate('/setup/login', { replace: true })
      return
    }

    if (!auth.isOnboarded) {
      navigate('/setup/welcome', { replace: true })
      return
    }
  }, [actions, auth.isAuthenticated, auth.isOnboarded, isBootstrapped, isHydrated, navigate, location.pathname])

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

