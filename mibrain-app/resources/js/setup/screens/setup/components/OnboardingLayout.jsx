import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function OnboardingLayout({
  step,
  totalSteps,
  onBack,
  children,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
}) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-primary">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-6 shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-secondary transition-colors"
        >
          <ChevronLeft size={24} className="text-fg" strokeWidth={2} />
        </button>
        <span className="text-[13px] font-medium text-fg-muted">
          {step} of {totalSteps}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5">{children}</div>

      {/* Bottom Button */}
      <div className="px-5 pb-8 pt-6 shrink-0">
        <button
          onClick={onContinue}
          disabled={continueDisabled}
          className={`w-full h-14 rounded-xl font-semibold text-[15px] transition-all duration-200 ${
            continueDisabled
              ? 'bg-accent/40 text-fg-muted cursor-not-allowed'
              : 'bg-accent text-fg-inverse hover:bg-accent active:scale-95'
          }`}
        >
          {continueLabel}
        </button>
      </div>
    </div>
  )
}
