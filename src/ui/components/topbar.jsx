import { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuthStore } from '../../stores/authStore'
import {
  Bell,
  TrendingUp,
  Sun,
  Trophy,
  Pill,
  ChevronLeft,
  Search,
  AlertTriangle,
} from 'lucide-react'

const routeMeta = {
  '/':         { title: null,         sub: null },
  '/log':      { title: 'Log Attack', sub: 'Detailed attack entry' },
  '/log/attack': { title: 'Log Attack', sub: 'Detailed attack entry' },
  '/log/end-attack': { title: 'End Attack', sub: 'Capture aftermath' },
  '/check-in': { title: null, sub: null },
  '/insights': { title: 'Insights',   sub: 'Patterns & trends' },
  '/insights/:trigger': { title: 'Insight Detail', sub: 'Trigger-specific analysis' },
  '/history':  { title: 'History',    sub: 'Past episodes' },
  '/profile':  { title: 'Profile',    sub: 'Your settings & data' },
}

const initialNotifications = [
  {
    id: 1, group: 'Today', icon: AlertTriangle,
    iconClass: 'text-danger', bgClass: 'bg-danger/12',
    title: 'High risk day detected',
    body: 'Your score is elevated this morning. Consider a low-stimulation schedule.',
    time: '7:15 AM', unread: true,
  },
  {
    id: 2, group: 'Today', icon: Sun, to: '/check-in',
    iconClass: 'text-warning', bgClass: 'bg-warning/12',
    title: 'Good morning! Time for your 30-second check-in',
    body: 'A quick check-in improves your prediction accuracy.',
    time: '8:00 AM', unread: true,
  },
  {
    id: 3, group: 'Today', icon: Pill,
    iconClass: 'text-[#6FA9FF]', bgClass: 'bg-[rgba(111,169,255,0.14)]',
    title: 'Time for Topiramate',
    body: 'Medication reminder based on your current schedule.',
    time: '9:00 AM', unread: false,
  },
  {
    id: 4, group: 'Today', icon: Trophy,
    iconClass: 'text-sev-5', bgClass: 'bg-sev-5/12',
    title: '7-day logging streak!',
    body: 'Consistency helps mibrain learn your patterns faster.',
    time: '10:24 AM', unread: false,
  },
  {
    id: 5, group: 'Earlier', icon: TrendingUp,
    iconClass: 'text-success', bgClass: 'bg-success/12',
    title: 'Lower risk trend this week',
    body: 'You had fewer high-severity entries than last week.',
    time: 'Yesterday', unread: false,
  },
  {
    id: 6, group: 'Earlier', icon: Pill,
    iconClass: 'text-warning', bgClass: 'bg-warning/12',
    title: 'Medication reminder',
    body: 'You skipped one scheduled entry this week.',
    time: 'May 11', unread: false,
  },
]

const groups = ['Today', 'Earlier']

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function userDisplayName(user) {
  if (!user?.name) return 'there'
  return user.name.split(' ')[0]
}

function NotificationsOverlay({ notifications, onMarkAllRead, onClose }) {
  const [query, setQuery] = useState('')

  const unreadCount = notifications.filter((n) => n.unread).length
  const readCount   = notifications.length - unreadCount

  const filtered = useMemo(() => {
    if (!query.trim()) return notifications
    const q = query.toLowerCase()
    return notifications.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    )
  }, [query, notifications])

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-primary anim-slide-up">

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 shrink-0 bg-primary/94 backdrop-blur-xl border-b border-accent/10"
        style={{
          height: 'calc(60px + env(safe-area-inset-top, 0px))',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <button onClick={onClose} className="flex items-center justify-center w-9 h-9">
          <ChevronLeft size={22} strokeWidth={2} className="text-fg" />
        </button>
        <span className="text-[15px] font-semibold text-fg">Notifications</span>
        <button
          onClick={onMarkAllRead}
          className={`text-[13px] font-medium ${unreadCount > 0 ? 'text-accent' : 'text-fg-muted'}`}
        >
          Mark all read
        </button>
      </div>

      {/* Summary strip */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/12 border border-accent/20">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="text-[12px] font-medium text-accent">{unreadCount} unread</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/4 border border-white/8">
          <div className="w-1.5 h-1.5 rounded-full bg-fg-muted" />
          <span className="text-[12px] font-medium text-fg-secondary">{readCount} read</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-5 py-3 shrink-0">
        <div className="flex items-center gap-3 px-4 h-11 rounded-xl bg-input border border-white/6">
          <Search size={16} strokeWidth={1.8} className="text-fg-muted shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notifications…"
            className="flex-1 bg-transparent outline-none text-[13px] text-fg caret-accent placeholder:text-fg-muted"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {groups.map((group) => {
          const items = filtered.filter((n) => n.group === group)
          if (!items.length) return null
          return (
            <div key={group} className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted mb-2">
                {group}
              </p>
              <div className="rounded-2xl overflow-hidden bg-secondary">
                {items.map((n, i) => {
                  const Icon = n.icon
                  const content = (
                    <>
                      <div className={`flex items-center justify-center w-9 h-9 shrink-0 rounded-full ${n.bgClass}`}>
                        <Icon size={17} strokeWidth={1.8} className={n.iconClass} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[13px] font-semibold leading-snug text-fg">
                            {n.title}
                          </span>
                          <span className="text-[11px] shrink-0 mt-0.5 text-fg-muted">{n.time}</span>
                        </div>
                        <p className="text-[12px] mt-1 leading-relaxed text-fg-secondary">{n.body}</p>
                      </div>
                    </>
                  )

                  const rowClass = `flex min-h-12 items-start gap-3 px-4 py-3 relative ${n.unread ? 'bg-secondary border-l-4 border-accent' : 'bg-primary'} ${i < items.length - 1 ? 'border-b border-white/4' : ''}`

                  return n.to ? (
                    <Link key={n.id} to={n.to} className={rowClass}>
                      {content}
                    </Link>
                  ) : (
                    <div key={n.id} className={rowClass}>
                      {content}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Search size={28} strokeWidth={1.4} className="text-fg-muted" />
            <p className="text-[13px] text-fg-muted">No notifications match "{query}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Topbar() {
  const { pathname } = useLocation()
  const user = useAuthStore((state) => state.auth.user)
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)

  let meta = routeMeta[pathname] ?? { title: null, sub: null }
  // Support parameterized routes (e.g. /insights/:trigger)
  if ((meta.title === null || meta.title === undefined) && pathname.startsWith('/insights/')) {
    meta = routeMeta['/insights/:trigger'] ?? meta
  }
  const isHome = pathname === '/'
  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 bg-primary/94 backdrop-blur-xl border-b border-accent/10"
        style={{
          height: 'calc(60px + env(safe-area-inset-top, 0px))',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        {isHome ? (
          <div className="flex flex-col justify-center gap-0.5">
            <span className="ext-[16px] font-semibold leading-tight text-fg">
              {greeting()}, {userDisplayName(user)}
            </span>
            <span className="text-[12px] leading-none text-fg-muted">Know before it hits.</span>
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-0.5">
            <span className="text-[16px] font-semibold leading-tight text-fg">{meta.title}</span>
            {meta.sub && <span className="text-[11px] leading-none text-fg-muted">{meta.sub}</span>}
          </div>
        )}

        <button
          onClick={() => setOpen(true)}
          className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-accent/8 border border-accent/14"
        >
          <Bell size={18} strokeWidth={1.7} className="text-fg-secondary" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-accent text-fg-inverse text-[9px] font-bold leading-none">
              {unreadCount}
            </span>
          )}
        </button>
      </header>

      {open && (
        <NotificationsOverlay
          notifications={notifications}
          onMarkAllRead={markAllRead}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
