import { useNavigate } from 'react-router'
import { Sun, Pill, CheckCircle } from 'lucide-react'
import { useAuth } from '../../../../mibrain/hooks/useAuth'

export default function NotificationsPermission() {
  const navigate = useNavigate()
  const { actions } = useAuth()

  const handleEnable = () => {
    actions.updatePreferences({ notificationsEnabled: true })
    navigate('/setup/create-account')
  }

  const handleSkip = () => {
    navigate('/setup/create-account')
  }

  return (
    <div className="flex flex-col h-screen bg-primary">
      {/* Illustration Area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="notifGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7C6EF5" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#7C6EF5" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="195" cy="200" r="180" fill="url(#notifGlow)" />

          {/* Phone illustration */}
          <rect x="140" y="80" width="110" height="200" rx="12" fill="none" stroke="#8B92A8" strokeWidth="2" opacity="0.3" />
          <rect x="155" y="100" width="80" height="160" rx="4" fill="#7C6EF5" opacity="0.1" />

          {/* Notification bubble */}
          <g transform="translate(210, 140)">
            <ellipse cx="0" cy="0" rx="35" ry="25" fill="#7C6EF5" opacity="0.15" />
            <circle cx="30" cy="-15" r="8" fill="#7C6EF5" opacity="0.3" />
          </g>
        </svg>

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/15 mx-auto">
            <Sun size={40} className="text-accent" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-6 px-5 pb-12">
        <div className="space-y-4">
          <h2 className="text-[28px] font-display font-semibold text-fg leading-tight">
            Know before it hits.
          </h2>
          <p className="text-[15px] text-fg-secondary leading-relaxed">
            mibrain sends a morning risk alert when your patterns suggest a high-risk day. We also send gentle check-in reminders — never more than 2 notifications per day.
          </p>
        </div>

        {/* Value List */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Sun size={20} className="text-accent shrink-0" />
            <span className="text-[13px] text-fg-secondary">Morning risk score based on your patterns</span>
          </div>
          <div className="flex items-center gap-3">
            <Pill size={20} className="text-accent shrink-0" />
            <span className="text-[13px] text-fg-secondary">Medication reminders (if you choose)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-accent shrink-0" />
            <span className="text-[13px] text-fg-secondary">Daily check-in prompt (30 seconds)</span>
          </div>
        </div>

        {/* CTAs */}
        <button
          onClick={handleEnable}
          className="w-full h-14 bg-accent text-fg-inverse rounded-xl font-semibold text-[15px] transition-all duration-200 hover:bg-accent active:scale-95"
        >
          Enable Notifications
        </button>

        <button
          onClick={handleSkip}
          className="text-[14px] text-fg-muted hover:text-fg transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  )
}
