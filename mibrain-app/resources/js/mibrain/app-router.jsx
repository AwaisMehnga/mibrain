import { Suspense, useEffect } from 'react'
import { useRoutes, useLocation } from 'react-router'
import { routes } from './_routes'
import { useAuth } from './hooks/useAuth'
import Splash from '../ui/splash'

function ProtectedRoutes() {
  const location = useLocation()
  const { auth, isHydrated, isBootstrapped, actions } = useAuth()
  const element = useRoutes(routes)
  const currentPath = location.pathname

  useEffect(() => {
    if (isHydrated && !isBootstrapped) {
      void actions.bootstrapAuth()
      return
    }

    if (!isHydrated || !isBootstrapped) {
      return
    }

    if (!auth.isAuthenticated && currentPath !== '/setup/login') {
      window.location.replace('/setup/login')
      return
    }

    if (auth.isAuthenticated && !auth.isOnboarded) {
      window.location.replace('/setup/conditions')
      return
    }
  }, [actions, auth.isAuthenticated, auth.isOnboarded, currentPath, isBootstrapped, isHydrated])

  if (!isHydrated || !isBootstrapped) {
    return <Splash isVisible />
  }

  return (
    <Suspense fallback={<Splash isVisible />}>
      {element}
    </Suspense>
  )
}

export default ProtectedRoutes
