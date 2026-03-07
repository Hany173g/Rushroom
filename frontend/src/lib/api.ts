import { API_BASE_URL } from './env'
import { getAccessToken } from './auth'
import { 
  parseApiError, 
  NetworkError, 
  AuthError,
  ProfileIncompleteError,
  logError 
} from './errorHandling'

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = getAccessToken()

  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const url = input.startsWith('http') ? input : `${API_BASE_URL}${input.startsWith('/') ? '' : '/'}${input}`

  try {
    const response = await fetch(url, {
      ...init,
      headers,
    })
    
    // Handle auth errors
    if (response.status === 401) {
      throw new AuthError()
    }
    
    // Handle profile incomplete (403 with specific code)
    if (response.status === 403) {
      const data = await response.json().catch(() => ({}))
      if (data.code === 'PROFILE_INCOMPLETE') {
        const error = new ProfileIncompleteError({
          userId: data.data?.userId || '',
          redirectUrl: data.data?.redirectUrl || ''
        })
        throw error
      }
      // Other 403 errors
      throw new Error('Forbidden')
    }
    
    // Handle other errors
    if (!response.ok) {
      throw await parseApiError(response)
    }
    
    return response
  } catch (error) {
    // Log error in development (skip expected errors)
    if (!(error instanceof ProfileIncompleteError)) {
      logError(error, `API: ${input}`)
    }
    
    // Re-throw network errors as NetworkError
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError()
    }
    
    throw error
  }
}

// Get user data (works for both pending and approved users)
export async function getUserData() {
  const response = await apiFetch('/auth/getUserData')
  return response.json()
}

// Complete user profile
export async function completeUserProfile(userData: { name?: string; gender?: string; photo?: string }) {
  const response = await apiFetch('/auth/completeUserProfile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userData }),
  })
  return response.json()
}

// Login with Google
export function loginWithGoogle() {
  window.location.href = `${API_BASE_URL}/auth/google`
}

// Logout
export function logout() {
  // Clear auth token and redirect to login
  localStorage.removeItem('accessToken')
  window.location.href = '/login'
}
