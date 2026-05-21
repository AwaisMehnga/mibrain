import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import NavBar from '../ui/components/nav-bar'
import Topbar from '../ui/components/topbar'
import Splash from '../mibrain/screens/splash'

export default function Layout() {
  const [showSplash, setShowSplash] = useState(true)
  const location = useLocation()
  const isPanicRoute = location.pathname === '/log/panic-attack'
  const isVoiceRoute = location.pathname === '/log/voice'
  const isCheckInRoute = location.pathname === '/check-in'
  const isHistoryDetailRoute = location.pathname.startsWith('/history/')
  const isFullscreenRoute = isPanicRoute || isVoiceRoute || isCheckInRoute || isHistoryDetailRoute

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col w-full h-screen bg-primary">
      <Splash isVisible={showSplash} />
      {!isFullscreenRoute && <Topbar />}
      <main className={`flex-1 overflow-y-auto ${isFullscreenRoute ? '' : 'pt-15 pb-21'}`}>
        <Outlet />
      </main>
      {!isFullscreenRoute && <NavBar />}
    </div>
  )
}
