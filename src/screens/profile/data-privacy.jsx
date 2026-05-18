import { ChevronLeft, Shield, Download, Trash2, BarChart3, FileText } from 'lucide-react'
import { useState } from 'react'

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

function InfoRow({ icon: Icon, label, detail }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-secondary p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tertiary">
        <Icon size={16} className="text-fg-secondary" />
      </div>
      <div>
        <p className="text-[13px] font-medium text-fg">{label}</p>
        {detail && <p className="mt-1 text-[12px] text-fg-secondary">{detail}</p>}
      </div>
    </div>
  )
}

function ActionRow({ icon: Icon, label, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg p-4 w-full text-left ${danger ? 'bg-danger/10' : 'bg-secondary'}`}
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${danger ? 'bg-danger/20' : 'bg-tertiary'}`}>
        <Icon size={16} className={danger ? 'text-danger' : 'text-fg-secondary'} />
      </div>
      <p className={`text-[13px] font-medium ${danger ? 'text-danger' : 'text-fg'}`}>{label}</p>
    </button>
  )
}

function LinkRow({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between rounded-lg bg-secondary p-4 w-full"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tertiary">
          <Icon size={16} className="text-fg-secondary" />
        </div>
        <p className="text-[13px] font-medium text-fg">{label}</p>
      </div>
      <p className="text-[12px] text-accent">→</p>
    </button>
  )
}

export default function DataPrivacy({ onBack }) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)

  const handleExportData = () => {
    alert('Export initiated. Check your downloads.')
  }

  const handleDeleteData = () => {
    if (confirm('This will permanently delete all your health data. This cannot be undone. Are you sure?')) {
      alert('Data deletion request submitted. We will delete your data within 30 days.')
    }
  }

  return (
    <div className="px-5 py-5 pb-8 space-y-5 anim-fade-in-up">
      <header className="flex items-center gap-3">
        <button onClick={onBack} className="text-accent flex items-center gap-2">
          <ChevronLeft size={18} />
          <span className="text-[15px] font-semibold">Data & Privacy</span>
        </button>
      </header>

      {/* Your Data Section */}
      <section className="space-y-3">
        <h3 className="text-[14px] font-semibold text-fg-secondary">Your Data</h3>

        <InfoRow
          icon={Shield}
          label="All your data is encrypted at rest and in transit"
          detail="Your health information is protected by industry-standard encryption."
        />

        <InfoRow
          icon={Shield}
          label="We never sell your health data"
          detail="Your privacy is our priority. We never monetize or share your personal health information."
        />

        <ActionRow
          icon={Download}
          label="Export all my data (CSV)"
          onClick={handleExportData}
        />

        <ActionRow
          icon={Trash2}
          label="Delete all my data"
          danger
          onClick={handleDeleteData}
        />
      </section>

      {/* Analytics Section */}
      <section className="space-y-3">
        <h3 className="text-[14px] font-semibold text-fg-secondary">Analytics</h3>

        <div className="flex items-start justify-between rounded-lg bg-secondary p-4">
          <div>
            <p className="text-[13px] font-medium text-fg">Help improve mibrain</p>
            <p className="mt-1 text-[12px] text-fg-secondary">Anonymous usage data helps us improve features</p>
          </div>
          <Toggle checked={analyticsEnabled} onChange={setAnalyticsEnabled} />
        </div>
      </section>

      {/* Links Section */}
      <section className="space-y-3">
        <h3 className="text-[14px] font-semibold text-fg-secondary">Legal</h3>

        <LinkRow
          icon={FileText}
          label="Privacy Policy"
          onClick={() => alert('Open in-app browser: Privacy Policy')}
        />

        <LinkRow
          icon={FileText}
          label="Terms of Service"
          onClick={() => alert('Open in-app browser: Terms of Service')}
        />
      </section>
    </div>
  )
}
