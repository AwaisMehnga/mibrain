export default function SelectCard({
  icon: Icon,
  title,
  description,
  isSelected,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-3 p-4 rounded-lg transition-all duration-200 ${
        isSelected
          ? 'bg-secondary border-2 border-accent'
          : 'bg-secondary border-2 border-transparent hover:border-accent/30'
      }`}
    >
      {/* Icon Circle */}
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg shrink-0 ${
        isSelected ? 'bg-accent/20' : 'bg-tertiary'
      }`}>
        <Icon size={24} className={isSelected ? 'text-accent' : 'text-fg-secondary'} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="flex-1 text-left min-w-0">
        <h3 className="text-[15px] font-semibold text-fg leading-tight">{title}</h3>
        <p className="text-[13px] text-fg-secondary mt-1 leading-relaxed">{description}</p>
      </div>

      {/* Checkbox */}
      <div
        className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-1 transition-all duration-200 ${
          isSelected ? 'bg-accent' : 'bg-tertiary border border-accent/30'
        }`}
      >
        {isSelected && <svg className="w-4 h-4 text-fg-inverse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
    </button>
  )
}
