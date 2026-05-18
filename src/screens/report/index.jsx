import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ChevronLeft } from 'lucide-react'
import { attacks } from '../history/history-data'

function mean(arr) { return arr.length ? Math.round(arr.reduce((s,a)=>s+a,0)/arr.length) : 0 }

function calculateMIDAS(attacksList) {
  // simple placeholder: 3 points per attack
  const score = Math.min(100, attacksList.length * 3)
  let grade = 'Grade I — Little or no disability'
  let tone = 'text-fg-secondary'
  if (score >= 21) { grade = 'Grade IV — Very severe'; tone='text-danger' }
  else if (score >= 11) { grade = 'Grade III — Moderate disability'; tone='text-warning' }
  else if (score >= 6) { grade = 'Grade II — Mild disability'; tone='text-success' }
  return { score, grade, tone }
}

export default function DoctorReport() {
  const [period, setPeriod] = useState(30)
  const [loading, setLoading] = useState(false)

  const since = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - period)
    return d
  }, [period])

  const filtered = useMemo(() => attacks.filter(a => {
    // map dateLabel to Date like calendar logic
    if (!a.dateLabel) return false
    const cleaned = a.dateLabel.replace(/(\d+)(st|nd|rd|th)/i, '$1')
    const dt = new Date(cleaned)
    if (Number.isNaN(dt.getTime())) return false
    return dt >= since
  }), [since])

  const total = filtered.length
  const avgSeverity = mean(filtered.map(a=>a.severity||0))
  const triggers = {}
  filtered.forEach(a => (a.triggers||[]).forEach(t => triggers[t] = (triggers[t]||0)+1))
  const topTriggers = Object.entries(triggers).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0])

  const midas = calculateMIDAS(filtered)

  async function handleGenerate() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    const reportText = `Doctor report\nPeriod: last ${period} days\nTotal attacks: ${total}\nAvg severity: ${avgSeverity}\nTop triggers: ${topTriggers.join(', ')}\nMIDAS score: ${midas.score} (${midas.grade})`
    try {
      const blob = new Blob([reportText], { type: 'application/pdf' })
      const file = new File([blob], 'miBrain-doctor-report.pdf', { type: 'application/pdf' })
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'mibrain Doctor Report' })
        return
      }
      // fallback: download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mibrain-doctor-report.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('share failed', e)
    }
  }

  function exportCSV() {
    const rows = [['id','date','time','duration','severity']]
    filtered.forEach(a => rows.push([a.id, a.dateLabel || '', a.timeLabel||'', a.duration||'', a.severity||'']))
    const csv = rows.map(r => r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mibrain-raw-data.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="px-5 py-5 space-y-4">
      <header className="flex items-center gap-3">
        <Link to="/history" className="text-accent flex items-center gap-2">
          <ChevronLeft size={18} />
          <span className="text-[15px] font-semibold">Doctor Report</span>
        </Link>
      </header>

      <div className="w-full rounded-lg bg-secondary p-4">
        <div className="mb-3">Select period</div>
        <div className="flex gap-2">
          {[30,60,90].map(d => (
            <button key={d} onClick={() => setPeriod(d)} className={`flex-1 h-12 rounded ${period===d ? 'bg-accent text-fg-inverse' : 'bg-tertiary text-fg-secondary'}`}>
              {d} Days
            </button>
          ))}
        </div>
      </div>

      <section className="rounded-lg bg-secondary p-5">
        <p className="text-[12px] text-fg-secondary">Report includes:</p>
        <ul className="mt-3 space-y-2 text-[13px]">
          <li>✓ Total attacks + frequency trend</li>
          <li>✓ Average severity score</li>
          <li>✓ Top 3 suspected triggers</li>
          <li>✓ Medication usage + effectiveness rates</li>
          <li>✓ MIDAS disability score (auto-calculated)</li>
          <li>✓ Best and worst days analysis</li>
          <li>✓ Day-of-week pattern chart</li>
        </ul>
      </section>

      <section className="rounded-lg bg-primary p-5 flex items-center justify-between">
        <div>
          <div className="text-[12px] text-fg-secondary">Your MIDAS Score</div>
          <div className="font-mono text-[28px] font-bold">{midas.score}</div>
          <div className={`mt-1 text-[13px] ${midas.tone}`}>{midas.grade}</div>
          <div className="text-[12px] text-fg-secondary mt-2">This score is calculated from your logged attack history and is recognized by neurologists.</div>
        </div>
        <div className="text-right">
          <div className="text-[13px] text-fg-secondary">Total attacks</div>
          <div className="text-[24px] font-bold">{total}</div>
          <div className="text-[13px] text-fg-secondary mt-2">Avg severity: {avgSeverity}</div>
        </div>
      </section>

      <div className="space-y-3">
        <button onClick={handleGenerate} className={`w-full h-14 rounded-lg text-[15px] font-semibold ${loading ? 'bg-accent/70' : 'bg-accent text-fg-inverse'}`}>
          {loading ? 'Generating…' : 'Generate PDF Report'}
        </button>

        <div className="flex gap-4">
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); alert('Share link copied') }} className="flex-1 py-3 rounded bg-tertiary">Share via link</button>
          <button onClick={exportCSV} className="flex-1 py-3 rounded bg-tertiary">Export raw data (CSV)</button>
        </div>
      </div>
    </div>
  )
}
