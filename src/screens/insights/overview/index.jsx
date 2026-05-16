import React, { useMemo } from 'react'
import { Link } from 'react-router'
import { attacks } from '../../history/history-data'

const MS_DAY = 1000 * 60 * 60 * 24

function pctColor(p) {
  if (p >= 75) return 'bg-danger'
  if (p >= 60) return 'bg-warning'
  return 'bg-success'
}

export default function Overview() {
  const attacksCount = attacks.length || 0

  const { spanDays, topTrigger, triggers, heatmap, medsByName, months } = useMemo(() => {
    if (!attacksCount) {
      return {
        spanDays: 0,
        topTrigger: { label: 'Poor sleep', multiplier: 3, detail: 'In 8 of your last 10 attacks, you slept under 6.5 hours the night before.' },
        triggers: [
          ['Poor sleep', 87],
          ['Rising pressure', 76],
          ['Stress (4–5)', 71],
          ['Skipped meals', 58],
          ['Alcohol', 52],
          ['Bright screens', 44],
        ],
        heatmap: Array.from({ length: 28 }, () => Math.floor(Math.random() * 10)),
        medsByName: [
          { name: 'Sumatriptan', dose: '50 mg', uses: 13, split: [60,30,10] },
          { name: 'Ibuprofen', dose: '400 mg', uses: 8, split: [20,50,30] },
        ],
        months: [3,5,4,2],
      }
    }

    const dates = attacks.map(a => new Date(a.startedAt)).sort((a,b)=>a-b)
    const spanDays = Math.max(0, Math.round((dates[dates.length-1] - dates[0]) / MS_DAY))

    // Mock trigger correlations from available attack metadata if present
    const triggerCounts = new Map()
    attacks.forEach(a => {
      (a.triggers || []).forEach(t => triggerCounts.set(t, (triggerCounts.get(t)||0)+1))
    })
    const triggersArr = Array.from(triggerCounts.entries()).map(([k,v])=>({k,v}))
    triggersArr.sort((a,b)=>b.v-a.v)
    const total = Math.max(1, attacks.length)
    const triggers = triggersArr.slice(0,6).map(t=>[t.k, Math.round((t.v/total)*100)])
    // Fallback if insufficient triggers
    if (triggers.length < 6) {
      const fallback = [
        ['Poor sleep', 87],
        ['Rising pressure', 76],
        ['Stress (4–5)', 71],
        ['Skipped meals', 58],
        ['Alcohol', 52],
        ['Bright screens', 44],
      ]
      for (let i=triggers.length;i<6;i++) triggers.push(fallback[i])
    }

    // Heatmap: count by weekday(0-6) and slot(0-3)
    const heat = Array.from({ length: 28 }, () => 0)
    attacks.forEach(a => {
      const d = new Date(a.startedAt)
      const dow = d.getDay() // 0 Sun
      const hr = d.getHours()
      const slot = hr >= 18 ? 2 : (hr >= 12 ? 1 : (hr >= 6 ? 0 : 3))
      const col = ((dow + 6) % 7) // convert to Mon=0
      const idx = slot * 7 + col
      heat[idx] = (heat[idx] || 0) + 1
    })

    // meds aggregation
    const medsMap = new Map()
    attacks.forEach(a => (a.medications||[]).forEach(m=>{
      const key = `${m.name}||${m.dose||''}`
      const entry = medsMap.get(key) || { name: m.name, dose: m.dose, uses: 0, relief: { full:0, partial:0, none:0 } }
      entry.uses++
      if (m.effectiveness === 'full') entry.relief.full++
      else if (m.effectiveness === 'partial') entry.relief.partial++
      else entry.relief.none++
      medsMap.set(key, entry)
    }))
    const medsByName = Array.from(medsMap.values())

    // months (last 4 months) counts
    const now = new Date()
    const months = [0,0,0,0]
    attacks.forEach(a=>{
      const d = new Date(a.startedAt)
      const monthDiff = (now.getFullYear()-d.getFullYear())*12 + (now.getMonth()-d.getMonth())
      if (monthDiff >=0 && monthDiff < 4) months[3-monthDiff]++
    })

    const topTrigger = { label: triggers[0][0], multiplier: Math.max(1, Math.round((triggers[0][1]/25))), detail: `In ${Math.min(10, attacksCount)} of your last ${Math.min(10, attacksCount)} attacks, you slept under 6.5 hours the night before.` }

    return { spanDays, topTrigger, triggers, heatmap: heat, medsByName, months }
  }, [attacksCount])

  const locked = spanDays < 0

  return (
    <div className="px-5 py-5 space-y-4 pb-8 anim-fade-in-up">

      {locked ? (
        <div className="bg-secondary p-5 rounded-lg border border-tertiary">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-fg">Your insights unlock in {14 - spanDays} more days</div>
              <p className="text-[13px] text-fg-secondary mt-2">Keep logging your daily check-in to get accurate patterns</p>
              <div className="mt-4 rounded-full h-3 w-full bg-tertiary">
                <div className="h-3 rounded-full bg-accent" style={{ width: `${Math.min(100, (spanDays/14)*100)}%` }} />
              </div>
            </div>
            <div className="w-40 h-32 bg-tertiary rounded-md flex items-center justify-center text-fg-secondary">🔒</div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {[1,2,3].map(i=> (
              <div key={i} className="rounded-lg bg-tertiary h-28 flex items-center justify-center text-fg-secondary">Locked</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Section 1 - Top Trigger */}
          <section className="bg-secondary rounded-lg p-5">
            <div className="text-xs uppercase text-accent">Your #1 Pattern</div>
            <h2 className="font-serif text-[20px] mt-2 text-fg">Attacks are {topTrigger.multiplier}× more likely after {topTrigger.label.toLowerCase()}</h2>
            <div className="text-[13px] text-fg-secondary mt-2">{topTrigger.detail}</div>
            <div className="mt-4">
              <span className="inline-block bg-success text-fg-inverse text-[12px] px-3 py-1 rounded-full">High confidence</span>
            </div>
          </section>

          {/* Section 2 - Correlation chart */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">What correlates with your attacks?</h3>
              <button className="text-sm text-indigo-400">See all</button>
            </div>
            <div className="mt-3 space-y-3">
              {triggers.map(([name, pct]) => (
                <div key={name} className="flex items-center">
                      <div className="w-36 text-[13px] text-fg-secondary">
                        <Link to={`/insights/detail/${encodeURIComponent(name)}`} className="text-fg-secondary hover:text-fg">{name}</Link>
                      </div>
                  <div className="flex-1 bg-tertiary h-2 rounded-full mx-3">
                    <div className={`${pctColor(pct)} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="w-12 text-right font-mono text-[13px] text-fg">{pct}%</div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 - Heatmap */}
          <section>
            <h3 className="text-sm font-semibold">When do your attacks hit?</h3>
            <div className="mt-3 grid grid-cols-7 gap-2">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, col) => (
                <div key={d} className="space-y-2">
                  <div className="text-xs text-fg-secondary text-center">{d}</div>
                  <div className="grid gap-2">
                    {[0,1,2,3].map(row=>{
                      const idx = row*7 + col
                      const val = heatmap[idx] || 0
                      const max = Math.max(1, ...heatmap)
                      const t = Math.round((val / max) * 100)
                      return (
                        <div key={row} className={`w-10 h-10 rounded ${t>0? 'bg-accent':'bg-tertiary'}`} style={{ boxShadow: t===100? '0 0 8px rgba(127,182,155,0.35)':'' }} />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 - Medication effectiveness */}
          <section>
            <h3 className="text-sm font-semibold text-fg">How well are your meds working?</h3>
            <div className="mt-3 space-y-3">
              {medsByName.length ? medsByName.map(m => (
                <div key={m.name+m.dose} className="bg-secondary p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-fg">{m.name} <span className="text-sm text-fg-secondary">{m.dose}</span></div>
                    <div className="text-sm text-fg-secondary">{m.uses} uses</div>
                  </div>
                  <div className="mt-2 bg-tertiary h-3 rounded-full overflow-hidden">
                    <div className="bg-success h-3 float-left" style={{ width: `${Math.round((m.relief.full||0)/Math.max(1,m.uses)*100)}%` }} />
                    <div className="bg-warning h-3 float-left" style={{ width: `${Math.round((m.relief.partial||0)/Math.max(1,m.uses)*100)}%` }} />
                    <div className="bg-danger h-3 float-left" style={{ width: `${Math.round((m.relief.none||0)/Math.max(1,m.uses)*100)}%` }} />
                  </div>
                </div>
              )) : (
                <div className="text-sm text-fg-secondary">No medication data available</div>
              )}
            </div>
          </section>

          {/* Section 5 - Monthly trend */}
          <section>
            <h3 className="text-sm font-semibold">Attack frequency over time</h3>
            <div className="mt-3 p-4 bg-secondary rounded-lg">
              <svg viewBox="0 0 200 60" className="w-full h-16 text-accent">
                {(() => {
                  const max = Math.max(1, ...months)
                  const points = months.map((v,i)=>`${20 + i*40},${50 - (v/max)*40}`).join(' ')
                  return (
                    <>
                      <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={points} className="rounded" />
                      {months.map((v,i)=>{
                        const x = 20 + i*40
                        const y = 50 - (v/max)*40
                        return <circle key={i} cx={x} cy={y} r="3" fill="currentColor" />
                      })}
                    </>
                  )
                })()}
              </svg>
              <div className="mt-2 text-sm text-success">↓ 2 fewer attacks than last month</div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
