import { useEffect, useMemo, useState } from 'react'
import { Check, Minus, Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../../stores/authStore'

const sleepQualityOptions = ['Restful', 'Disrupted', 'Very poor']
const waterOptions = ['Yes', 'No']
const mealOptions = ['No meals skipped', 'Skipped a meal', 'Skipped multiple']
const scaleValues = [1, 2, 3, 4, 5]

function prettyHours(value) {
  return `${Number(value).toFixed(value % 1 === 0 ? 0 : 1)} hours`
}

function riskScoreFromCheckin(checkin) {
  if (!checkin) return 72

  let score = 64

  if (checkin.sleepHours < 5) score += 10
  else if (checkin.sleepHours < 7) score += 6
  else if (checkin.sleepHours > 9) score -= 2

  if (checkin.sleepQuality === 'Restful') score -= 5
  if (checkin.sleepQuality === 'Disrupted') score += 3
  if (checkin.sleepQuality === 'Very poor') score += 8

  if (checkin.hydration === 'Yes') score -= 3
  else score += 4

  if (checkin.meals === 'No meals skipped') score -= 2
  if (checkin.meals === 'Skipped a meal') score += 3
  if (checkin.meals === 'Skipped multiple') score += 6

  score += (checkin.stressLevel - 1) * 2
  score += (5 - checkin.energyLevel) * 2

  if (checkin.cycleDay) {
    if (checkin.cycleDay <= 5 || checkin.cycleDay >= 26) score += 4
    else if (checkin.cycleDay >= 18 && checkin.cycleDay <= 24) score += 2
  }

  return Math.max(0, Math.min(100, score))
}

function riskLevel(score) {
  if (score < 35) return { label: 'Low', color: 'text-success' }
  if (score < 60) return { label: 'Moderate', color: 'text-warning' }
  if (score < 80) return { label: 'High', color: 'text-sev-7' }
  return { label: 'Very high', color: 'text-sev-9' }
}

function ScaleDots({ value, onChange, label }) {
  return (
    <section className="space-y-3">
      <p className="text-[13px] font-semibold uppercase tracking-widest text-fg-muted">{label}</p>
      <div className="flex items-center justify-between gap-2">
        {scaleValues.map((item) => {
          const selected = value === item
          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              aria-pressed={selected}
              className={`flex h-11 w-11 items-center justify-center rounded-full border text-[15px] font-bold transition-all duration-200 btn-press ${
                selected
                  ? 'border-accent bg-accent text-white'
                  : 'border-white/8 bg-tertiary text-fg-secondary'
              }`}
            >
              {item}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default function CheckIn() {
  const navigate = useNavigate()
  const saveDailyCheckin = useAuthStore((state) => state.saveDailyCheckin)
  const hasCycleOptIn = useAuthStore((state) =>
    state.healthProfile.conditions.includes('menstrual')
  )

  const [step, setStep] = useState(0)
  const [sleepHours, setSleepHours] = useState(7.5)
  const [sleepQuality, setSleepQuality] = useState('Restful')
  const [hydration, setHydration] = useState('Yes')
  const [meals, setMeals] = useState('No meals skipped')
  const [stressLevel, setStressLevel] = useState(3)
  const [energyLevel, setEnergyLevel] = useState(4)
  const [cycleDay, setCycleDay] = useState(7)
  const [saved, setSaved] = useState(false)

  const finalStepIndex = hasCycleOptIn ? 3 : 2
  const isFinalStep = step === finalStepIndex
  const score = useMemo(
    () =>
      riskScoreFromCheckin({
        sleepHours,
        sleepQuality,
        hydration,
        meals,
        stressLevel,
        energyLevel,
        cycleDay: hasCycleOptIn ? cycleDay : null,
      }),
    [sleepHours, sleepQuality, hydration, meals, stressLevel, energyLevel, cycleDay, hasCycleOptIn]
  )
  const level = riskLevel(score)

  useEffect(() => {
    if (!saved) return undefined

    const timer = setTimeout(() => navigate('/'), 1100)
    return () => clearTimeout(timer)
  }, [saved, navigate])

  const completeCheckIn = () => {
    if (saved) return

    saveDailyCheckin({
      sleepHours,
      sleepQuality,
      hydration,
      meals,
      stressLevel,
      energyLevel,
      cycleDay: hasCycleOptIn ? cycleDay : null,
      score,
      completedAt: Date.now(),
    })
    setSaved(true)
  }

  const nextStep = () => {
    if (isFinalStep) {
      completeCheckIn()
      return
    }
    setStep((current) => Math.min(current + 1, finalStepIndex))
  }

  const renderStep = () => {
    if (step === 0) {
      return (
        <section className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-[14px] font-medium text-fg">How did you sleep?</p>
            <p className="font-mono text-[32px] font-bold text-fg">{prettyHours(sleepHours)}</p>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={sleepHours}
            onChange={(event) => setSleepHours(Number(event.target.value))}
            className="checkin-slider"
            aria-label="Sleep hours"
          />
          <div className="flex flex-wrap justify-center gap-2">
            {sleepQualityOptions.map((option) => {
              const selected = sleepQuality === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSleepQuality(option)}
                  aria-pressed={selected}
                  className={`rounded-sm border px-4 py-2.5 text-[13px] font-medium transition-all duration-200 btn-press ${
                    selected
                      ? 'border-accent bg-accent/12 text-accent'
                      : 'border-transparent bg-tertiary text-fg-secondary'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </section>
      )
    }

    if (step === 1) {
      return (
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="text-[14px] font-medium text-fg">Did you drink enough water yesterday?</p>
            <div className="grid grid-cols-2 gap-3">
              {waterOptions.map((option) => {
                const selected = hydration === option
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setHydration(option)}
                    aria-pressed={selected}
                    className={`h-14 rounded-xl border px-4 text-[15px] font-semibold transition-all duration-200 btn-press ${
                      selected
                        ? 'border-accent bg-accent/12 text-accent'
                        : 'border-white/8 bg-tertiary text-fg-secondary'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[14px] font-medium text-fg">Did you skip any meals?</p>
            <div className="grid gap-2">
              {mealOptions.map((option) => {
                const selected = meals === option
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMeals(option)}
                    aria-pressed={selected}
                    className={`h-14 rounded-xl border px-4 text-[15px] font-semibold transition-all duration-200 btn-press ${
                      selected
                        ? 'border-accent bg-accent/12 text-accent'
                        : 'border-white/8 bg-tertiary text-fg-secondary'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )
    }

    if (step === 2) {
      return (
        <section className="space-y-6">
          <ScaleDots value={stressLevel} onChange={setStressLevel} label="Stress level this morning?" />
          <ScaleDots value={energyLevel} onChange={setEnergyLevel} label="Energy level?" />
        </section>
      )
    }

    return (
      <section className="space-y-5">
        <p className="text-[14px] font-medium text-fg">What day of your cycle are you on?</p>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCycleDay((current) => Math.max(1, current - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-tertiary text-fg-secondary btn-press"
            aria-label="Decrease cycle day"
          >
            <Minus size={20} />
          </button>
          <div className="min-w-24 rounded-md bg-secondary px-6 py-4 text-center font-mono text-[28px] font-bold text-fg">
            {cycleDay}
          </div>
          <button
            type="button"
            onClick={() => setCycleDay((current) => Math.min(35, current + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-tertiary text-fg-secondary btn-press"
            aria-label="Increase cycle day"
          >
            <Plus size={20} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => completeCheckIn()}
          className="text-[13px] font-medium text-fg-secondary"
        >
          Skip for today
        </button>
      </section>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-primary px-5 pb-8 pt-4 text-fg">
      <div className="flex items-center justify-between">
        <div className="w-11" />
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 }, (_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                index === step ? 'w-6 bg-accent' : 'w-1.5 bg-tertiary'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary text-fg-secondary btn-press"
          aria-label="Close check-in"
        >
          <X size={20} />
        </button>
      </div>

      <main className="mx-auto flex w-full max-w-107.5 flex-1 flex-col justify-center">
        {!saved ? (
          <section className="space-y-5 anim-fade-in-up">
            <div className="text-center">
              <p className="font-display text-[24px] text-fg">Good morning</p>
              <p className="mt-1 text-[14px] text-fg-muted">30-second check-in</p>
            </div>

            {renderStep()}

            <button
              type="button"
              onClick={nextStep}
              className="h-14 w-full rounded-xl bg-accent text-[16px] font-bold text-fg-inverse btn-press"
            >
              {isFinalStep ? "Done — See Today's Risk" : 'Next'}
            </button>

            <p className="text-center text-[12px] italic text-fg-muted">
              Small inputs now make the risk score sharper later.
            </p>
          </section>
        ) : (
          <section className="flex flex-1 flex-col items-center justify-center gap-4 text-center anim-scale-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/12 text-accent">
              <Check size={28} />
            </div>
            <div>
              <h2 className="font-display text-[24px] text-fg">Check-in saved</h2>
              <p className={`mt-1 text-[13px] font-medium ${level.color}`}>{level.label} risk updated</p>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
