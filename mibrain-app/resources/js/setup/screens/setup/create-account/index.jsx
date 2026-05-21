import { useState } from 'react'
import { useNavigate } from 'react-router'
import FormInput from '../../../../ui/components/FormInput'
import { useAuth } from '../../../../mibrain/hooks/useAuth'
import OnboardingLayout from '../components/OnboardingLayout'

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

  const handleSubmit = async (e) => {
    if (e?.preventDefault) {
      e.preventDefault()
    }

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      await actions.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      })
      navigate('/setup/conditions', { replace: true })
    } catch (error) {
      const serverErrors = error?.response?.data?.error?.fields ?? error?.response?.data?.errors ?? {}
      setErrors({
        name: serverErrors.name?.[0] ?? serverErrors.name,
        email: serverErrors.email?.[0] ?? serverErrors.email,
        password: serverErrors.password?.[0] ?? serverErrors.password,
        confirmPassword: serverErrors.password_confirmation?.[0] ?? serverErrors.password_confirmation,
        form: error?.response?.data?.error?.message ?? error?.response?.data?.message ?? 'Unable to create your account.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <OnboardingLayout step={1} totalSteps={5} onBack={() => navigate('/setup/login')} continueLabel="Create Account" onContinue={handleSubmit} continueDisabled={isLoading}>
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
          {errors.form && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-[13px] text-danger">
              {errors.form}
            </div>
          )}

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

          <p className="text-[12px] text-fg-muted text-center mt-6">
            We never sell your data.{' '}
            <button type="button" className="text-accent hover:underline">
              See our Privacy Policy
            </button>
          </p>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate('/setup/login')}
            className="text-[14px] text-fg-muted hover:text-fg transition-colors"
          >
            Already have an account?{' '}
            <span className="text-accent font-semibold">Sign in</span>
          </button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
