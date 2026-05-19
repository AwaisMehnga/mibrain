import { useEffect, useMemo, useRef, useState } from 'react'
import { LoaderCircle, Mic, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

const fullTranscript = 'Migraine started around 11:42 AM, severity 7, right temple, took Sumatriptan 100mg.'
const parsedFields = ['Severity: 7', 'Right temple', 'Sumatriptan']

const statusLabel = {
  idle: 'Tap to start',
  listening: 'Listening...',
  processing: 'Processing...',
  done: 'Got it.',
}

const guidanceText = "Speak naturally. Try: 'Migraine started, severity 8, right temple, took Sumatriptan'"

function nextBars() {
  return Array.from({ length: 15 }, (_, index) => {
    const base = 18 + Math.round(Math.sin(index * 0.7) * 6)
    return Math.max(10, base + Math.floor(Math.random() * 38))
  })
}

export default function VoiceLog() {
  const navigate = useNavigate()
  const waveTimerRef = useRef(null)
  const transcriptTimerRef = useRef(null)
  const processingTimerRef = useRef(null)

  const [phase, setPhase] = useState('idle')
  const [bars, setBars] = useState(() => Array.from({ length: 15 }, () => 14))
  const [transcript, setTranscript] = useState('')

  const isListening = phase === 'listening'
  const isProcessing = phase === 'processing'
  const showTranscript = transcript.length > 0 || phase === 'done'

  const buttonClasses = useMemo(() => {
    if (isListening) return 'bg-accent text-white'
    if (isProcessing) return 'border-2 border-accent bg-transparent text-accent'
    return 'bg-tertiary text-fg-secondary'
  }, [isListening, isProcessing])

  useEffect(() => {
    if (!isListening) return undefined

    waveTimerRef.current = setInterval(() => {
      setBars(nextBars())
    }, 110)

    let index = 0
    transcriptTimerRef.current = setInterval(() => {
      index += 2
      setTranscript(fullTranscript.slice(0, index))
      if (index >= fullTranscript.length) {
        clearInterval(transcriptTimerRef.current)
        setPhase('processing')
      }
    }, 65)

    return () => {
      if (waveTimerRef.current) clearInterval(waveTimerRef.current)
      if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current)
    }
  }, [isListening])

  useEffect(() => {
    if (!isProcessing) return undefined

    processingTimerRef.current = setTimeout(() => {
      setPhase('done')
      setBars(Array.from({ length: 15 }, () => 14))
      setTranscript(fullTranscript)
    }, 1200)

    return () => {
      if (processingTimerRef.current) clearTimeout(processingTimerRef.current)
    }
  }, [isProcessing])

  useEffect(
    () => () => {
      if (waveTimerRef.current) clearInterval(waveTimerRef.current)
      if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current)
      if (processingTimerRef.current) clearTimeout(processingTimerRef.current)
    },
    []
  )

  const startVoiceCapture = () => {
    if (phase === 'listening' || phase === 'processing') return
    setTranscript('')
    setPhase('listening')
  }

  const logAttack = () => {
    navigate('/')
  }

  const editDetails = () => {
    navigate('/log/attack')
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-primary px-5 pb-8 pt-4 text-fg">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary text-fg-secondary btn-press"
          aria-label="Close voice log"
        >
          <X size={20} />
        </button>
      </div>

      <main className="mx-auto flex w-full max-w-107.5 flex-1 flex-col items-center justify-center">
        <section className="w-full max-w-85 space-y-6 text-center">
          <p className="font-display text-[22px] text-fg">{statusLabel[phase]}</p>

          <div className="relative mx-auto h-30 w-30">
            {isListening && (
              <>
                <span className="pointer-events-none absolute inset-0 rounded-full border border-accent/50 anim-pulse-ring" />
                <span
                  className="pointer-events-none absolute inset-0 rounded-full border border-accent/35 anim-pulse-ring"
                  style={{ animationDelay: '0.45s' }}
                />
              </>
            )}

            <button
              type="button"
              onClick={startVoiceCapture}
              className={`relative z-10 flex h-30 w-30 items-center justify-center rounded-full transition-all duration-200 btn-press ${buttonClasses}`}
              aria-label="Tap to speak"
            >
              {isProcessing ? (
                <LoaderCircle size={38} className="animate-spin" />
              ) : (
                <Mic size={40} />
              )}
            </button>
          </div>

          {isListening && (
            <div className="flex h-14 items-end justify-center gap-1 rounded-md bg-secondary px-3 py-2">
              {bars.map((height, index) => (
                <span
                  key={index}
                  className="w-1.5 rounded-full bg-accent transition-all duration-100"
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          )}

          {showTranscript && (
            <section className="space-y-3 rounded-md bg-secondary p-4 text-left">
              <p className="text-[14px] leading-relaxed text-fg">{transcript}</p>
              <div className="flex flex-wrap gap-2">
                {parsedFields.map((field) => (
                  <span
                    key={field}
                    className="rounded-full border border-accent/20 bg-accent/12 px-3 py-1.5 text-[12px] font-medium text-accent"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </section>
          )}

          {phase === 'done' && (
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={logAttack}
                className="h-14 w-full rounded-xl bg-accent text-[16px] font-bold text-fg-inverse btn-press"
              >
                Log this attack
              </button>
              <Link
                to="/log"
                className="text-[14px] text-fg-secondary"
              >
                Edit details first
              </Link>
            </div>
          )}
        </section>
      </main>

      <p className="mx-auto max-w-95 text-center text-[12px] italic text-fg-muted">
        {guidanceText}
      </p>
    </div>
  )
}
