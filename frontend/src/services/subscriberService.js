import { apiRequest } from './apiClient'

export function createSubscriber(data = {}) {
  return apiRequest('CREATE_SUBSCRIBER', data)
}
