import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getCurrentUser, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../services/auth'
import { completeOnboarding as completeOnboardingRequest, saveOnboardingProgress as saveOnboardingProgressRequest } from '../services/onboarding'

function createInitialState() {
  return {
    auth: {
      isAuthenticated: false,
      isOnboarded: false,
      user: null,
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
    dailyCheckin: null,
    onboarding: {
      completedSteps: [],
      currentStep: 'welcome',
    },
    isHydrated: false,
    isBootstrapped: false,
  }
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...createInitialState(),

      setHydrated: (isHydrated) => set({ isHydrated }),
      setAuth: (auth) => set((state) => ({ auth: { ...state.auth, ...auth } })),

      bootstrapAuth: async () => {
        if (get().isBootstrapped) {
          return get().auth
        }

        try {
          const payload = await getCurrentUser()
          const user = payload?.user ?? null

          if (user) {
            set((state) => ({
              auth: {
                ...state.auth,
                isAuthenticated: true,
                user,
                isOnboarded: Boolean(user.isOnboarded),
              },
              preferences: payload?.preferences ?? state.preferences,
            }))
          } else {
            set((state) => ({
              auth: {
                ...state.auth,
                isAuthenticated: false,
                isOnboarded: false,
                user: null,
              },
            }))
          }
        } catch {
          set((state) => ({
            auth: {
              ...state.auth,
              isAuthenticated: false,
              isOnboarded: false,
              user: null,
            },
          }))
        } finally {
          set({ isBootstrapped: true })
        }

        return get().auth
      },

      login: async (credentials) => {
        const payload = await loginRequest(credentials)
        const user = payload?.user ?? null

        set((state) => ({
          auth: {
            ...state.auth,
            isAuthenticated: true,
            isOnboarded: Boolean(user?.isOnboarded),
            user,
          },
          isBootstrapped: true,
        }))

        return user
      },

      register: async (payload) => {
        const response = await registerRequest(payload)
        const user = response?.user ?? null

        set((state) => ({
          auth: {
            ...state.auth,
            isAuthenticated: true,
            isOnboarded: Boolean(user?.isOnboarded),
            user,
          },
          isBootstrapped: true,
        }))

        return user
      },

      createAccount: async (email, password, name) => get().register({ email, password, name }),
      signIn: async (email, password) => get().login({ email, password }),

      saveOnboardingProgress: async (draft = {}) => {
        const payload = {
          conditions: get().healthProfile.conditions,
          triggers: get().healthProfile.triggers,
          medications: {
            acute: get().healthProfile.medications.acute,
            preventive: get().healthProfile.medications.preventive,
          },
          preferences: get().preferences,
          currentStep: get().onboarding.currentStep,
          isComplete: false,
          ...draft,
        }

        return saveOnboardingProgressRequest(payload)
      },

      logout: async () => {
        try {
          await logoutRequest()
        } finally {
          set((state) => ({
            ...createInitialState(),
            isHydrated: state.isHydrated,
            isBootstrapped: true,
          }))
        }
      },

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

      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      saveDailyCheckin: (checkin) =>
        set(() => ({
          dailyCheckin: checkin,
        })),

      completeOnboarding: () =>
        completeOnboardingRequest().then(() => {
          set((state) => ({
            auth: { ...state.auth, isOnboarded: true },
            onboarding: { ...state.onboarding, completedSteps: ['all'] },
          }))
        }),

      resetOnboarding: () => set({ ...createInitialState(), isHydrated: get().isHydrated, isBootstrapped: true }),
    }),
    {
      name: 'mibrain-auth-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        healthProfile: state.healthProfile,
        preferences: state.preferences,
        dailyCheckin: state.dailyCheckin,
        onboarding: state.onboarding,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
