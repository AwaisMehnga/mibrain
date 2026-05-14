import { Outlet } from 'react-router'
import NavBar from './ui/components/nav-bar'
import Topbar from './ui/components/topbar'

export default function Layout() {
  return (
    <div className="flex flex-col w-full h-screen bg-primary">
      <Topbar />
      <main className="flex-1 overflow-y-auto pt-15 pb-21">
        <Outlet />
      </main>
      <NavBar />
    </div>
  )
}
