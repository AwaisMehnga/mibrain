import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { attacks } from '../history-data'

function localKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function severityBg(avg) {
  if (!avg) return null
  if (avg <= 4) return 'bg-sev-1'
  if (avg <= 7) return 'bg-sev-5'
  return 'bg-sev-9'
}

function toYYYYMMDD(d) {
  return localKey(d)
}

export default function HistoryCalendar() {
  const now = new Date()
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [selectedDate, setSelectedDate] = useState(null)

  const attacksByDate = useMemo(() => {
    const m = new Map()
    attacks.forEach(a => {
      // Normalize possible date sources and skip invalid dates
      let d = null
      const raw = a.startedAt ?? a.started ?? null
      if (raw) {
        // raw may be time-only; not a full date — ignore
      }

      // Prefer a full date if provided via a.iso or a.dateLabel
      if (a.iso) {
        d = new Date(a.iso)
      }
      if (!d && a.dateLabel) {
        // Remove ordinal suffixes (1st, 2nd, 3rd, 4th)
        const cleaned = a.dateLabel.replace(/(\d+)(st|nd|rd|th)/i, '$1')
        d = new Date(cleaned)
      }
      if (!d && a.date) {
        // `a.date` may be day-of-month (e.g., '03') — can't infer month/year, so skip
        d = null
      }
      if (!d || Number.isNaN(d.getTime())) return
      const key = toYYYYMMDD(d)
      const list = m.get(key) || []
      list.push(a)
      m.set(key, list)
    })
    return m
  }, [])

  // no debug logging in production UI

  // If there are no attacks in the current month, default view to the most recent attack month
  useEffect(() => {
    try {
      const keys = Array.from(attacksByDate.keys())
      if (!keys.length) return
      const y = view.year
      const m = String(view.month + 1).padStart(2, '0')
      const prefix = `${y}-${m}`
      const hasInView = keys.some(k => k.startsWith(prefix))
      if (!hasInView) {
        // pick the latest key
        const latest = keys.sort().reverse()[0] // 'YYYY-MM-DD'
        const [ly, lm] = latest.split('-')
        setView({ year: Number(ly), month: Number(lm) - 1 })
        console.log('[HistoryCalendar] defaulting view to latest attack month', latest)
      }
    } catch (e) {
      console.error('[HistoryCalendar] error setting default view', e)
    }
  }, [attacksByDate])

  const matrix = useMemo(() => {
    const { year, month } = view
    const first = new Date(year, month, 1)
    // weekday with Monday=0
    const startWeekday = (first.getDay() + 6) % 7
    const daysInMonth = new Date(year, month+1, 0).getDate()
    const cells = []
    // fill leading blanks
    for (let i=0;i<startWeekday;i++) cells.push(null)
    for (let d=1; d<=daysInMonth; d++) cells.push(new Date(year, month, d))
    // ensure 5 rows (35 cells)
    while (cells.length < 35) cells.push(null)
    return cells
  }, [view])

  function prevMonth(){
    setView(v => {
      const m = v.month - 1
      if (m < 0) return { year: v.year -1, month: 11 }
      return { year: v.year, month: m }
    })
  }
  function nextMonth(){
    setView(v => {
      const m = v.month + 1
      if (m > 11) return { year: v.year +1, month: 0 }
      return { year: v.year, month: m }
    })
  }

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="px-5 py-5 anim-fade-in-up">
      <header className="flex items-center gap-3">
        <Link to="/history" className="text-accent flex items-center gap-2">
          <ChevronLeft size={18} />
          <span className="text-[15px] font-semibold">Back</span>
        </Link>
        <div className="flex-1 flex items-center justify-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-md bg-tertiary"><ChevronLeft /></button>
          <div className="text-[17px] font-semibold">{monthLabel}</div>
          <button onClick={nextMonth} className="p-2 rounded-md bg-tertiary"><ChevronRight /></button>
        </div>
      </header>

      <div className="mt-4">
        <div className="grid grid-cols-7 gap-2 text-center text-[12px] text-fg-secondary">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=> <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2 mt-2">
          {matrix.map((cell, idx) => {
            if (!cell) return <div key={idx} className="w-11 h-11" />
            const key = localKey(cell)
            const list = attacksByDate.get(key) || []
            const avg = list.length ? (list.reduce((s,a)=>s+(a.severity||0),0)/list.length) : null
            const bg = severityBg(avg)
            const isToday = localKey(cell) === localKey(new Date())
            return (
              <button
                key={idx}
                onClick={() => { if (list.length) setSelectedDate(cell) }}
                className={`w-11 h-11 flex flex-col items-center justify-center rounded ${isToday ? 'ring-2 ring-accent/60' : ''}`}
              >
                <div className="text-[13px] text-fg">{cell.getDate()}</div>
                {list.length ? (
                  <div className={`mt-1 w-6 h-6 rounded-full ${bg} flex items-center justify-center text-[12px] text-fg-inverse`}></div>
                ) : null}
                {list.length > 1 && (
                  <div className="mt-1 flex gap-0.5">
                    {list.slice(0,3).map((_,i)=> <div key={i} className="w-1.5 h-1.5 rounded-full bg-fg-muted" />)}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-sev-1" />
          <div className="text-[13px] text-fg-secondary">Mild</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-sev-5" />
          <div className="text-[13px] text-fg-secondary">Moderate</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-sev-9" />
          <div className="text-[13px] text-fg-secondary">Severe</div>
        </div>
      </div>

      {/* Bottom sheet for day details */}
      {selectedDate && (
        <div className="fixed left-0 right-0 bottom-0 z-70">
          <div className="h-1/2 overflow-auto bg-tertiary rounded-t-2xl p-6 anim-slide-up">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[13px] text-fg-secondary">{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                <div className="text-[17px] font-semibold">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
              </div>
              <button onClick={() => setSelectedDate(null)} className="text-fg-secondary">Close</button>
            </div>

            <div className="space-y-3">
              {(attacksByDate.get(localKey(selectedDate)) || []).map(a => (
                <Link key={a.id} to={`/history/${a.id}`} className="block bg-primary rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[13px] font-semibold text-fg">{a.timeLabel} — {a.duration}</div>
                    <div className="font-mono text-[18px] font-bold text-fg">{a.severity}</div>
                  </div>
                  <div className="text-[12px] text-fg-secondary mt-1">{a.selectedLocations?.slice(0,2).join(', ')}</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="h-24" onClick={() => setSelectedDate(null)} />
        </div>
      )}
    </div>
  )
}
