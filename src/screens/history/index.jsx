import { Link } from 'react-router'
import { AlertTriangle } from 'lucide-react'
import { attacks } from './history-data'

function severityClass(value) {
  if (value <= 2) return 'text-sev-1'
  if (value <= 4) return 'text-sev-3'
  if (value <= 6) return 'text-sev-5'
  if (value <= 8) return 'text-sev-7'
  return 'text-sev-9'
}

export default function History() {
  return (
    <div className="px-5 py-5 space-y-4 pb-8 anim-fade-in-up">
      <section className="rounded-lg bg-secondary p-4">
        <p className="text-[12px] uppercase tracking-widest text-fg-secondary">Recent attacks</p>
        <p className="mt-1 text-[14px] text-fg-secondary">Tap any log to open the full detail view.</p>
      </section>

      <section className="space-y-2">
        {attacks.map((attack) => (
          <Link
            key={attack.id}
            to={`/history/${attack.id}`}
            className="flex min-h-16 items-center gap-3 rounded-md bg-secondary px-3 py-2 btn-press"
          >
            <div className="w-11 shrink-0 text-center">
              <p className="text-[10px] uppercase tracking-wide text-fg-muted">{attack.day}</p>
              <p className="text-[19px] leading-none font-mono font-bold text-fg">{attack.date}</p>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] text-fg-muted">{attack.timeLabel}</p>
              <p className="text-[12px] text-fg-secondary">{attack.duration}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {attack.selectedLocations.slice(0, 2).map((tag) => (
                  <span key={tag} className="rounded-full bg-tertiary px-2 py-0.5 text-[10px] text-fg-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className={`text-[22px] leading-none font-mono font-bold ${severityClass(attack.severity)}`}>
              {attack.severity}
            </p>
          </Link>
        ))}
      </section>

      <section className="flex min-h-33 flex-col items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-8">
        <AlertTriangle size={24} className="text-fg-muted" />
        <p className="text-[13px] text-fg-muted">Review the record details, meds, and patterns in each attack.</p>
      </section>
    </div>
  )
}
