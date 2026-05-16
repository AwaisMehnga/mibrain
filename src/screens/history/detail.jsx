import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Play } from 'lucide-react'
import { getAttackById } from './history-data'

function effectivenessTone(effectiveness) {
  if (effectiveness === 'Full relief') return 'bg-success/12 text-success border-success/20'
  if (effectiveness === 'Partial relief') return 'bg-warning/12 text-warning border-warning/20'
  return 'bg-danger/12 text-danger border-danger/20'
}

function selectedZoneStyles(label, selectedLocations) {
  const selected = selectedLocations.includes(label)
  return selected
    ? 'border-accent bg-accent/50 shadow-accent'
    : 'border-fg-muted/70 bg-primary/10'
}

export default function HistoryDetail() {
  const navigate = useNavigate()
  const { attackId } = useParams()
  const attack = useMemo(() => getAttackById(attackId), [attackId])

  if (!attack) {
    return (
      <div className="px-5 py-5">
        <button
          type="button"
          onClick={() => navigate('/history')}
          className="text-[14px] font-semibold text-accent"
        >
          &lt; Back
        </button>
        <p className="mt-4 text-[14px] text-fg-secondary">That log could not be found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-primary px-5 py-5 text-fg">
      <div className="mx-auto w-full max-w-107.5 space-y-3">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/history')}
            className="text-[17px] font-semibold text-fg btn-press"
          >
            &lt; Back
          </button>
          <h1 className="text-[17px] font-semibold text-fg">{attack.dateLabel}</h1>
          <div className="w-16" />
        </header>

        <section className="rounded-lg bg-secondary p-5 shadow-card">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-widest text-fg-secondary">Severity</p>
              <p className="font-mono text-[48px] leading-none font-bold text-sev-7">{attack.severity}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[20px] font-semibold text-fg-secondary">{attack.duration}</p>
              <p className="mt-1 text-[13px] text-fg-secondary">{attack.summaryTime}</p>
            </div>
          </div>
        </section>

        <div className="space-y-3">
          <section className="rounded-md bg-secondary p-4">
            <p className="text-[12px] uppercase tracking-widest text-fg-muted">Location</p>
            <div className="mt-3 flex flex-col items-center gap-3">
              <div className="relative h-20 w-20">
                <img
                  src={attack.diagram}
                  alt="Head diagram"
                  className="h-full w-full object-contain opacity-90"
                />
                {attack.selectedLocations.map((label, index) => (
                  <span
                    key={label}
                    className={`absolute flex h-3.5 w-3.5 items-center justify-center rounded-full border ${selectedZoneStyles(label, attack.selectedLocations)}`}
                    style={{
                      left: `${28 + index * 18}%`,
                      top: `${34 + index * 9}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {attack.selectedLocations.map((location) => (
                  <span key={location} className="rounded-full bg-tertiary px-3 py-1.5 text-[12px] text-fg-secondary">
                    {location}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-md bg-secondary p-4">
            <p className="text-[12px] uppercase tracking-widest text-fg-muted">Symptoms</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {attack.symptoms.map((symptom) => (
                <span key={symptom} className="rounded-full border border-white/8 bg-tertiary px-3 py-1.5 text-[12px] text-fg-secondary">
                  {symptom}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-md bg-secondary p-4">
            <p className="text-[12px] uppercase tracking-widest text-fg-muted">Medications</p>
            <div className="mt-3 space-y-2">
              {attack.medications.map((medication) => (
                <div key={medication.name} className="flex items-center justify-between gap-3 rounded-md bg-primary/40 px-3 py-2.5">
                  <div>
                    <p className="text-[13px] font-semibold text-fg">{medication.name}</p>
                    <p className="text-[12px] text-fg-secondary">{medication.dose}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[12px] font-medium ${effectivenessTone(medication.effectiveness)}`}>
                    {medication.effectiveness}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md bg-secondary p-4">
            <p className="text-[12px] uppercase tracking-widest text-fg-muted">Triggers suspected</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {attack.triggers.map((trigger) => (
                <span key={trigger} className="rounded-full border border-accent/15 bg-accent/12 px-3 py-1.5 text-[12px] text-accent">
                  {trigger}
                </span>
              ))}
            </div>
          </section>

          {attack.aiInsight && (
            <section className="rounded-md border-l-[3px] border-l-accent bg-accent/8 p-4">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-accent">mibrain noticed:</p>
              <p className="mt-2 text-[14px] leading-relaxed text-fg">{attack.aiInsight}</p>
            </section>
          )}

          <section className="rounded-md bg-secondary p-4">
            <p className="text-[12px] uppercase tracking-widest text-fg-muted">Notes</p>
            <p className="mt-3 text-[14px] italic leading-relaxed text-fg">{attack.notes}</p>
            {attack.voiceNote && (
              <div className="mt-4 rounded-md bg-input p-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/12 text-accent"
                    aria-label="Play voice note"
                  >
                    <Play size={18} />
                  </button>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-fg">Voice note</p>
                    <p className="text-[12px] text-fg-secondary">{attack.voiceNote.label}</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <footer className="flex items-center justify-between gap-3 pt-1">
          <Link to="/log" className="text-[13px] font-medium text-fg-secondary">
            Edit this log
          </Link>
          <button type="button" className="text-[13px] font-medium text-danger">
            Delete
          </button>
        </footer>
      </div>
    </div>
  )
}
