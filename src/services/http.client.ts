import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

export interface ApiError {
  status: number
  message: string
  errors: string[]
}

function createHttpClient(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => Promise.reject(error),
  )

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<{ message?: string; errors?: string[] }>) => {
      const status = error.response?.status ?? 0
      const message =
        error.response?.data?.message ?? error.message ?? 'Erro desconhecido'
      const errors = error.response?.data?.errors ?? []

      if (status === 401) {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }

      const apiError: ApiError = { status, message, errors }
      return Promise.reject(apiError)
    },
  )

  return instance
}

export const httpClient = createHttpClient(
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
)

export const marketClient = createHttpClient(
  import.meta.env.VITE_MARKET_API_URL ?? 'https://brapi.dev/api',
)
