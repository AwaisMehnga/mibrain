import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, Share2 } from 'lucide-react'
import { attacks } from '../../history/history-data'

function getWeekDates(offset = 0) {
  const today = new Date()
  const currentDay = today.getDay()
  const distance = currentDay === 0 ? 6 : currentDay - 1
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - distance - offset * 7)
  
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  
  return { start: startOfWeek, end: endOfWeek }
}

export default function WeeklySummary() {
  const navigate = useNavigate()
  const [weekOffset, setWeekOffset] = useState(0)
  const { start, end } = getWeekDates(weekOffset)

  const { attacksThisWeek, attacksLastWeek, avgSeverity, bestDay, worstDay, topInsight, medsSummary, loggingDays, streak } = useMemo(() => {
    const thisWeekStart = new Date(start)
    const thisWeekEnd = new Date(end)
    thisWeekEnd.setHours(23, 59, 59)

    const lastWeekStart = new Date(start)
    lastWeekStart.setDate(start.getDate() - 7)
    const lastWeekEnd = new Date(end)
    lastWeekEnd.setDate(end.getDate() - 7)
    lastWeekEnd.setHours(23, 59, 59)

    const thisWeek = attacks.filter(a => {
      const d = new Date(a.startedAt)
      return d >= thisWeekStart && d <= thisWeekEnd
    })
    const lastWeek = attacks.filter(a => {
      const d = new Date(a.startedAt)
      return d >= lastWeekStart && d <= lastWeekEnd
    })

    const avgSev = thisWeek.length ? Math.round(thisWeek.reduce((sum, a) => sum + (a.severity || 0), 0) / thisWeek.length * 10) / 10 : 0

    let bestDay = null
    let worstDay = null
    let bestCount = 0
    let worstCount = Infinity

    const dayMap = new Map()
    thisWeek.forEach(a => {
      const d = new Date(a.startedAt)
      const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      dayMap.set(day, (dayMap.get(day) || 0) + 1)
    })
    dayMap.forEach((count, day) => {
      if (count > bestCount) { bestCount = count; bestDay = day }
      if (count < worstCount) { worstCount = count; worstDay = day }
    })

    const medMap = new Map()
    thisWeek.forEach(a => {
      (a.medications || []).forEach(m => {
        const key = `${m.name}||${m.dose}`
        const entry = medMap.get(key) || { name: m.name, dose: m.dose, full: 0, partial: 0, none: 0, total: 0 }
        entry.total++
        if (m.effectiveness === 'Full relief') entry.full++
        else if (m.effectiveness === 'Partial relief') entry.partial++
        else entry.none++
        medMap.set(key, entry)
      })
    })

    const loggingCalendar = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const dayStart = new Date(d)
      dayStart.setHours(0, 0, 0)
      const dayEnd = new Date(d)
      dayEnd.setHours(23, 59, 59)
      const logged = attacks.some(a => {
        const ad = new Date(a.startedAt)
        return ad >= dayStart && ad <= dayEnd
      })
      return { date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }), logged }
    })

    const streakDays = loggingCalendar.slice().reverse().findIndex(d => !d.logged)
    const streak = streakDays === -1 ? 7 : streakDays

    return {
      attacksThisWeek: thisWeek.length,
      attacksLastWeek: lastWeek.length,
      avgSeverity: avgSev,
      bestDay,
      worstDay,
      topInsight: 'Poor sleep remains your strongest trigger',
      medsSummary: Array.from(medMap.values()).slice(0, 2),
      loggingDays: loggingCalendar,
      streak,
    }
  }, [start, end])

  const weekLabel = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  const attackChange = attacksThisWeek - attacksLastWeek
  const attackTrend = attackChange > 0 ? 'up' : 'down'

  return (
    <div className="px-5 py-5 space-y-4 pb-8 anim-fade-in-up">
      <header className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-fg-secondary text-sm flex items-center gap-1">
          <ChevronLeft className='w-4 h-4' /> Back
        </button>
        <h1 className="text-[17px] font-semibold text-fg">Week of {weekLabel}</h1>
        <div className="w-8" />
      </header>

      <nav className="flex items-center justify-between text-[13px]">
        <button onClick={() => setWeekOffset(o => o + 1)} className="text-accent hover:text-fg">
          &lt; Previous week
        </button>
        <button onClick={() => setWeekOffset(o => o - 1)} className={weekOffset === 0 ? 'text-fg-muted cursor-not-allowed' : 'text-accent hover:text-fg'}>
          Next week &gt;
        </button>
      </nav>

      {/* Week Overview */}
      <section className="rounded-lg bg-secondary p-5">
        <h3 className="text-[14px] font-semibold text-fg">Week Overview</h3>
        <div className="mt-3 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] text-fg-secondary">Attacks this week</span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[28px] font-bold text-fg">{attacksThisWeek}</span>
              <span className={`text-[12px] ${attackTrend === 'down' ? 'text-success' : 'text-danger'}`}>
                {attackChange > 0 ? '+' : ''}{attackChange} vs last week
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-fg-secondary">Average severity</span>
            <span className="font-mono text-[18px] font-bold text-fg">{avgSeverity}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-fg-secondary">Best day</span>
            <span className="text-fg">{bestDay || '—'}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-fg-secondary">Worst day</span>
            <span className="text-fg">{worstDay || '—'}</span>
          </div>
        </div>
      </section>

      {/* Top Insight */}
      <section className="bg-secondary rounded-lg p-5">
        <div className="text-xs uppercase text-accent">Top Insight</div>
        <h2 className="font-serif text-[18px] mt-2 text-fg">{topInsight}</h2>
        <div className="mt-3">
          <span className="inline-block bg-success text-fg-inverse text-[12px] px-3 py-1 rounded-full">Consistent pattern</span>
        </div>
      </section>

      {/* Medication Summary */}
      {medsSummary.length > 0 && (
        <section className="rounded-lg bg-secondary p-5">
          <h3 className="text-[14px] font-semibold text-fg">Medication Summary</h3>
          <div className="mt-3 space-y-3">
            {medsSummary.map((med, i) => (
              <div key={i} className="border-b border-tertiary pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-fg">{med.name}</span>
                  <span className="text-[12px] text-fg-secondary">{med.total} uses</span>
                </div>
                <div className="mt-2 bg-tertiary h-2 rounded-full overflow-hidden flex">
                  <div className="bg-success h-2" style={{ width: `${(med.full / med.total) * 100}%` }} />
                  <div className="bg-warning h-2" style={{ width: `${(med.partial / med.total) * 100}%` }} />
                  <div className="bg-danger h-2" style={{ width: `${(med.none / med.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Logging Consistency */}
      <section className="rounded-lg bg-secondary p-5">
        <h3 className="text-[14px] font-semibold text-fg">Logging Consistency</h3>
        <div className="mt-3 flex gap-2">
          {loggingDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold ${day.logged ? 'bg-success text-fg-inverse' : 'bg-tertiary text-fg-muted'}`}>
                {day.date.split(',')[0].charAt(0)}
              </div>
              <span className="text-[10px] text-fg-muted">{day.date.split(' ')[1]}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-[14px] font-semibold text-accent">{streak}-day streak!</p>
        </div>
      </section>

      {/* Share CTA */}
      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-accent/20 text-accent text-[14px] font-semibold btn-press">
        <Share2 size={16} />
        Share this week's report
      </button>
    </div>
  )
}
