import { useAuthStore } from '../stores/authStore'

export const useAuth = () => {
  const {
    auth,
    healthProfile,
    preferences,
    onboarding,
    setAuth,
    createAccount,
    signIn,
    logout,
    setConditions,
    setTriggers,
    setAcuteMedications,
    setPreventiveMedications,
    updatePreferences,
    completeOnboarding,
    resetOnboarding,
  } = useAuthStore()

  return {
    // State
    auth,
    healthProfile,
    preferences,
    onboarding,

    // Actions
    actions: {
      setAuth,
      createAccount,
      signIn,
      logout,
      setConditions,
      setTriggers,
      setAcuteMedications,
      setPreventiveMedications,
      updatePreferences,
      completeOnboarding,
      resetOnboarding,
    },
  }
}
