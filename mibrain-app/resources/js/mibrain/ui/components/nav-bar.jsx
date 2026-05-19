import { Link, useLocation } from 'react-router'
import { House, Plus, Activity, History, CircleUser } from 'lucide-react'

const navItems = [
  { path: '/',         label: 'Home',     icon: House      },
  { path: '/insights', label: 'Insights', icon: Activity   },
  { path: '/log',      label: 'Log Pain', icon: Plus, squircle: true },
  { path: '/history',  label: 'History',  icon: History    },
  { path: '/profile',  label: 'Profile',  icon: CircleUser },
]

function TabButton({ path, label, icon: Icon, isActive, squircle }) {
  return (
    <Link
      to={path}
      className="flex flex-col items-center justify-center flex-1 h-full no-underline gap-1"
      aria-current={isActive ? 'page' : undefined}
    >
      <div
        className={`flex items-center justify-center w-11 h-11 transition-colors duration-200 ${
          squircle
            ? 'rounded-[26.5%] bg-accent'
            : `rounded-xl ${isActive ? 'bg-accent/14' : 'bg-transparent'}`
        }`}
      >
        <Icon
          size={squircle ? 22 : 20}
          strokeWidth={squircle ? 2.5 : isActive ? 2 : 1.6}
          className={`transition-colors duration-200 ${
            squircle ? 'text-fg-inverse' : isActive ? 'text-accent' : 'text-fg-secondary'
          }`}
        />
      </div>
      <span className={`text-[10px] font-medium leading-none transition-colors duration-200 ${isActive ? 'text-accent' : 'text-fg-muted'}`}>
        {label}
      </span>
    </Link>
  )
}

export default function NavBar() {
  const location = useLocation()
  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center bg-primary/94 backdrop-blur-xl border-t border-accent/12"
      style={{
        height: 'calc(72px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {navItems.map((item) => (
        <TabButton key={item.path} {...item} isActive={isActive(item.path)} />
      ))}
    </nav>
  )
}
