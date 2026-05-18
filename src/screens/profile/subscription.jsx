import { ChevronLeft, Check, Crown } from 'lucide-react'
import { useState } from 'react'

function PlanCard({ title, price, period, savings, recommended, features, onClick }) {
  return (
    <div
      className={`rounded-lg p-5 space-y-4 relative ${
        recommended ? 'bg-accent/10 border-2 border-accent' : 'bg-secondary border-2 border-tertiary'
      }`}
    >
      {recommended && (
        <div className="absolute top-3 right-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-fg-inverse">
          Best Value
        </div>
      )}
      <div>
        <p className="text-[13px] text-fg-secondary">{title}</p>
        <div className="flex items-baseline gap-1 mt-2">
          <p className="font-mono text-[28px] font-bold text-fg">${price}</p>
          <p className="text-[14px] text-fg-secondary">/{period}</p>
        </div>
        {savings && <p className="text-[12px] font-medium text-success mt-1">{savings}</p>}
      </div>
      <button
        onClick={onClick}
        className={`w-full py-3 rounded-lg text-[13px] font-semibold ${
          recommended ? 'bg-accent text-fg-inverse' : 'bg-tertiary text-fg'
        }`}
      >
        Choose Plan
      </button>
    </div>
  )
}

export default function Subscription({ onBack }) {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const features = [
    'AI trigger analysis (unlocks after 14 days)',
    'Daily risk score predictions',
    'Doctor report PDF export',
    'Full attack history (unlimited)',
    'Voice logging',
    'Medication effectiveness tracking',
    'Weekly AI insights digest',
    'Priority support',
  ]

  const handleStartTrial = async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setIsLoading(false)
    alert('14-day free trial started! Enjoy mibrain Pro.')
  }

  return (
    <div className="px-5 py-5 pb-8 space-y-5 anim-fade-in-up">
      <header className="flex items-center gap-3">
        <button onClick={onBack} className="text-accent flex items-center gap-2">
          <ChevronLeft size={18} />
          <span className="text-[15px] font-semibold">mibrain Pro</span>
        </button>
      </header>

      {/* Hero */}
      <div className="rounded-lg bg-linear-to-br from-accent/20 to-accent/5 p-6 space-y-2">
        <div className="flex items-center gap-2">
          <Crown size={20} className="text-accent" />
          <p className="text-[22px] font-semibold text-fg">Unlock everything</p>
        </div>
        <p className="text-[14px] text-fg-secondary">AI trigger analysis, doctor reports, full history, voice logging</p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-2 gap-3">
        <PlanCard
          title="Monthly"
          price="6.99"
          period="month"
          features={features}
          onClick={() => setSelectedPlan('monthly')}
        />
        <PlanCard
          title="Annual"
          price="49.99"
          period="year"
          savings="Save 40% ($33.65/year)"
          recommended
          features={features}
          onClick={() => setSelectedPlan('annual')}
        />
      </div>

      {/* Feature List */}
      <section className="space-y-3">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-fg-secondary">What's included</p>
        <div className="space-y-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Check size={16} className="text-success shrink-0" />
              <p className="text-[13px] text-fg">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <button
        onClick={handleStartTrial}
        disabled={isLoading}
        className={`w-full h-14 rounded-lg text-[15px] font-semibold ${
          isLoading ? 'bg-accent/70' : 'bg-accent text-fg-inverse'
        }`}
      >
        {isLoading ? 'Starting trial...' : 'Start 14-Day Free Trial'}
      </button>

      <p className="text-center text-[12px] text-fg-secondary">No credit card required</p>
    </div>
  )
}
