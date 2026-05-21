import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="flex flex-col gap-2 mb-4">
      {label && (
        <label htmlFor={name} className="text-[13px] font-medium text-fg-secondary">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full h-12 px-4 rounded-lg bg-input border-2 transition-all duration-200 text-[15px] text-fg placeholder:text-fg-muted outline-none ${
            error
              ? 'border-danger/40 focus:border-danger'
              : 'border-tertiary focus:border-accent/50'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 text-fg-muted hover:text-fg transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-[12px] text-danger font-medium">{error}</span>
      )}
    </div>
  )
}

