import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Check, X } from 'lucide-react'

export default function PanicAttack() {
  const navigate = useNavigate()
  const [severity, setSeverity] = useState(null)
  const [tookMedication, setTookMedication] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [timeLabel, setTimeLabel] = useState(() =>
    new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date())
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLabel(
        new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date())
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!confirmed) return undefined

    const timer = setTimeout(() => navigate('/'), 2000)
    return () => clearTimeout(timer)
  }, [confirmed, navigate])

  const handleConfirm = () => {
    if (!severity || confirmed) return
    setConfirmed(true)
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-panic text-panic-txt">

      <header className="relative flex items-center justify-between px-5 pt-[env(safe-area-inset-top,0px)] h-[calc(60px+env(safe-area-inset-top,0))]">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex h-11 w-11 items-center justify-center rounded-full text-fg-muted transition-colors duration-200 hover:bg-white/5"
          aria-label="Close panic mode"
        >
          <X size={18} />
        </button>

        <p className="absolute left-1/2 -translate-x-1/2 font-mono text-[14px] text-fg-muted">
          {timeLabel}
        </p>

        <div className="w-11" />
      </header>

      <main className="relative flex flex-1 flex-col justify-center px-5 pb-6">
        {!confirmed ? (
          <div className="mx-auto w-full max-w-97.5 space-y-6">
            <div className="text-center">
              <h1 className="font-display text-[24px] leading-tight text-panic-txt">How bad is it?</h1>
            </div>

            <section className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, index) => {
                const level = index + 1
                const isSelected = severity === level
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSeverity(level)}
                    className={`flex aspect-square items-center justify-center rounded-md border transition-all duration-200 ${isSelected ? 'border-fg/25 bg-fg/10 text-fg' : 'border-white/8 bg-tertiary text-panic-txt/80'} btn-press`}
                    aria-pressed={isSelected}
                  >
                    <span className="font-mono text-[22px] font-bold">{level}</span>
                  </button>
                )
              })}
            </section>

            {severity && (
              <section className="space-y-4 anim-slide-up">
                <h2 className="text-center text-[18px] font-medium text-panic-txt">
                  Did you take medication?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTookMedication(true)}
                    className={`h-14 rounded-xl border px-4 text-[15px] font-semibold transition-all duration-200 ${tookMedication === true ? 'border-fg/25 bg-fg/10 text-fg' : 'border-white/8 bg-tertiary text-panic-txt/80'}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setTookMedication(false)}
                    className={`h-14 rounded-xl border px-4 text-[15px] font-semibold transition-all duration-200 ${tookMedication === false ? 'border-fg/25 bg-fg/10 text-fg' : 'border-white/8 bg-tertiary text-panic-txt/80'}`}
                  >
                    Not yet
                  </button>
                </div>
              </section>
            )}
          </div>
        ) : (
          <section className="flex flex-1 flex-col items-center justify-center gap-4 text-center anim-fade-in-up">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger/15 text-panic-txt">
              <Check size={36} />
            </div>
            <h2 className="font-display text-[20px] text-panic-txt">Attack logged</h2>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-[13px] text-fg-muted underline underline-offset-4"
            >
              Add more details later
            </button>
          </section>
        )}

        {!confirmed && (
          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!severity}
              className="relative flex h-16 w-full items-center justify-center rounded-xl bg-panic-btn text-[18px] font-bold text-fg-inverse transition-all duration-200 disabled:opacity-50 btn-press"
            >
              Log Attack
            </button>

            {severity && (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="mx-auto block text-[13px] text-fg-muted underline underline-offset-4"
              >
                Add more details later
              </button>
            )}
          </div>
        )}

        {confirmed && (
          <div className="pointer-events-none absolute inset-0 bg-danger/15 anim-fade-in-up" />
        )}
      </main>
    </div>
  )
}
