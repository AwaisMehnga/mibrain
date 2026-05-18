import { Link, useNavigate } from 'react-router'
import {
  ChevronRight,
  Edit3,
  Eye,
  HelpCircle,
  LogOut,
  MessageSquareText,
  Shield,
  Settings2,
  Sparkles,
  UserCircle2,
  Bell,
  BrainCircuit,
  Pill,
  Loader2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { attacks } from '../history/history-data'
import HealthProfile from './health'
import NotificationsSettings from './notifications'
import PanicButtonSettings from './panic-button'
import DataPrivacy from './data-privacy'
import Subscription from './subscription'

function initialsFor(name) {
  if (!name) return 'MB'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function SectionLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-muted">{children}</p>
}

function StatCard({ label, value }) {
  return (
    <article className="flex-1 rounded-md bg-secondary px-4 py-4">
      <p className="text-[11px] text-fg-secondary">{label}</p>
      <p className="mt-1 text-[16px] font-semibold text-fg">{value}</p>
    </article>
  )
}

function Row({ icon: Icon, label, detail, to, danger, onClick, disabled }) {
  const shared = (
    <>
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tertiary">
            <Icon size={18} className={danger ? 'text-danger' : 'text-fg-secondary'} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className={`text-[14px] font-medium leading-tight ${danger ? 'text-danger' : 'text-fg'}`}>{label}</p>
          {detail && <p className="mt-0.5 text-[12px] text-fg-secondary">{detail}</p>}
        </div>
      </div>
      <ChevronRight size={18} className={danger ? 'text-danger/80' : 'text-fg-muted'} />
    </>
  )

  const classes = `flex h-12 items-center justify-between gap-3 rounded-md bg-secondary px-4 btn-press ${disabled ? 'opacity-70' : ''}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {shared}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={classes}>
      {shared}
    </button>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.auth.user)
  const logout = useAuthStore((state) => state.logout)
  const [signingOut, setSigningOut] = useState(false)
  const [activeScreen, setActiveScreen] = useState(null)

  const displayName = user?.name || 'Mibrain User'
  const avatarInitials = useMemo(() => initialsFor(displayName), [displayName])

  const loggingSince = 'Mar 2025'
  const attacksLogged = String(Math.max(attacks.length, 47))
  const proUntil = 'Mar 2026'

  async function handleSignOut() {
    setSigningOut(true)
    await new Promise((resolve) => setTimeout(resolve, 350))
    logout()
    navigate('/setup/signin', { replace: true })
  }

  // Show sub-screen if active
  if (activeScreen === 'health') return <HealthProfile onBack={() => setActiveScreen(null)} />
  if (activeScreen === 'notifications') return <NotificationsSettings onBack={() => setActiveScreen(null)} />
  if (activeScreen === 'panic') return <PanicButtonSettings onBack={() => setActiveScreen(null)} />
  if (activeScreen === 'privacy') return <DataPrivacy onBack={() => setActiveScreen(null)} />
  if (activeScreen === 'subscription') return <Subscription onBack={() => setActiveScreen(null)} />

  return (
    <div className="px-5 py-5 pb-8 space-y-5 anim-fade-in-up">
      <section className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/12 text-[15px] font-semibold text-accent">
            {avatarInitials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[17px] font-semibold leading-tight text-fg">{displayName}</h1>
              <span className="rounded-full bg-accent/12 px-2.5 py-1 text-[12px] font-medium text-accent">
                Pro member
              </span>
            </div>
            <p className="mt-1 text-[13px] text-fg-secondary">Your account overview and settings hub.</p>
          </div>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary"
          aria-label="Profile settings"
        >
          <Settings2 size={18} className="text-fg-secondary" />
        </button>
      </section>

      <section className="flex gap-3">
        <StatCard label="Logging since" value={loggingSince} />
        <StatCard label="Attacks logged" value={attacksLogged} />
        <StatCard label="Pro until" value={proUntil} />
      </section>

      <section className="space-y-2.5">
        <SectionLabel>My Health</SectionLabel>
        <div className="space-y-2.5">
          <Row icon={BrainCircuit} label="My Conditions" detail="Manage your diagnosed conditions" onClick={() => setActiveScreen('health')} />
          <Row icon={Sparkles} label="My Triggers" detail="Review your most common triggers" onClick={() => setActiveScreen('health')} />
          <Row icon={Pill} label="My Medications" detail="Acute and preventive medicines" onClick={() => setActiveScreen('health')} />
        </div>
      </section>

      <section className="space-y-2.5">
        <SectionLabel>App Settings</SectionLabel>
        <div className="space-y-2.5">
          <Row icon={Bell} label="Notifications" detail="Reminders, alerts, and risk notices" onClick={() => setActiveScreen('notifications')} />
          <Row icon={Shield} label="Panic Button" detail="Fast access to emergency logging" onClick={() => setActiveScreen('panic')} />
          <Row icon={Eye} label="Data & Privacy" detail="Data export, backup, and visibility" onClick={() => setActiveScreen('privacy')} />
          <Row icon={UserCircle2} label="Doctor Reports" detail="Generate shareable visit summaries" to="/report" />
        </div>
      </section>

      <section className="space-y-2.5">
        <SectionLabel>Account</SectionLabel>
        <div className="space-y-2.5">
          <Row icon={Edit3} label="Edit Profile" detail="Update your name and photo" disabled />
          <Row icon={Shield} label="Change Password" detail="Keep your account secure" disabled />
          <Row icon={Sparkles} label="Subscription" detail="Manage your Pro plan" onClick={() => setActiveScreen('subscription')} />
          <Row icon={HelpCircle} label="Help & Support" detail="Get answers and contact support" disabled />
          <Row icon={MessageSquareText} label="Send Feedback" detail="Share product feedback" disabled />
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex h-12 items-center justify-between gap-3 rounded-md bg-secondary px-4 btn-press"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-danger/12">
                {signingOut ? <Loader2 size={18} className="animate-spin text-danger" /> : <LogOut size={18} className="text-danger" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium leading-tight text-danger">Sign Out</p>
                <p className="mt-0.5 text-[12px] text-fg-secondary">Log out of your account</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-danger/80" />
          </button>
        </div>
      </section>
    </div>
  )
}
