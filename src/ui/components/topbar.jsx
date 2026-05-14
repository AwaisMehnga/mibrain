import { useState, useMemo } from 'react'
import { useLocation } from 'react-router'
import {
  Bell, BrainCircuit, TrendingUp, Droplets, Trophy, Pill,
  FileText, ChevronLeft, Search,
} from 'lucide-react'

const routeMeta = {
  '/':         { title: null,         sub: null },
  '/log':      { title: 'Log Pain',   sub: 'Record your migraine episode' },
  '/insights': { title: 'Insights',   sub: 'Patterns & trends' },
  '/history':  { title: 'History',    sub: 'Past episodes' },
  '/profile':  { title: 'Profile',    sub: 'Your settings & data' },
}

const initialNotifications = [
  {
    id: 1, group: 'Today', icon: BrainCircuit,
    iconClass: 'text-accent', bgClass: 'bg-accent/12',
    title: 'Migraine episode logged',
    body: 'Severity 7 — left temporal. Duration 4h 20m.',
    time: '2h ago', unread: true,
  },
  {
    id: 2, group: 'Today', icon: Droplets,
    iconClass: 'text-[#4CA8EF]', bgClass: 'bg-[rgba(76,168,239,0.12)]',
    title: 'Hydration reminder',
    body: "You've logged under 1L today. Dehydration is a common migraine trigger.",
    time: '5h ago', unread: true,
  },
  {
    id: 3, group: 'Yesterday', icon: TrendingUp,
    iconClass: 'text-success', bgClass: 'bg-success/12',
    title: 'New pattern detected',
    body: 'Attacks most often occur on Mondays between 8–10 AM. Check Insights.',
    time: 'Yesterday, 9:14 AM', unread: false,
  },
  {
    id: 4, group: 'Yesterday', icon: Pill,
    iconClass: 'text-warning', bgClass: 'bg-warning/12',
    title: 'Medication logged',
    body: 'Sumatriptan 50mg recorded at 11:30 PM.',
    time: 'Yesterday, 11:30 PM', unread: false,
  },
  {
    id: 5, group: 'This Week', icon: Trophy,
    iconClass: 'text-sev-5', bgClass: 'bg-sev-5/12',
    title: '7-day logging streak!',
    body: 'Consistent tracking helps uncover your triggers faster. Keep it up.',
    time: 'Mon, 8:00 AM', unread: false,
  },
  {
    id: 6, group: 'This Week', icon: FileText,
    iconClass: 'text-accent', bgClass: 'bg-accent/12',
    title: 'Weekly report ready',
    body: '3 episodes this week — down from 5 last week. View full report in Insights.',
    time: 'Sun, 9:00 AM', unread: false,
  },
  {
    id: 7, group: 'Earlier', icon: TrendingUp,
    iconClass: 'text-success', bgClass: 'bg-success/12',
    title: 'Sleep pattern linked',
    body: 'Episodes are 2× more likely after less than 6h of sleep.',
    time: '12 May', unread: false,
  },
  {
    id: 8, group: 'Earlier', icon: Pill,
    iconClass: 'text-warning', bgClass: 'bg-warning/12',
    title: "Medication reminder",
    body: "You haven't logged any medication in 3 days.",
    time: '11 May', unread: false,
  },
]

const groups = ['Today', 'Yesterday', 'This Week', 'Earlier']

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
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
        <div className="w-9" />
      </div>

      {/* Summary strip */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/12 border border-accent/20">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[12px] font-medium text-accent">{unreadCount} unread</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/4 border border-white/8">
            <div className="w-1.5 h-1.5 rounded-full bg-fg-muted" />
            <span className="text-[12px] font-medium text-fg-secondary">{readCount} read</span>
          </div>
        </div>
        <button
          onClick={onMarkAllRead}
          className={`text-[12px] font-medium transition-colors duration-200 ${unreadCount > 0 ? 'text-accent' : 'text-fg-muted'}`}
        >
          Mark all as read
        </button>
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
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-4 relative ${n.unread ? 'bg-accent/5' : ''} ${i < items.length - 1 ? 'border-b border-white/4' : ''}`}
                    >
                      {n.unread && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-accent" />
                      )}
                      <div className={`flex items-center justify-center w-10 h-10 shrink-0 rounded-xl ${n.bgClass}`}>
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
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)

  const meta = routeMeta[pathname] ?? { title: null, sub: null }
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
            <div className="flex items-center gap-1.5">
              <BrainCircuit size={18} className="text-accent" strokeWidth={1.8} />
              <span className="text-[15px] font-semibold tracking-tight text-fg">miBrain</span>
            </div>
            <span className="text-[12px] leading-none text-fg-muted">{greeting()}</span>
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
