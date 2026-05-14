import { BrainCircuit, TrendingUp, Droplets, Trophy, FileText, Pill } from 'lucide-react'

const notifications = [
  {
    id: 1,
    group: 'Today',
    items: [
      {
        id: 'n1',
        icon: BrainCircuit,
        color: '#7C6EF5',
        colorBg: 'rgba(124,110,245,0.12)',
        title: 'Migraine episode logged',
        body: 'Severity 7 — left temporal. Duration 4h 20m.',
        time: '2h ago',
        unread: true,
      },
      {
        id: 'n2',
        icon: Droplets,
        color: '#4CA8EF',
        colorBg: 'rgba(76,168,239,0.12)',
        title: 'Hydration reminder',
        body: 'You\'ve logged under 1L today. Dehydration is a common trigger.',
        time: '5h ago',
        unread: true,
      },
    ],
  },
  {
    id: 2,
    group: 'Yesterday',
    items: [
      {
        id: 'n3',
        icon: TrendingUp,
        color: '#4CAF7D',
        colorBg: 'rgba(76,175,125,0.12)',
        title: 'New pattern detected',
        body: 'Your attacks most often occur on Mondays between 8–10 AM. Check Insights.',
        time: 'Yesterday, 9:14 AM',
        unread: false,
      },
      {
        id: 'n4',
        icon: Pill,
        color: '#FFB74D',
        colorBg: 'rgba(255,183,77,0.12)',
        title: 'Medication logged',
        body: 'Sumatriptan 50mg recorded at 11:30 PM.',
        time: 'Yesterday, 11:30 PM',
        unread: false,
      },
    ],
  },
  {
    id: 3,
    group: 'This Week',
    items: [
      {
        id: 'n5',
        icon: Trophy,
        color: '#FFD54F',
        colorBg: 'rgba(255,213,79,0.12)',
        title: '7-day logging streak!',
        body: 'Consistent tracking helps uncover your triggers faster. Keep it up.',
        time: 'Mon, 8:00 AM',
        unread: false,
      },
      {
        id: 'n6',
        icon: FileText,
        color: '#7C6EF5',
        colorBg: 'rgba(124,110,245,0.12)',
        title: 'Weekly report ready',
        body: '3 episodes this week — down from 5 last week. View in Insights.',
        time: 'Sun, 9:00 AM',
        unread: false,
      },
    ],
  },
]

function NotificationItem({ item }) {
  const Icon = item.icon
  return (
    <div
      className="flex items-start gap-3 px-5 py-4 relative"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: item.unread ? 'rgba(124,110,245,0.04)' : 'transparent',
      }}
    >
      {/* Unread dot */}
      {item.unread && (
        <div
          className="absolute left-2 rounded-full"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            width: 5,
            height: 5,
            background: 'var(--color-accent)',
          }}
        />
      )}

      {/* Icon */}
      <div
        className="flex items-center justify-center shrink-0 rounded-xl"
        style={{
          width: 42,
          height: 42,
          background: item.colorBg,
        }}
      >
        <Icon size={18} strokeWidth={1.8} style={{ color: item.color }} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span
            className="text-[13px] font-semibold leading-snug"
            style={{ color: 'var(--color-primary)' }}
          >
            {item.title}
          </span>
          <span
            className="text-[11px] shrink-0 mt-0.5"
            style={{ color: 'var(--color-muted)' }}
          >
            {item.time}
          </span>
        </div>
        <p
          className="text-[12px] mt-0.5 leading-snug"
          style={{ color: 'var(--color-secondary)' }}
        >
          {item.body}
        </p>
      </div>
    </div>
  )
}

export default function Notifications() {
  const unreadCount = notifications.flatMap((g) => g.items).filter((n) => n.unread).length

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Mark all read row */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
          {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        </span>
        {unreadCount > 0 && (
          <button
            className="text-[12px] font-medium"
            style={{ color: 'var(--color-accent)' }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Groups */}
      {notifications.map((group) => (
        <div key={group.id}>
          <div
            className="px-5 py-2"
            style={{ background: 'var(--color-bg)' }}
          >
            <span
              className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-muted)' }}
            >
              {group.group}
            </span>
          </div>
          <div style={{ background: 'var(--color-surface)' }}>
            {group.items.map((item) => (
              <NotificationItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
