import { Suspense, useEffect } from 'react'
import { useRoutes, useLocation } from 'react-router'
import { routes } from './_routes'
import { useAuth } from './hooks/useAuth'

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
  }, [actions, auth.isAuthenticated, currentPath, isBootstrapped, isHydrated])

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
