import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Check, ChevronLeft, Mic, Plus, HeartPulse, Weight, Zap, Flame, ChevronsLeftRight, Waves } from 'lucide-react'
import face from '../../../assets/face.webp'

const painTypes = [
  { label: 'Throbbing', icon: HeartPulse },
  { label: 'Pressing', icon: Weight },
  { label: 'Stabbing', icon: Zap },
  { label: 'Burning', icon: Flame },
  { label: 'Squeezing', icon: ChevronsLeftRight },
  { label: 'Pulsing', icon: Waves },
]
const symptoms = [
  'Nausea',
  'Vomiting',
  'Light sensitivity',
  'Sound sensitivity',
  'Aura',
  'Neck stiffness',
  'Dizziness',
  'Fatigue',
  'Brain fog',
]
const auraTypes = [
  'Zigzag lines',
  'Blind spot',
  'Blurry vision',
  'Flashing lights',
  'Tingling',
  'Difficulty speaking',
]
const initialMedications = ['Rizatriptan', 'Ibuprofen', 'Naproxen', 'Topiramate']
const triggers = [
  'Poor sleep',
  'Stress',
  'Dehydration',
  'Skipped meal',
  'Bright light',
  'Screen time',
  'Weather shift',
  'Caffeine',
  'Hormones',
  'Alcohol',
  'Strong smells',
  'Exercise',
]
const locations = [
  { label: 'Left temple', x: 20, y: 36, size: 25 },
  { label: 'Right temple', x: 75, y: 36, size: 25 },
  { label: 'Forehead', x: 48, y: 30, size: 25 },
  { label: 'Behind eyes', x: 48, y: 44, size: 25 },
  { label: 'Back of head', x: 48, y: 8, size: 25 },
  { label: 'Top of head', x: 48, y: 0, size: 25 },
  { label: 'Left jaw', x: 30, y: 73, size: 25 },
  { label: 'Right jaw', x: 66, y: 73, size: 25 },
]

function todayValue() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

function formatDateTime(value, includeDate = true) {
  const date = value ? new Date(value) : new Date()
  const formatter = new Intl.DateTimeFormat('en', {
    weekday: includeDate ? 'short' : undefined,
    month: includeDate ? 'short' : undefined,
    day: includeDate ? 'numeric' : undefined,
    hour: 'numeric',
    minute: '2-digit',
  })
  const today = new Date()
  const sameDay = date.toDateString() === today.toDateString()
  const time = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date)
  if (sameDay) return `Today, ${time}`
  return formatter.format(date)
}

function severityMeta(value) {
  if (value <= 3) return { label: 'Mild', color: 'text-sev-1' }
  if (value <= 6) return { label: 'Moderate', color: 'text-sev-5' }
  if (value <= 8) return { label: 'Severe', color: 'text-sev-7' }
  return { label: 'Unbearable', color: 'text-sev-9' }
}

function sectionTitle(title, subtitle) {
  return (
    <div className="space-y-1">
      <p className="text-[12px] font-semibold uppercase tracking-widest text-fg-muted">{title}</p>
      {subtitle && <p className="text-[12px] text-fg-muted">{subtitle}</p>}
    </div>
  )
}

function ToggleChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`shrink-0 rounded-sm border px-4 py-2.5 text-[13px] font-medium transition-all duration-200 btn-press ${
        selected
          ? 'border-accent bg-accent/12 text-accent'
          : 'border-transparent bg-tertiary text-fg-secondary'
      }`}
    >
      {label}
    </button>
  )
}

function ChipGroup({ options, selected, onToggle, wrap = true }) {
  return (
    <div className={wrap ? 'flex flex-wrap gap-2' : 'flex gap-2 overflow-x-auto pb-1'}>
      {options.map((option) => (
        <ToggleChip
          key={option}
          label={option}
          selected={selected.includes(option)}
          onClick={() => onToggle(option)}
        />
      ))}
    </div>
  )
}

function DoseInput({ med, value, onChange }) {
  return (
    <div className="flex min-h-14 items-center gap-3 rounded-md bg-input px-4">
      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-fg">{med}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="100mg"
        className="h-10 w-24 rounded-sm border border-white/6 bg-tertiary px-3 font-mono text-[13px] text-fg outline-none placeholder:text-fg-muted focus:border-accent/50"
      />
    </div>
  )
}

export default function Attack() {
  const navigate = useNavigate()
  const pickerRef = useRef(null)
  const [step, setStep] = useState(0)
  const [startTime, setStartTime] = useState(todayValue)
  const [customDate, setCustomDate] = useState(false)
  const [severity, setSeverity] = useState(5)
  const [selectedLocations, setSelectedLocations] = useState(['Right temple'])
  const [selectedPainTypes, setSelectedPainTypes] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [selectedAuraTypes, setSelectedAuraTypes] = useState([])
  const [medications, setMedications] = useState(initialMedications)
  const [selectedMeds, setSelectedMeds] = useState([])
  const [doses, setDoses] = useState({})
  const [customMed, setCustomMed] = useState('')
  const [selectedTriggers, setSelectedTriggers] = useState([])
  const [showAllTriggers, setShowAllTriggers] = useState(false)
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const hasAura = selectedSymptoms.includes('Aura')
  const visibleTriggers = showAllTriggers ? triggers : triggers.slice(0, 8)
  const activeSections = useMemo(
    () => [
      'timeSeverity',
      'location',
      'painType',
      'symptoms',
      ...(hasAura ? ['aura'] : []),
      'medication',
      'triggers',
      'notes',
    ],
    [hasAura]
  )
  const activeSection = activeSections[Math.min(step, activeSections.length - 1)]
  const meta = severityMeta(severity)
  const severityLeft = `${((severity - 1) / 9) * 100}%`

  const toggleIn = (value, setter) => {
    setter((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    )
  }

  const toggleMedication = (med) => {
    if (med === 'None taken') {
      setSelectedMeds((current) => (current.includes(med) ? [] : [med]))
      return
    }

    setSelectedMeds((current) => {
      const withoutNone = current.filter((item) => item !== 'None taken')
      return withoutNone.includes(med)
        ? withoutNone.filter((item) => item !== med)
        : [...withoutNone, med]
    })
  }

  const addCustomMedication = () => {
    const med = customMed.trim()
    if (!med || medications.includes(med)) return
    setMedications((current) => [...current, med])
    setSelectedMeds((current) => [...current.filter((item) => item !== 'None taken'), med])
    setCustomMed('')
  }

  const goNext = () => {
    if (step >= activeSections.length - 1) {
      setSaved(true)
      navigate('/')
      return
    }
    setStep((current) => current + 1)
  }

  const goBack = () => {
    setSaved(false)
    setStep((current) => Math.max(0, current - 1))
  }

  const renderSection = () => {
    if (activeSection === 'timeSeverity') {
      return (
        <section className="space-y-6 anim-fade-in-up">
          {sectionTitle('Start Time & Pain Severity')}
          <div className="rounded-2xl bg-secondary p-4 shadow-card">
            <button
              type="button"
              onClick={() => pickerRef.current?.showPicker?.() || pickerRef.current?.click()}
              className="w-full rounded-lg bg-input p-4 text-left font-mono text-[20px] leading-tight text-fg btn-press"
            >
              {formatDateTime(startTime, customDate)}
            </button>
            <input
              ref={pickerRef}
              type="datetime-local"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => setCustomDate((current) => !current)}
              className="mt-4 text-[13px] font-semibold text-accent"
            >
              {customDate ? 'Use today' : 'Set custom date'}
            </button>
          </div>
          <div className="rounded-2xl bg-secondary p-5 shadow-card">
            <div className="relative pb-0 pt-9">
              <div
                className="absolute top-0 -translate-x-1/2 font-mono text-[24px] font-bold text-fg"
                style={{ left: severityLeft }}
              >
                {severity}
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(event) => setSeverity(Number(event.target.value))}
                className="attack-severity-slider"
                aria-label="Pain severity"
              />
              <div className="mt-3 flex items-center justify-between font-mono text-[13px] font-bold">
                <span className="text-sev-1">1</span>
                <span className="text-sev-9">10</span>
              </div>
              <p className={`text-center text-[15px] font-semibold ${meta.color}`}>{meta.label}</p>
            </div>
          </div>
        </section>
      )
    }

    if (activeSection === 'location') {
      return (
        <section className="space-y-5 anim-fade-in-up">
          {sectionTitle('Pain Location')}
          <div className="rounded-2xl bg-secondary p-4 shadow-card">
            <div className="relative mx-auto h-48 w-48">
              <img
                src={face}
                alt="Head diagram"
                className="h-full w-full object-contain opacity-90"
              />
              {locations.map((zone) => {
                const selected = selectedLocations.includes(zone.label)
                return (
                  <button
                    key={zone.label}
                    type="button"
                    onClick={() => toggleIn(zone.label, setSelectedLocations)}
                    aria-label={zone.label}
                    aria-pressed={selected}
                    className="absolute flex items-center justify-center rounded-full"
                    style={{
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      width: `${zone.size}px`,
                      height: `${zone.size}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <span
                      className={`h-6 w-6 rounded-full border transition-all duration-200 ${
                        selected
                          ? 'border-accent bg-accent/45 shadow-accent'
                          : 'border-fg-muted/70 bg-primary/10'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedLocations.length ? (
                selectedLocations.map((location) => (
                  <span
                    key={location}
                    className="rounded-full border border-accent/20 bg-accent/12 px-3 py-1.5 text-[12px] font-medium text-accent"
                  >
                    {location}
                  </span>
                ))
              ) : (
                <span className="text-[13px] text-fg-muted">Tap every area that hurts.</span>
              )}
            </div>
          </div>
        </section>
      )
    }

    if (activeSection === 'painType') {
      return (
        <section className="space-y-5 anim-fade-in-up">
          {sectionTitle('Pain Type')}
          <div className="grid grid-cols-2 gap-3">
            {painTypes.map(({ label, icon: Icon }) => {
              const selected = selectedPainTypes.includes(label)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleIn(label, setSelectedPainTypes)}
                  aria-pressed={selected}
                  className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 p-4 transition-all duration-200 btn-press ${
                    selected
                      ? 'border-accent bg-accent/12'
                      : 'border-tertiary bg-secondary'
                  }`}
                >
                  <Icon size={24} className={selected ? 'text-accent' : 'text-fg-secondary'} />
                  <span className="text-[13px] font-medium text-fg">{label}</span>
                </button>
              )
            })}
          </div>
        </section>
      )
    }

    if (activeSection === 'symptoms') {
      return (
        <section className="space-y-5 anim-fade-in-up">
          {sectionTitle('Other Symptoms')}
          <ChipGroup
            options={symptoms}
            selected={selectedSymptoms}
            onToggle={(option) => toggleIn(option, setSelectedSymptoms)}
          />
        </section>
      )
    }

    if (activeSection === 'aura') {
      return (
        <section className="space-y-5 anim-fade-in-up">
          {sectionTitle('Aura Type')}
          <ChipGroup
            options={auraTypes}
            selected={selectedAuraTypes}
            onToggle={(option) => toggleIn(option, setSelectedAuraTypes)}
          />
        </section>
      )
    }

    if (activeSection === 'medication') {
      return (
        <section className="space-y-5 anim-fade-in-up">
          {sectionTitle('Medication Taken')}
          <div className="flex flex-wrap gap-2">
            {['None taken', ...medications].map((med) => (
              <ToggleChip
                key={med}
                label={med}
                selected={selectedMeds.includes(med)}
                onClick={() => toggleMedication(med)}
              />
            ))}
          </div>
          <div className="space-y-3">
            {selectedMeds
              .filter((med) => med !== 'None taken')
              .map((med) => (
                <DoseInput
                  key={med}
                  med={med}
                  value={doses[med] ?? ''}
                  onChange={(value) => setDoses((current) => ({ ...current, [med]: value }))}
                />
              ))}
          </div>
          <div className="flex min-h-12 items-center gap-2">
            <input
              value={customMed}
              onChange={(event) => setCustomMed(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') addCustomMedication()
              }}
              placeholder="Custom medication"
              className="min-w-0 flex-1 rounded-md bg-input px-4 py-3 text-[14px] text-fg outline-none placeholder:text-fg-muted focus:ring-1 focus:ring-accent/50"
            />
            <button
              type="button"
              onClick={addCustomMedication}
              className="flex h-11 items-center gap-1.5 rounded-md px-3 text-[13px] font-semibold text-accent btn-press"
            >
              <Plus size={16} />
              Add custom med
            </button>
          </div>
        </section>
      )
    }

    if (activeSection === 'triggers') {
      return (
        <section className="space-y-5 anim-fade-in-up">
          {sectionTitle('Possible Triggers')}
          <ChipGroup
            options={visibleTriggers}
            selected={selectedTriggers}
            onToggle={(option) => toggleIn(option, setSelectedTriggers)}
          />
          {!showAllTriggers && (
            <button
              type="button"
              onClick={() => setShowAllTriggers(true)}
              className="text-[13px] font-semibold text-accent"
            >
              + See more
            </button>
          )}
        </section>
      )
    }

    return (
      <section className="space-y-5 anim-fade-in-up">
        {sectionTitle('Notes')}
        <div className="relative">
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Anything else you want to remember about this attack..."
            className="min-h-22 w-full resize-none rounded-md bg-input py-4 pl-4 pr-14 text-[14px] leading-relaxed text-fg outline-none placeholder:text-fg-muted focus:ring-1 focus:ring-accent/50"
          />
          <button
            type="button"
            className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary text-accent btn-press"
            aria-label="Record voice note"
          >
            <Mic size={18} />
          </button>
        </div>
      </section>
    )
  }

  return (
    <div className="bg-primary text-fg">
      <div className="mx-auto flex min-h-[calc(100vh-153px)] w-full max-w-107.5 flex-col px-5">
        <div className="mb-5 flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary text-fg-secondary disabled:opacity-40 btn-press"
            aria-label="Previous section"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1.5">
            {activeSections.map((section, index) => (
              <span
                key={section}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  index === step ? 'w-6 bg-accent' : 'w-1.5 bg-tertiary'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1">{saved ? (
          <section className="flex min-h-90 flex-col items-center justify-center gap-4 text-center anim-scale-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/12 text-accent">
              <Check size={28} />
            </div>
            <div>
              <h1 className="font-display text-[24px] text-fg">Attack saved</h1>
              <p className="mt-1 text-[13px] text-fg-secondary">Your log has been added.</p>
            </div>
          </section>
        ) : renderSection()}</div>

        {!saved && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="h-14 rounded-xl border border-white/8 bg-tertiary text-[15px] font-semibold text-fg-secondary disabled:opacity-40 btn-press"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="h-14 rounded-xl bg-accent text-[15px] font-bold text-fg-inverse shadow-accent btn-press"
            >
              {step === activeSections.length - 1 ? 'Save' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
