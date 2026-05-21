import http from './http'

export async function getOnboardingCatalog() {
  const { data } = await http.get('/api/v1/catalog/onboarding')
  return data.data
}

export async function saveOnboardingProgress(payload) {
  const { data } = await http.put('/api/v1/onboarding', payload)
  return data.data
}

export async function completeOnboarding() {
  const { data } = await http.post('/api/v1/onboarding/complete')
  return data.data
}