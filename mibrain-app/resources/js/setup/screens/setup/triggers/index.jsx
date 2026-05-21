import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Moon, Sun, Cloud, Smartphone, Coffee, Wine, Brain, UtensilsCrossed,
  Flower2, Droplets, Wind, Lightbulb, Plane, Volume2,
} from 'lucide-react'
import OnboardingLayout from '../components/OnboardingLayout'
import { useAuth } from '../../../../mibrain/hooks/useAuth'

const TRIGGERS = [
  { id: 'sleep', label: 'Poor sleep', icon: Moon },
  { id: 'light', label: 'Bright light', icon: Sun },
  { id: 'weather', label: 'Weather change', icon: Cloud },
  { id: 'screen', label: 'Screen time', icon: Smartphone },
  { id: 'caffeine', label: 'Caffeine', icon: Coffee },
  { id: 'alcohol', label: 'Alcohol', icon: Wine },
  { id: 'stress', label: 'Stress', icon: Brain },
  { id: 'meals', label: 'Skipped meals', icon: UtensilsCrossed },
  { id: 'hormones', label: 'Hormonal changes', icon: Flower2 },
  { id: 'hydration', label: 'Dehydration', icon: Droplets },
  { id: 'smells', label: 'Strong smells', icon: Wind },
  { id: 'exercise', label: 'Exercise', icon: Lightbulb },
  { id: 'travel', label: 'Travel / altitude', icon: Plane },
  { id: 'noise', label: 'Loud noise', icon: Volume2 },
]

export default function Triggers() {
  const navigate = useNavigate()
  const { actions } = useAuth()
  const [selected, setSelected] = useState([])

  const handleToggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleContinue = () => {
    actions.setTriggers(selected)
    navigate('/setup/medications')
  }

  return (
    <OnboardingLayout
      step={2}
      totalSteps={4}
      onContinue={handleContinue}
      continueDisabled={selected.length === 0}
    >
      <div className="space-y-6 py-6">
        <div className="space-y-2">
          <h2 className="text-[26px] font-display font-semibold text-fg leading-tight">
            What usually triggers your migraines?
          </h2>
          <p className="text-[15px] text-fg-secondary">
            Select all that apply. mibrain tracks these automatically when possible.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {TRIGGERS.map((trigger) => {
            const Icon = trigger.icon
            const isSelected = selected.includes(trigger.id)
            return (
              <button
                key={trigger.id}
                onClick={() => handleToggle(trigger.id)}
                className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-all duration-200 ${
                  isSelected
                    ? 'bg-accent/20 border-2 border-accent'
                    : 'bg-secondary border-2 border-tertiary hover:border-accent/30'
                }`}
              >
                <Icon
                  size={28}
                  className={isSelected ? 'text-accent' : 'text-fg-secondary'}
                  strokeWidth={1.5}
                />
                <span
                  className={`text-[12px] font-medium text-center leading-tight ${
                    isSelected ? 'text-accent' : 'text-fg-secondary'
                  }`}
                >
                  {trigger.label}
                </span>
                {isSelected && (
                  <svg
                    className="absolute top-1 right-1 w-4 h-4 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </OnboardingLayout>
  )
}
