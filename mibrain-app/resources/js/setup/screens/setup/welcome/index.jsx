import { useNavigate } from 'react-router'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-screen bg-primary">
      {/* Illustration Area - Top 55% */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 400" xmlns="http://www.w3.org/2000/svg">
          {/* Soft gradient background */}
          <defs>
            <radialGradient id="softGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7C6EF5" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#7C6EF5" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background glow */}
          <circle cx="195" cy="200" r="200" fill="url(#softGlow)" />

          {/* Ellipse 1 - Violet */}
          <ellipse cx="120" cy="140" rx="90" ry="120" fill="#7C6EF5" opacity="0.12" />

          {/* Ellipse 2 - Indigo */}
          <ellipse cx="270" cy="160" rx="85" ry="110" fill="#6366F1" opacity="0.1" />

          {/* Ellipse 3 - Slate */}
          <ellipse cx="195" cy="280" rx="100" ry="90" fill="#8B92A8" opacity="0.08" />
        </svg>

        {/* Brain icon centered */}
        <div className="relative z-10">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/15">
            <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Area - Bottom 45% */}
      <div className="flex flex-col gap-6 px-5 pb-12">
        <div className="space-y-3 anim-fade-in-up">
          <h1 className="text-4xl font-display font-semibold text-fg leading-tight">
            Finally understand your migraines.
          </h1>
          <p className="text-[15px] text-fg-secondary leading-relaxed">
            mibrain learns your personal triggers and warns you before attacks hit. Built for real migraine life.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => navigate('/setup/conditions')}
          className="w-full h-14 bg-accent text-fg-inverse rounded-xl font-semibold text-[15px] transition-all duration-200 hover:bg-accent active:scale-95 shadow-lg"
        >
          Get Started
        </button>

        {/* Secondary Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/setup/login')}
            className="text-[14px] text-accent hover:text-accent/80 transition-colors"
          >
            Already have an account? <span className="font-semibold underline">Sign in</span>
          </button>
        </div>
      </div>
    </div>
  )
}
