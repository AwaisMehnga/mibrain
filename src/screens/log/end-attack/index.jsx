import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router'

const recap = {
  started: '11:42 AM',
  severity: '8/10',
  duration: '3h 14min',
}

const medicationOptions = [
  'None taken',
  'Sumatriptan 100mg',
  'Rizatriptan 10mg',
  'Ibuprofen 400mg',
  'Naproxen 500mg',
]
const reliefOptions = ['Didn\'t work', 'Partial relief', 'Full relief']
const postdromeOptions = [
  'Recovering well',
  'Still foggy',
  'Exhausted',
  'Anxious',
  'Relieved',
  'Neck stiff',
]

function nowInputValue() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

function formatTime(value) {
  const date = value ? new Date(value) : new Date()
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export default function EndAttack() {
  const navigate = useNavigate()
  const pickerRef = useRef(null)

  const [endTime, setEndTime] = useState(nowInputValue)
  const [selectedMeds, setSelectedMeds] = useState([])
  const [effectiveness, setEffectiveness] = useState({})
  const [customMed, setCustomMed] = useState('')
  const [postdrome, setPostdrome] = useState([])
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!saved) return undefined

    const timer = setTimeout(() => navigate('/'), 1100)
    return () => clearTimeout(timer)
  }, [saved, navigate])

  const togglePostdrome = (option) => {
    setPostdrome((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option]
    )
  }

  const toggleMedication = (medication) => {
    if (medication === 'None taken') {
      setSelectedMeds((current) => (current.includes(medication) ? [] : ['None taken']))
      return
    }

    setSelectedMeds((current) => {
      const withoutNone = current.filter((item) => item !== 'None taken')
      return withoutNone.includes(medication)
        ? withoutNone.filter((item) => item !== medication)
        : [...withoutNone, medication]
    })
  }

  const addCustomMedication = () => {
    const medication = customMed.trim()
    if (!medication) return

    setSelectedMeds((current) => {
      const withoutNone = current.filter((item) => item !== 'None taken')
      return withoutNone.includes(medication) ? withoutNone : [...withoutNone, medication]
    })
    setCustomMed('')
  }

  const medsForEffectiveness = selectedMeds.filter((medication) => medication !== 'None taken')

  const endAttack = () => {
    if (saved) return
    setSaved(true)
  }

  return (
    <div className="min-h-full bg-primary px-5 py-5 text-fg">
      <div className="mx-auto flex min-h-[calc(100vh-153px)] w-full max-w-107.5 flex-col">
        {!saved ? (
          <div className="flex-1 space-y-5 anim-fade-in-up">
            <section className="space-y-3 rounded-md bg-secondary p-4 shadow-card">
              <h2 className="text-[14px] font-semibold text-fg">Attack Summary</h2>
              <div className="space-y-2 text-[13px] text-fg-secondary">
                <p className="flex items-center justify-between">
                  <span>Started</span>
                  <span className="font-medium text-fg">{recap.started}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Severity</span>
                  <span className="font-medium text-fg">{recap.severity}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Duration so far</span>
                  <span className="font-medium text-fg">{recap.duration}</span>
                </p>
              </div>
            </section>

            <section className="space-y-2">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-fg-muted">
                When did it end?
              </p>
              <button
                type="button"
                onClick={() => pickerRef.current?.showPicker?.() || pickerRef.current?.click()}
                className="w-full rounded-lg bg-secondary px-4 py-5 text-left font-mono text-[20px] leading-tight text-fg btn-press"
              >
                {formatTime(endTime)}
              </button>
              <input
                ref={pickerRef}
                type="datetime-local"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="sr-only"
              />
            </section>

            <section className="space-y-3">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-fg-muted">
                Medication Taken
              </p>
              <div className="flex flex-wrap gap-2">
                {medicationOptions.map((medication) => {
                  const selected = selectedMeds.includes(medication)
                  return (
                    <button
                      key={medication}
                      type="button"
                      onClick={() => toggleMedication(medication)}
                      aria-pressed={selected}
                      className={`rounded-sm border px-4 py-2.5 text-[13px] font-medium transition-all duration-200 btn-press ${
                        selected
                          ? 'border-accent bg-accent/12 text-accent'
                          : 'border-transparent bg-tertiary text-fg-secondary'
                      }`}
                    >
                      {medication}
                    </button>
                  )
                })}
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
                  className="rounded-md px-3 py-2.5 text-[13px] font-semibold text-accent btn-press"
                >
                  Add
                </button>
              </div>
            </section>

            {medsForEffectiveness.length > 0 && (
              <section className="space-y-3">
                <p className="text-[13px] font-semibold uppercase tracking-widest text-fg-muted">
                  Medication Effectiveness
                </p>
                {medsForEffectiveness.map((medication) => (
                  <div key={medication} className="space-y-2 rounded-md bg-secondary p-4">
                    <p className="text-[14px] text-fg">How well did {medication} work?</p>
                    <div className="grid grid-cols-3 gap-2">
                      {reliefOptions.map((option) => {
                        const selected = effectiveness[medication] === option
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setEffectiveness((current) => ({ ...current, [medication]: option }))
                            }
                            className={`h-12 rounded-md border px-2 text-[12px] font-semibold transition-all duration-200 btn-press ${
                              selected
                                ? 'border-accent bg-accent/12 text-accent'
                                : 'border-white/8 bg-tertiary text-fg-secondary'
                            }`}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </section>
            )}

            <section className="space-y-3">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-fg-muted">
                How do you feel now?
              </p>
              <div className="flex flex-wrap gap-2">
                {postdromeOptions.map((option) => {
                  const selected = postdrome.includes(option)
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => togglePostdrome(option)}
                      aria-pressed={selected}
                      className={`rounded-sm border px-4 py-2.5 text-[13px] font-medium transition-all duration-200 btn-press ${
                        selected
                          ? 'border-accent bg-accent/12 text-accent'
                          : 'border-transparent bg-tertiary text-fg-secondary'
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="space-y-2">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-fg-muted">
                Notes on recovery
              </p>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Anything about your recovery you want to remember..."
                className="min-h-22 w-full resize-none rounded-md bg-input py-4 px-4 text-[14px] leading-relaxed text-fg outline-none placeholder:text-fg-muted focus:ring-1 focus:ring-accent/50"
              />
            </section>
          </div>
        ) : (
          <section className="flex flex-1 flex-col items-center justify-center gap-4 text-center anim-scale-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/12 text-success">
              <Check size={28} />
            </div>
            <div>
              <h2 className="font-display text-[24px] text-fg">Attack ended</h2>
              <p className="mt-1 text-[13px] text-fg-secondary">Taking you back home...</p>
            </div>
          </section>
        )}

        {!saved && (
          <div className="mt-6">
            <button
              type="button"
              onClick={endAttack}
              className="h-14 w-full rounded-xl bg-success text-[16px] font-bold text-white"
            >
              End Attack
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
