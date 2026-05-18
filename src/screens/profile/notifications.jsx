import { ChevronLeft, Bell, Pill, Zap, Award, Calendar } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-accent' : 'bg-tertiary'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-fg transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function NotificationRow({ icon: Icon, label, detail, toggle, onToggle, onDetail }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-secondary p-4">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tertiary">
          <Icon size={16} className="text-fg-secondary" />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-fg">{label}</p>
          {detail && (
            <button onClick={onDetail} className="mt-1 text-[12px] text-accent">
              {detail}
            </button>
          )}
        </div>
      </div>
      <div className="shrink-0">
        <Toggle checked={toggle} onChange={onToggle} />
      </div>
    </div>
  )
}

export default function NotificationsSettings({ onBack }) {
  const preferences = useAuthStore((state) => state.preferences)
  const updatePreferences = useAuthStore((state) => state.updatePreferences)

  const [notificationsEnabled, setNotificationsEnabled] = useState(preferences.notificationsEnabled)
  const [riskAlertTime, setRiskAlertTime] = useState(preferences.riskAlertTime || '07:30')
  const [checkinTime, setCheckinTime] = useState(preferences.checkinTime || '08:00')
  const [weeklyEnabled, setWeeklyEnabled] = useState(true)
  const [milestonesEnabled, setMilestonesEnabled] = useState(true)

  const handleToggleMaster = (value) => {
    setNotificationsEnabled(value)
    updatePreferences({ notificationsEnabled: value })
  }

  return (
    <div className="px-5 py-5 pb-8 space-y-5 anim-fade-in-up">
      <header className="flex items-center gap-3">
        <button onClick={onBack} className="text-accent flex items-center gap-2">
          <ChevronLeft size={18} />
          <span className="text-[15px] font-semibold">Notifications</span>
        </button>
      </header>

      {/* Master toggle */}
      <div className="flex items-center justify-between rounded-lg bg-secondary p-5">
        <div>
          <p className="text-[14px] font-semibold text-fg">Enable Notifications</p>
          <p className="mt-1 text-[12px] text-fg-secondary">Receive alerts and reminders from mibrain</p>
        </div>
        <Toggle checked={notificationsEnabled} onChange={handleToggleMaster} />
      </div>

      {notificationsEnabled && (
        <div className="space-y-3">
          {/* Morning Risk Alert */}
          <NotificationRow
            icon={Zap}
            label="Morning Risk Alert"
            detail={`Time: ${riskAlertTime}`}
            toggle={true}
            onToggle={() => {}}
            onDetail={() => alert('Change time via settings')}
          />

          {/* Daily Check-in Reminder */}
          <NotificationRow
            icon={Bell}
            label="Daily Check-in Reminder"
            detail={`Time: ${checkinTime}`}
            toggle={true}
            onToggle={() => {}}
            onDetail={() => alert('Change time via settings')}
          />

          {/* Medication Reminders */}
          <NotificationRow
            icon={Pill}
            label="Medication Reminders"
            detail="Per your medication list"
            toggle={true}
            onToggle={() => {}}
            onDetail={() => alert('Configure per medication')}
          />

          {/* Weekly Summary */}
          <NotificationRow
            icon={Calendar}
            label="Weekly Summary"
            detail="Every Sunday morning"
            toggle={weeklyEnabled}
            onToggle={setWeeklyEnabled}
          />

          {/* Milestone Alerts */}
          <NotificationRow
            icon={Award}
            label="Milestone Alerts"
            detail="Attack-free & logging streaks"
            toggle={milestonesEnabled}
            onToggle={setMilestonesEnabled}
          />
        </div>
      )}

      {!notificationsEnabled && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-secondary p-8">
          <Bell size={32} className="text-fg-muted" />
          <p className="text-center text-[13px] text-fg-secondary">Notifications are disabled. Turn on the master toggle to configure them.</p>
        </div>
      )}
    </div>
  )
}
