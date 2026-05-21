import { useState } from 'react'
import { useNavigate } from 'react-router'
import OnboardingLayout from '../components/OnboardingLayout'
import { useAuth } from '../../../../mibrain/hooks/useAuth'

const ACUTE_MEDS = [
  'Sumatriptan',
  'Rizatriptan',
  'Nurtec',
  'Ubrelvy',
  'Excedrin',
  'Ibuprofen',
  'Acetaminophen',
]

const PREVENTIVE_MEDS = [
  'Topiramate',
  'Amitriptyline',
  'Propranolol',
  'Aimovig',
  'Ajovy',
  'Emgality',
]

export default function Medications() {
  const navigate = useNavigate()
  const { actions } = useAuth()
  const [acuteMeds, setAcuteMeds] = useState([])
  const [preventiveMeds, setPreventiveMeds] = useState([])

  const handleToggleAcute = (med) => {
    setAcuteMeds((prev) =>
      prev.includes(med) ? prev.filter((x) => x !== med) : [...prev, med]
    )
  }

  const handleTogglePreventive = (med) => {
    setPreventiveMeds((prev) =>
      prev.includes(med) ? prev.filter((x) => x !== med) : [...prev, med]
    )
  }

  const handleContinue = () => {
    actions.setAcuteMedications(acuteMeds)
    actions.setPreventiveMedications(preventiveMeds)
    void actions.saveOnboardingProgress({ currentStep: 'notifications', isComplete: false })
    navigate('/setup/notifications')
  }

  return (
    <OnboardingLayout
      step={3}
      totalSteps={5}
      onContinue={handleContinue}
      continueLabel="Continue"
    >
      <div className="space-y-6 py-6">
        <div className="space-y-2">
          <h2 className="text-[26px] font-display font-semibold text-fg leading-tight">
            What medications do you use?
          </h2>
          <p className="text-[15px] text-fg-secondary">
            For tracking effectiveness. mibrain never shares this with anyone.
          </p>
        </div>

        {/* Acute Medications */}
        <div className="space-y-3">
          <h3 className="text-[12px] uppercase font-semibold tracking-widest text-fg-muted">
            Acute / Rescue Medications
          </h3>
          <div className="flex flex-wrap gap-2">
            {ACUTE_MEDS.map((med) => (
              <button
                key={med}
                onClick={() => handleToggleAcute(med)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                  acuteMeds.includes(med)
                    ? 'bg-accent text-fg-inverse'
                    : 'bg-secondary text-fg-secondary hover:border-accent/30'
                }`}
              >
                {med}
              </button>
            ))}
          </div>
          <button className="text-[14px] text-accent font-medium mt-2">
            + Add custom medication
          </button>
        </div>

        {/* Preventive Medications */}
        <div className="space-y-3">
          <h3 className="text-[12px] uppercase font-semibold tracking-widest text-fg-muted">
            Preventive Medications
          </h3>
          <div className="flex flex-wrap gap-2">
            {PREVENTIVE_MEDS.map((med) => (
              <button
                key={med}
                onClick={() => handleTogglePreventive(med)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                  preventiveMeds.includes(med)
                    ? 'bg-accent text-fg-inverse'
                    : 'bg-secondary text-fg-secondary hover:border-accent/30'
                }`}
              >
                {med}
              </button>
            ))}
          </div>
          <button className="text-[14px] text-accent font-medium mt-2">
            + Add custom medication
          </button>
        </div>

        <button
          onClick={() => navigate('/setup/notifications')}
          className="text-[14px] text-fg-muted hover:text-fg transition-colors mt-4"
        >
          I'll add this later
        </button>
      </div>
    </OnboardingLayout>
  )
}
