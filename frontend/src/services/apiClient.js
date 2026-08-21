const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6003'
const TOKEN_KEY = 'imigani_token'
const USER_KEY = 'imigani_user'

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY)

  if (!user) {
    return null
  }

  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}

export function setAuthSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function apiRequest(command, data = {}, options = {}) {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      command,
      data,
    }),
  })
  const result = await response.json()

  if (!response.ok || !result.ok) {
    throw new Error(result.message || 'Request failed')
  }

  return result.data
}

export async function uploadRequest(command, file, data = {}, options = {}) {
  const token = getAuthToken()
  const formData = new FormData()

  formData.append('command', command)
  formData.append('data', JSON.stringify(data))
  formData.append(options.fileField || 'image', file)

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: formData,
  })
  const result = await response.json()

  if (!response.ok || !result.ok) {
    throw new Error(result.message || 'Upload failed')
  }

  return result.data
}
