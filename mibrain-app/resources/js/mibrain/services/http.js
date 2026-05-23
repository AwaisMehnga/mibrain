import axios from 'axios'

const http = axios.create({
  baseURL: '/',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Auth-Mode': 'cookie',
  },
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes('/api/v1/auth/refresh')
    ) {
      originalRequest._retry = true

      await axios.post(
        '/api/v1/auth/refresh',
        {},
        {
          withCredentials: true,
          headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-Auth-Mode': 'cookie' },
        }
      )

      return http(originalRequest)
    }

    return Promise.reject(error)
  }
)

export default http
