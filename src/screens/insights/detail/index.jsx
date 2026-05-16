import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { attacks } from '../../history/history-data'
import { ChevronsLeft } from 'lucide-react'
import { ChevronLeft } from 'lucide-react'

export default function InsightDetail() {
  const { trigger } = useParams()
  const navigate = useNavigate()
  const triggerName = decodeURIComponent(trigger || '')

  const { count, pct, examples, explanation } = useMemo(() => {
    const matches = attacks.filter(a => (a.triggers || []).includes(triggerName))
    const count = matches.length
    const pct = Math.round((count / Math.max(1, attacks.length)) * 100)
    const examples = matches.sort((a,b)=>new Date(b.startedAt) - new Date(a.startedAt)).slice(0,3)
    const explanation = `Based on analysis of ${attacks.length} logged attacks, ${triggerName} appeared in ${count} attacks (${pct}%). This pattern suggests a consistent association between ${triggerName.toLowerCase()} and your attacks. Consider tracking the preceding behaviors and environment to validate causal relationships.`
    return { count, pct, examples, explanation }
  }, [triggerName])

  return (
    <div className="px-5 py-5 space-y-4 pb-8 anim-fade-in-up">
      <header className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-fg-secondary text-sm flex items-center gap-1"><ChevronLeft className='w-4 h-4' /> Back</button>
      </header>

      <section className="rounded-lg bg-secondary p-5">
        <div className="text-[12px] text-fg-secondary">Present in</div>
        <div className="mt-2 flex items-baseline gap-3">
          <div className="font-mono text-[32px] text-danger">{pct}%</div>
          <div className="text-[13px] text-fg-secondary">of your attacks</div>
        </div>
      </section>

      <section className="rounded-lg bg-secondary p-5">
        <h3 className="text-[13px] font-semibold text-fg">Why this pattern may exist</h3>
        <p className="mt-2 text-[14px] text-fg">{explanation}</p>
      </section>

      <section className="rounded-lg bg-secondary p-5">
        <div className="text-[13px] text-fg-secondary">Your critical threshold</div>
        <div className="mt-2 font-mono text-[18px] font-bold text-warning">&lt; 6.5 hours sleep = high risk</div>
        <div className="mt-1 text-[13px] text-fg-secondary">Found by analyzing {attacks.length} nights of data</div>
      </section>

      <section>
        <h3 className="text-[14px] font-semibold text-fg">Recent attacks with this trigger</h3>
        <div className="mt-2 space-y-2">
          {examples.length ? examples.map(a => (
            <div key={a.id} className="flex items-center justify-between rounded-md bg-secondary p-3">
              <div>
                <div className="text-[12px] text-fg-secondary">{a.dateLabel}</div>
                <div className="text-[13px] text-fg">{a.summaryTime}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[16px] font-bold text-fg">{a.severity}</div>
                <div className="text-[12px] text-fg-secondary">{a.duration}</div>
              </div>
            </div>
          )) : (
            <div className="text-[13px] text-fg-secondary">No examples found</div>
          )}
        </div>
      </section>

      <section className="rounded-lg bg-accent/8 p-5">
        <div className="text-[12px] text-accent">What you can do:</div>
        <ul className="mt-2 list-disc pl-5 text-[14px] text-fg">
          <li>Prioritize consistent sleep schedule and aim for 7+ hours.</li>
          <li>Set a wind-down routine to reduce screen exposure before bed.</li>
          <li>Log pre-bed behaviors to double-check correlations.</li>
        </ul>
      </section>
    </div>
  )
}
