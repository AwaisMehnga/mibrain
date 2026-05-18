import { ChevronLeft, Bolt } from 'lucide-react'
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

function Slider({ min, max, value, onChange, label }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium text-fg">{label}</label>
        <span className="text-[13px] text-fg-secondary">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent"
      />
    </div>
  )
}

export default function PanicButtonSettings({ onBack }) {
  const [location, setLocation] = useState('home')
  const [severity, setSeverity] = useState(8)
  const [dnd, setDnd] = useState(false)
  const [dimScreen, setDimScreen] = useState(true)
  const [breathingGuide, setBreathingGuide] = useState(true)
  const [brightness, setBrightness] = useState(30)

  return (
    <div className="px-5 py-5 pb-8 space-y-5 anim-fade-in-up">
      <header className="flex items-center gap-3">
        <button onClick={onBack} className="text-accent flex items-center gap-2">
          <ChevronLeft size={18} />
          <span className="text-[15px] font-semibold">Panic Button</span>
        </button>
      </header>

      {/* Preview card */}
      <div className="flex items-center justify-center rounded-lg bg-secondary p-8">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-danger">
          <Bolt size={32} className="text-fg-inverse" />
        </div>
      </div>

      {/* Location */}
      <section className="space-y-3">
        <label className="text-[14px] font-semibold text-fg">Panic Button Location</label>
        <div className="flex gap-2">
          <button
            onClick={() => setLocation('home')}
            className={`flex-1 py-3 rounded-md text-[13px] font-medium ${
              location === 'home' ? 'bg-accent text-fg-inverse' : 'bg-tertiary text-fg-secondary'
            }`}
          >
            Home screen
          </button>
          <button
            onClick={() => setLocation('both')}
            className={`flex-1 py-3 rounded-md text-[13px] font-medium ${
              location === 'both' ? 'bg-accent text-fg-inverse' : 'bg-tertiary text-fg-secondary'
            }`}
          >
            Both + widget
          </button>
        </div>
      </section>

      {/* Default Severity */}
      <section className="rounded-lg bg-secondary p-4">
        <Slider min={1} max={10} value={severity} onChange={setSeverity} label="Quick Log Default Severity" />
        <p className="mt-2 text-[12px] text-fg-secondary">Pre-set severity so you can log with zero taps if needed</p>
      </section>

      {/* After Panic Log */}
      <section className="space-y-3">
        <label className="text-[14px] font-semibold text-fg">After Panic Log</label>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
            <p className="text-[13px] font-medium text-fg">Automatically enable Do Not Disturb</p>
            <Toggle checked={dnd} onChange={setDnd} />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
            <p className="text-[13px] font-medium text-fg">Dim screen to minimum brightness</p>
            <Toggle checked={dimScreen} onChange={setDimScreen} />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
            <p className="text-[13px] font-medium text-fg">Show breathing guide</p>
            <Toggle checked={breathingGuide} onChange={setBreathingGuide} />
          </div>
        </div>
      </section>

      {/* Panic Mode Brightness */}
      <section className="rounded-lg bg-secondary p-4">
        <Slider
          min={0}
          max={100}
          value={brightness}
          onChange={setBrightness}
          label={`Panic Mode Brightness: ${brightness === 0 ? 'Low' : brightness === 100 ? 'Normal' : 'Medium'}`}
        />
      </section>
    </div>
  )
}
