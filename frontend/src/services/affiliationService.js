import { apiRequest, uploadRequest } from './apiClient'

export function listAffiliations(params = {}) {
  return apiRequest('LIST_AFFILIATIONS', params)
}

export function createAffiliation(data = {}) {
  return apiRequest('CREATE_AFFILIATION', data)
}

export function updateAffiliation(id, data = {}) {
  return apiRequest('UPDATE_AFFILIATION', { ...data, id })
}

export function deleteAffiliation(id) {
  return apiRequest('DELETE_AFFILIATION', { id })
}

export function uploadAffiliationLogo(file) {
  return uploadRequest('UPLOAD_MEDIA', file, { folder: 'affiliations' })
}
