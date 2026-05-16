import React, { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft } from 'lucide-react'

function getRiskColor(score) {
  if (score >= 70) return 'text-danger'
  if (score >= 50) return 'text-warning'
  return 'text-success'
}

function getRiskLabel(score) {
  if (score >= 70) return 'High Risk'
  if (score >= 50) return 'Moderate Risk'
  return 'Low Risk'
}

export default function RiskDetail() {
  const navigate = useNavigate()
  const riskScore = 72
  const riskColor = getRiskColor(riskScore)
  const riskLabel = getRiskLabel(riskScore)

  const { factors, recommendations, sparklineData, trend } = useMemo(() => {
    return {
      factors: [
        { name: 'Poor sleep (5.4h)', impact: '+18 risk', explanation: 'Your most significant factor today.' },
        { name: 'Rising atmospheric pressure', impact: '+12 risk', explanation: 'Barometric changes linked to your patterns.' },
        { name: 'Hydration level', impact: '-8 risk', explanation: 'Good hydration reduces baseline risk.' },
        { name: 'Recent exercise', impact: '-6 risk', explanation: 'Recent activity has protective effect.' },
      ],
      recommendations: ['Drink extra water', 'Avoid screens', 'Rest if possible'],
      sparklineData: [15, 18, 22, 25, 28, 32, 35, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 71, 70, 69, 68, 72],
      trend: 'up',
    }
  }, [])

  const maxRisk = Math.max(...sparklineData)
  const minRisk = Math.min(...sparklineData)
  const range = Math.max(1, maxRisk - minRisk)

  return (
    <div className="px-5 py-5 space-y-4 pb-8 anim-fade-in-up">
      <header className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-fg-secondary text-sm flex items-center gap-1">
          <ChevronLeft className='w-4 h-4' /> Back
        </button>
      </header>

      {/* Hero */}
      <section className="text-center space-y-2 py-6">
        <div className={`font-mono text-[80px] leading-none font-bold ${riskColor}`}>{riskScore}</div>
        <div className={`text-[22px] font-semibold ${riskColor}`}>{riskLabel}</div>
      </section>

      {/* Breakdown */}
      <section className="rounded-lg bg-secondary p-5">
        <h3 className="text-[14px] font-semibold text-fg">What's contributing today:</h3>
        <div className="mt-3 space-y-3">
          {factors.map((factor, i) => (
            <div key={i} className="border-b border-tertiary pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] text-fg">{factor.name}</span>
                <span className={`text-[12px] font-semibold px-2 py-1 rounded-full ${
                  factor.impact.startsWith('-') 
                    ? 'bg-success/12 text-success' 
                    : 'bg-danger/12 text-danger'
                }`}>
                  {factor.impact}
                </span>
              </div>
              <p className="text-[13px] text-fg-secondary mt-1">{factor.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="rounded-lg bg-accent/8 p-5">
        <h3 className="text-[14px] font-semibold text-fg">Based on your patterns, consider:</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {recommendations.map((rec, i) => (
            <div key={i} className="rounded-full bg-accent/12 border border-accent/20 px-3 py-1.5 text-[13px] text-fg">
              {rec}
            </div>
          ))}
        </div>
      </section>

      {/* Historical Context */}
      <section className="rounded-lg bg-secondary p-5">
        <h3 className="text-[14px] font-semibold text-fg">Your risk score over the last 30 days</h3>
        <div className="mt-3 p-3 bg-tertiary rounded-lg">
          <svg viewBox="0 0 300 60" className="w-full h-12 text-accent">
            {(() => {
              const points = sparklineData.map((v, i) => {
                const x = (i / (sparklineData.length - 1)) * 300
                const y = 60 - ((v - minRisk) / range) * 50 - 5
                return `${x},${y}`
              }).join(' ')
              return (
                <>
                  <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={points} />
                  <circle cx={((sparklineData.length - 1) / (sparklineData.length - 1)) * 300} cy={60 - ((sparklineData[sparklineData.length - 1] - minRisk) / range) * 50 - 5} r="2" fill="currentColor" />
                </>
              )
            })()}
          </svg>
          <div className="mt-2 text-[13px] text-fg-secondary">
            {trend === 'up' 
              ? <span className="text-danger">↑ Risk trending upward</span>
              : <span className="text-success">↓ Risk trending downward</span>
            }
          </div>
        </div>
      </section>
    </div>
  )
}
