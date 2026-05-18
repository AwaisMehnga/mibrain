import { Link } from 'react-router'
import { AlertTriangle, Funnel, Calendar, Pill, Share2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { attacks } from './history-data'

function severityClass(value) {
  if (value <= 2) return 'text-sev-1'
  if (value <= 4) return 'text-sev-3'
  if (value <= 6) return 'text-sev-5'
  if (value <= 8) return 'text-sev-7'
  return 'text-sev-9'
}

export default function History() {
  const [filter, setFilter] = useState('All')

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const attacksThisMonth = attacks.filter(a => new Date(a.startedAt).getMonth() === thisMonth)
    const avgSeverity = attacks.length ? (attacks.reduce((s,a)=>s+(a.severity||0),0)/attacks.length).toFixed(1) : '—'
    const dowCount = {}
    attacks.forEach(a => {
      const d = new Date(a.startedAt)
      const dow = d.toLocaleDateString('en-US', { weekday: 'long' })
      dowCount[dow] = (dowCount[dow]||0) + 1
    })
    const most = Object.entries(dowCount).sort((a,b)=>b[1]-a[1])[0]
    const mostDay = most ? most[0].split(',')[0] : '—'
    return { attacksThisMonth: attacksThisMonth.length, avgSeverity, mostDay }
  }, [])

  const filters = ['All','Severe (8+)','With aura','Medicated','This month','Custom...']

  function applyFilter(list) {
    if (filter === 'All') return list
    if (filter === 'Severe (8+)') return list.filter(a=> (a.severity||0) >= 8)
    if (filter === 'With aura') return list.filter(a=> (a.symptoms||[]).includes('Aura'))
    if (filter === 'Medicated') return list.filter(a=> (a.medications||[]).length > 0)
    if (filter === 'This month') {
      const now = new Date()
      return list.filter(a=> new Date(a.startedAt).getMonth() === now.getMonth())
    }
    return list
  }

  const filtered = applyFilter(attacks)

  const grouped = useMemo(() => {
    const map = new Map()
    filtered.forEach(a => {
      const d = new Date(a.startedAt)
      const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(a)
    })
    return Array.from(map.entries())
  }, [filtered])

  return (
    <div className="px-5 py-5 space-y-4 pb-8 anim-fade-in-up">
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-[24px] text-fg">Attack History</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-md bg-tertiary"><Funnel className="text-fg-secondary" /></button>
          <Link to="/history/calendar" className="p-2 rounded-md bg-tertiary"><Calendar className="text-fg-secondary" /></Link>
          <Link to="/report" className="p-2 rounded-md bg-tertiary"><Share2 className="text-fg-secondary" /></Link>
        </div>
      </header>

      <section className="overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          <article className="min-w-28 rounded-md bg-secondary px-3 py-3 text-center">
            <p className="text-[11px] text-fg-secondary">This month</p>
            <p className="mt-1 text-[16px] font-semibold text-fg">{stats.attacksThisMonth} attacks</p>
          </article>
          <article className="min-w-28 rounded-md bg-secondary px-3 py-3 text-center">
            <p className="text-[11px] text-fg-secondary">Avg severity</p>
            <p className="mt-1 text-[16px] font-semibold text-fg">{stats.avgSeverity}</p>
          </article>
          <article className="min-w-28 rounded-md bg-secondary px-3 py-3 text-center">
            <p className="text-[11px] text-fg-secondary">Most attacks</p>
            <p className="mt-1 text-[16px] font-semibold text-fg">{stats.mostDay}</p>
          </article>
        </div>
      </section>

      <section className="overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-[13px] ${filter === f ? 'bg-accent text-fg-inverse' : 'bg-tertiary text-fg-secondary'}`}>
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {grouped.length === 0 && (
          <div className="flex min-h-33 flex-col items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-8">
            <AlertTriangle size={32} className="text-fg-muted" />
            <p className="text-[15px] text-fg-muted">No attacks logged yet</p>
            <Link to="/log" className="mt-3 px-4 py-2 rounded-lg border border-accent/20 text-accent">Log your first attack</Link>
          </div>
        )}

        {grouped.map(([month, items]) => (
          <div key={month}>
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] uppercase text-fg-secondary">{month}</h4>
              <div className="text-[11px] text-fg-secondary">{items.length} attacks</div>
            </div>

            <div className="mt-2 space-y-2">
              {items.map(attack => (
                <Link key={attack.id} to={`/history/${attack.id}`} className="flex items-center bg-secondary rounded-md p-4 gap-4 btn-press">
                  <div style={{width:60}} className="flex flex-col items-center text-center">
                    <div className="text-[11px] uppercase text-fg-secondary">{attack.day}</div>
                    <div className="text-[22px] font-mono font-bold text-fg">{attack.date}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-fg-secondary truncate">{attack.timeLabel}</div>
                    <div className="text-[13px] text-fg mt-1">{attack.duration}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                      {attack.selectedLocations.slice(0,2).map(loc=> (
                        <span key={loc} className="rounded-full bg-tertiary px-2 py-0.5 text-fg-secondary">{loc}</span>
                      ))}
                      {attack.symptoms && attack.symptoms.slice(0,2).map(s=> (
                        <span key={s} className="rounded-full bg-tertiary px-2 py-0.5 text-fg-secondary">{s}</span>
                      ))}
                      {((attack.selectedLocations.length + (attack.symptoms||[]).length) > 4) && (
                        <span className="rounded-full bg-tertiary px-2 py-0.5 text-fg-secondary">+{(attack.selectedLocations.length + (attack.symptoms||[]).length) - 4} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className={`font-mono text-[24px] font-bold ${severityClass(attack.severity)}`}>{attack.severity}</div>
                    <div>
                      {attack.medications && attack.medications.length > 0 ? (
                        <Pill className="text-success" />
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
