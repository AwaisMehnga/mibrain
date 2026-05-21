import { useState } from 'react'
import { useNavigate } from 'react-router'
import FormInput from '../../../../ui/components/FormInput'
import { useAuth } from '../../../../mibrain/hooks/useAuth'

export default function CreateAccount() {
  const navigate = useNavigate()
  const { actions } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setTimeout(() => {
      actions.createAccount(formData.email, formData.password, formData.name)
      actions.completeOnboarding()
      navigate('/')
    }, 500)
  }

  return (
    <div className="flex flex-col h-screen bg-primary">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-6 shrink-0">
        <div className="flex-1" />
        <span className="text-[13px] font-medium text-fg-muted">4 of 4</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5">
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <h2 className="text-[26px] font-display font-semibold text-fg leading-tight">
              Create your account
            </h2>
            <p className="text-[15px] text-fg-secondary">
              Your data stays private and encrypted. Always.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Full Name"
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              autoComplete="name"
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="new-password"
            />

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            {/* Privacy Note */}
            <p className="text-[12px] text-fg-muted text-center mt-6">
              We never sell your data.{' '}
              <button type="button" className="text-accent hover:underline">
                See our Privacy Policy
              </button>
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-accent text-fg-inverse rounded-xl font-semibold text-[15px] transition-all duration-200 hover:bg-accent active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <button
              onClick={() => navigate('/setup/signin')}
              className="text-[14px] text-fg-muted hover:text-fg transition-colors"
            >
              Already have an account?{' '}
              <span className="text-accent font-semibold">Sign in</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
