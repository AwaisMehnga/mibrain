import { useAuthStore } from '../stores/authStore'

export const useAuth = () => {
  const {
    auth,
    healthProfile,
    preferences,
    onboarding,
    isHydrated,
    isBootstrapped,
    setAuth,
    bootstrapAuth,
    login,
    register,
    saveOnboardingProgress,
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
    isHydrated,
    isBootstrapped,

    // Actions
    actions: {
      setAuth,
      bootstrapAuth,
      login,
      register,
      saveOnboardingProgress,
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
