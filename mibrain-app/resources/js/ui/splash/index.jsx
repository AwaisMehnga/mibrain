import { BrainCircuit } from 'lucide-react'

export default function Splash({ isVisible, animate = false }) {
  return (
    <div
      className={`fixed inset-0 z-999 flex items-center justify-center bg-primary transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className={`flex flex-col items-center gap-3 ${animate ? 'anim-fade-in-up' : ''}`}>
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20">
          <BrainCircuit size={32} className="text-accent" strokeWidth={1.8} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-display font-semibold tracking-tight text-fg">miBrain</h1>
          <p className="text-[12px] text-fg-muted">Migraine Tracking & Insights</p>
        </div>
      </div>
    </div>
  )
}
