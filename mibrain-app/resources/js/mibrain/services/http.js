import axios from 'axios'

function getCsrfToken() {
  if (typeof document === 'undefined') {
    return null
  }

  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? null
}

const http = axios.create({
  baseURL: '/',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

http.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken()

  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken
  }

  return config
})

export default http