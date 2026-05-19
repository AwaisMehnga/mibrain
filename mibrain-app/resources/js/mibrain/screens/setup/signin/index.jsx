import { useState } from 'react'
import { useNavigate } from 'react-router'
import FormInput from '../../../ui/components/FormInput'
import { useAuth } from '../../../hooks/useAuth'

export default function SignIn() {
  const navigate = useNavigate()
  const { actions } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
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
      actions.signIn(formData.email, formData.password)
      actions.completeOnboarding()
      navigate('/')
    }, 500)
  }

  return (
    <div className="flex flex-col h-screen bg-primary">
      {/* Header */}
      <div className="flex items-center justify-center pt-8 pb-8 shrink-0">
        <h1 className="text-[28px] font-display font-semibold text-fg">mibrain</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 flex flex-col justify-center">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-[22px] font-semibold text-fg">Welcome back.</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-[13px] font-medium text-fg-secondary">
                Password
              </label>
              <button
                type="button"
                onClick={() => {}}
                className="text-[13px] text-accent hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <FormInput
              label={null}
              name="password"
              type="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-accent text-fg-inverse rounded-xl font-semibold text-[15px] transition-all duration-200 hover:bg-accent active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <button
              onClick={() => navigate('/setup/welcome')}
              className="text-[14px] text-fg-muted hover:text-fg transition-colors"
            >
              Don't have an account?{' '}
              <span className="text-accent font-semibold">Get started</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
