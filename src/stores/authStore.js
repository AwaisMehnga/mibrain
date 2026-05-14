import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  auth: {
    isAuthenticated: false,
    isOnboarded: false,
    user: null,
    token: null,
  },
  healthProfile: {
    conditions: [],
    triggers: [],
    medications: {
      acute: [],
      preventive: [],
    },
  },
  preferences: {
    notificationsEnabled: false,
    riskAlertTime: '07:30',
    checkinTime: '08:00',
    panicButtonLocation: 'home-screen',
    theme: 'dark',
  },
  onboarding: {
    completedSteps: [],
    currentStep: 'welcome',
  },
}

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,

      // Auth actions
      setAuth: (auth) => set((state) => ({ auth: { ...state.auth, ...auth } })),
      createAccount: (email, password, name) =>
        set((state) => ({
          auth: {
            ...state.auth,
            isAuthenticated: true,
            user: { id: Date.now(), email, name },
            token: `token_${Date.now()}`,
          },
          onboarding: { ...state.onboarding, completedSteps: ['welcome', 'conditions', 'triggers', 'medications', 'notifications', 'create-account'] },
        })),
      signIn: (email, password) =>
        set((state) => ({
          auth: {
            ...state.auth,
            isAuthenticated: true,
            user: { id: Date.now(), email, name: email.split('@')[0] },
            token: `token_${Date.now()}`,
          },
        })),
      logout: () => set(initialState),

      // Onboarding actions
      setConditions: (conditions) =>
        set((state) => ({
          healthProfile: { ...state.healthProfile, conditions },
          onboarding: { ...state.onboarding, currentStep: 'triggers' },
        })),
      setTriggers: (triggers) =>
        set((state) => ({
          healthProfile: { ...state.healthProfile, triggers },
          onboarding: { ...state.onboarding, currentStep: 'medications' },
        })),
      setAcuteMedications: (acute) =>
        set((state) => ({
          healthProfile: {
            ...state.healthProfile,
            medications: { ...state.healthProfile.medications, acute },
          },
          onboarding: { ...state.onboarding, currentStep: 'notifications' },
        })),
      setPreventiveMedications: (preventive) =>
        set((state) => ({
          healthProfile: {
            ...state.healthProfile,
            medications: { ...state.healthProfile.medications, preventive },
          },
        })),

      // Preferences actions
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      // Onboarding completion
      completeOnboarding: () =>
        set((state) => ({
          auth: { ...state.auth, isOnboarded: true },
          onboarding: { ...state.onboarding, completedSteps: ['all'] },
        })),

      // Reset
      resetOnboarding: () => set({ ...initialState }),
    }),
    {
      name: 'mibrain-auth-store',
      partialize: (state) => ({
        auth: state.auth,
        healthProfile: state.healthProfile,
        preferences: state.preferences,
        onboarding: state.onboarding,
      }),
    }
  )
)
