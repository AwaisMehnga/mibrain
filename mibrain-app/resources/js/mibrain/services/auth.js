import http from './http'

export async function getCurrentUser() {
  const { data } = await http.get('/api/v1/me')
  return data.data ?? null
}

export async function login(credentials) {
  const { data } = await http.post('/api/v1/auth/login', credentials)
  return data.data ?? null
}

export async function register(payload) {
  const { data } = await http.post('/api/v1/auth/register', payload)
  return data.data ?? null
}

export async function logout() {
  await http.post('/api/v1/auth/logout')
}