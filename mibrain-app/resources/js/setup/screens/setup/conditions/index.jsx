import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Brain, Zap, Eye, Pill, Calendar, Cloud } from 'lucide-react'
import OnboardingLayout from '../components/OnboardingLayout'
import SelectCard from '../../../../ui/components/SelectCard'
import { useAuth } from '../../../../mibrain/hooks/useAuth'

const CONDITIONS = [
  {
    id: 'chronic',
    icon: Brain,
    title: 'Chronic Migraine',
    description: 'More than 15 headache days per month',
  },
  {
    id: 'episodic',
    icon: Zap,
    title: 'Episodic Migraine',
    description: 'Fewer than 15 headache days per month',
  },
  {
    id: 'aura',
    icon: Eye,
    title: 'Migraine with Aura',
    description: 'Visual or sensory symptoms before attacks',
  },
  {
    id: 'preventive',
    icon: Pill,
    title: 'Currently on preventive medication',
    description: 'Taking daily preventive drugs',
  },
  {
    id: 'menstrual',
    icon: Calendar,
    title: 'Menstrual migraines',
    description: 'Attacks linked to my cycle',
  },
  {
    id: 'weather',
    icon: Cloud,
    title: 'Weather-sensitive',
    description: 'Barometric pressure triggers my attacks',
  },
]

export default function Conditions() {
  const navigate = useNavigate()
  const { actions } = useAuth()
  const [selected, setSelected] = useState([])

  const handleToggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleContinue = () => {
    actions.setConditions(selected)
    navigate('/setup/triggers')
  }

  return (
    <OnboardingLayout
      step={1}
      totalSteps={4}
      onContinue={handleContinue}
      continueDisabled={selected.length === 0}
    >
      <div className="space-y-6 py-6">
        <div className="space-y-2">
          <h2 className="text-[26px] font-display font-semibold text-fg leading-tight">
            What brings you to mibrain?
          </h2>
          <p className="text-[15px] text-fg-secondary">
            This helps us personalize your experience. You can change this anytime.
          </p>
        </div>

        <div className="space-y-3">
          {CONDITIONS.map((condition) => (
            <SelectCard
              key={condition.id}
              icon={condition.icon}
              title={condition.title}
              description={condition.description}
              isSelected={selected.includes(condition.id)}
              onClick={() => handleToggle(condition.id)}
            />
          ))}
        </div>
      </div>
    </OnboardingLayout>
  )
}
