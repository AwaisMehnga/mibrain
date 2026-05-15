import { Link } from 'react-router'
import {
  AlertTriangle,
  ArrowRight,
  Bolt,
  ClipboardCheck,
  Info,
  Plus,
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const riskScore = 72
const riskDays = 16
const riskLevel = {
  label: 'High Risk',
  color: 'text-sev-9',
}

const todayStats = [
  { label: 'Last attack', value: '3 days ago' },
  { label: 'This month', value: '4 attacks' },
  { label: 'Streak', value: '7 days' },
]

const recentAttacks = [
  {
    id: 'a1',
    day: 'MON',
    date: '12',
    time: '11:42 AM -> 4:04 PM',
    duration: '4h 22min',
    severity: 8,
    tags: ['Right temple', 'Aura'],
  },
  {
    id: 'a2',
    day: 'THU',
    date: '09',
    time: '8:15 PM -> 10:01 PM',
    duration: '1h 46min',
    severity: 6,
    tags: ['Behind eyes', 'Light sensitivity'],
  },
  {
    id: 'a3',
    day: 'SUN',
    date: '05',
    time: '6:30 AM -> 7:42 AM',
    duration: '1h 12min',
    severity: 5,
    tags: ['Forehead'],
  },
]

function severityClass(value) {
  if (value <= 2) return 'text-sev-1'
  if (value <= 4) return 'text-sev-3'
  if (value <= 6) return 'text-sev-5'
  if (value <= 8) return 'text-sev-7'
  return 'text-sev-9'
}

function RiskCard({ isNoData }) {
  if (isNoData) {
    return (
      <section className="rounded-lg bg-secondary p-5">
        <p className="text-[12px] uppercase tracking-widest text-fg-secondary">Risk Model</p>
        <h2 className="mt-2 text-[18px] font-semibold text-fg">
          Complete 3 days of logging to unlock your risk score
        </h2>
        <div className="mt-4 flex gap-2">
          <div className="h-2 flex-1 rounded-full bg-accent" />
          <div className="h-2 flex-1 rounded-full bg-tertiary" />
          <div className="h-2 flex-1 rounded-full bg-tertiary" />
        </div>
        <p className="mt-2 text-[12px] text-fg-secondary">Day 1 of 3</p>
      </section>
    )
  }

  const insightDaysRemaining = Math.max(14 - riskDays, 0)

  return (
    <section className="rounded-lg bg-secondary p-5">
      <div className="flex items-center justify-between">
        <p className="text-[12px] uppercase tracking-widest text-fg-secondary">Today's Risk Score</p>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-tertiary text-fg-secondary">
          <Info size={14} />
        </button>
      </div>

      {riskDays < 14 ? (
        <div className="mt-4">
          <p className="text-[20px] font-semibold text-fg">Building your model...</p>
          <p className="mt-1 text-[13px] text-fg-secondary">
            {insightDaysRemaining} days until your first insight
          </p>
          <div className="mt-3 h-2 w-full rounded-full bg-tertiary">
            <div className="h-2 rounded-full bg-accent" style={{ width: `${(riskDays / 14) * 100}%` }} />
          </div>
        </div>
      ) : (
        <>
          <p className={`mt-3 text-[64px] leading-none font-mono font-bold ${riskLevel.color}`}>{riskScore}</p>
          <p className={`mt-1 text-[16px] font-semibold ${riskLevel.color}`}>{riskLevel.label}</p>
          <p className="mt-2 text-[13px] text-fg-secondary">
            You slept 5.4h and pressure is rising in your area.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-warning/25 bg-warning/12 px-3 py-1 text-[12px] font-medium text-warning">
              Poor sleep
            </span>
            <span className="rounded-full border border-warning/25 bg-warning/12 px-3 py-1 text-[12px] font-medium text-warning">
              Rising pressure
            </span>
          </div>
        </>
      )}
    </section>
  )
}

function QuickActions() {
  return (
    <section className="grid grid-cols-3 gap-2.5">
      <Link to="/log/panic-attack" className="relative flex h-21.5 flex-col items-center justify-center gap-1 rounded-md border border-danger/30 bg-panic-btn/20 btn-press" aria-label="Log attack now">
        <span className="absolute w-9 h-9 rounded-full border border-danger/35 anim-pulse-ring" />
        <Bolt size={18} className="text-danger" />
        <span className="text-[13px] font-medium text-danger">Attack Now</span>
      </Link>

      <button className="relative flex h-21.5 flex-col items-center justify-center gap-1 rounded-md bg-tertiary btn-press">
        <ClipboardCheck size={18} className="text-fg-secondary" />
        <span className="text-[13px] font-medium text-fg-secondary">Check-in</span>
        <span className="absolute top-2 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold text-fg-inverse">
          !
        </span>
      </button>

      <button className="flex h-21.5 flex-col items-center justify-center gap-1 rounded-md bg-tertiary btn-press">
        <Plus size={18} className="text-fg-secondary" />
        <span className="text-[13px] font-medium text-fg-secondary">Log</span>
      </button>
    </section>
  )
}

function StatsRow() {
  return (
    <section className="overflow-x-auto">
      <div className="flex gap-3 min-w-max">
        {todayStats.map((item) => (
          <article key={item.label} className="min-w-28 rounded-md bg-secondary px-3 py-3 text-center">
            <p className="text-[11px] text-fg-secondary">{item.label}</p>
            <p className="mt-1 text-[16px] font-semibold text-fg">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function ActiveAttackBanner({ isActive }) {
  if (!isActive) return null

  return (
    <section className="flex items-center justify-between gap-3 rounded-md border border-danger/30 bg-danger/10 px-3 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-full bg-danger anim-accent-pulse" />
        <p className="truncate text-[14px] font-semibold text-danger">Attack in progress - 1h 24m</p>
      </div>
      <button className="shrink-0 rounded-full bg-danger px-3 py-1.5 text-[13px] font-medium text-fg">End Attack</button>
    </section>
  )
}

function InsightsTeaser({ isNoData }) {
  return (
    <section className="rounded-lg bg-secondary p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] uppercase tracking-widest text-fg-secondary">Your Top Pattern</p>
          {isNoData ? (
            <>
              <p className="mt-2 text-[14px] text-fg">Your first insight appears after 14 days of logging. You're on day 1.</p>
              <div className="mt-3 h-2 w-full rounded-full bg-tertiary">
                <div className="h-2 w-[7%] rounded-full bg-accent" />
              </div>
            </>
          ) : (
            <p className="mt-2 text-[14px] text-fg">Attacks are 3x more likely after less than 6.5h sleep</p>
          )}
        </div>
        <Link to="/insights" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tertiary text-fg-secondary">
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}

function RecentHistory({ isNoData }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-fg">Recent Attacks</h3>
        <Link to="/history" className="text-[13px] font-medium text-accent">
          See all
        </Link>
      </div>

      {isNoData ? (
        <div className="flex min-h-33 flex-col items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-8">
          <AlertTriangle size={24} className="text-fg-muted" />
          <p className="text-[13px] text-fg-muted">Your attacks will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentAttacks.map((attack) => (
            <article key={attack.id} className="flex min-h-16 items-center gap-3 rounded-md bg-secondary px-3 py-2">
              <div className="w-11 shrink-0 text-center">
                <p className="text-[10px] uppercase tracking-wide text-fg-muted">{attack.day}</p>
                <p className="text-[19px] leading-none font-mono font-bold text-fg">{attack.date}</p>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] text-fg-muted">{attack.time}</p>
                <p className="text-[12px] text-fg-secondary">{attack.duration}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {attack.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-tertiary px-2 py-0.5 text-[10px] text-fg-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className={`text-[22px] leading-none font-mono font-bold ${severityClass(attack.severity)}`}>
                {attack.severity}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default function Home() {
  const { auth } = useAuthStore()
  const isNoDataState = !auth?.isOnboarded
  const isAttackInProgress = !isNoDataState

  return (
    <div className="px-5 py-5 space-y-4 pb-8 anim-fade-in-up">
      <RiskCard isNoData={isNoDataState} />
      <QuickActions />
      <InsightsTeaser isNoData={isNoDataState} />
      <ActiveAttackBanner isActive={isAttackInProgress} />
      <StatsRow />
      <RecentHistory isNoData={isNoDataState} />
    </div>
  )
}
