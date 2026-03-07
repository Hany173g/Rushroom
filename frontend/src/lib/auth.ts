const ACCESS_TOKEN_KEY = 'rushroom_access_token'

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padLength = (4 - (base64.length % 4)) % 4
  const padded = base64 + '='.repeat(padLength)
  return atob(padded)
}

export type JwtUserPayload = {
  displayName: string
  email: string
  id: string
  _id?: string  // MongoDB ID
}

type LegacyJwtUserPayload = {
  name: string
  email: string
  googleId: string
  _id?: string  // MongoDB ID
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  } catch {
    return null
  }
}

export function getUserFromToken(): JwtUserPayload | null {
  const token = getAccessToken()
  if (!token) return null

  const parts = token.split('.')
  if (parts.length < 2) return null

  try {
    const json = base64UrlDecode(parts[1])
    const payload = JSON.parse(json) as unknown
    if (!payload || typeof payload !== 'object') return null

    const maybe = payload as Partial<JwtUserPayload> & Partial<LegacyJwtUserPayload>
    const email = typeof maybe.email === 'string' ? maybe.email : null
    const displayName =
      typeof maybe.displayName === 'string' ? maybe.displayName : typeof maybe.name === 'string' ? maybe.name : null
    // Use _id (MongoDB) if available, otherwise fall back to id/googleId
    const _id = typeof maybe._id === 'string' ? maybe._id : undefined
    const googleId = typeof maybe.id === 'string' ? maybe.id : typeof maybe.googleId === 'string' ? maybe.googleId : undefined

    if (!email || !displayName || (!_id && !googleId)) return null
    return { displayName, email, id: _id || googleId || '', _id }
  } catch {
    return null
  }
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

// Alias for convenience
export const removeAccessToken = clearAccessToken

export function isAuthed(): boolean {
  return Boolean(getAccessToken())
}
