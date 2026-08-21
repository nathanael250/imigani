import { apiRequest, clearAuthSession, getAuthToken, getStoredUser, setAuthSession } from './apiClient'

export async function login({ email, password }) {
  const session = await apiRequest('LOGIN', { email, password })
  setAuthSession(session)
  return session
}

export function logout() {
  clearAuthSession()
}

export function getCurrentUser() {
  return getStoredUser()
}

export function isAuthenticated() {
  return Boolean(getAuthToken() && getStoredUser())
}
