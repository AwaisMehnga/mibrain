import { Suspense, useEffect } from 'react'
import { useRoutes, useNavigate, useLocation } from 'react-router'
import { routes } from './_routes'
import { useAuth } from '../mibrain/hooks/useAuth'

function ProtectedRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
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

    if (auth.isAuthenticated && auth.isOnboarded) {
      navigate('/', { replace: true })
      return
    }
  }, [actions, auth.isAuthenticated, auth.isOnboarded, isBootstrapped, isHydrated, location.pathname, navigate])

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

