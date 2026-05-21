export default function SelectChip({
  label,
  isSelected,
  onClick,
  icon: Icon,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
        isSelected
          ? 'bg-accent/20 border border-accent'
          : 'bg-secondary border border-secondary hover:border-accent/30'
      }`}
    >
      {Icon && (
        <div className="text-2xl">
          <Icon size={28} className={isSelected ? 'text-accent' : 'text-fg-secondary'} strokeWidth={1.5} />
        </div>
      )}
      <span className={`text-[13px] font-medium text-center leading-tight ${
        isSelected ? 'text-accent' : 'text-fg-secondary'
      }`}>
        {label}
      </span>
      {isSelected && (
        <svg className="w-4 h-4 text-accent absolute top-1 right-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  )
}
