import { apiRequest, uploadRequest } from './apiClient'

export function listTours(params = {}) {
  return apiRequest('LIST_TOURS', params)
}

export function getFullTourPackage(id) {
  return apiRequest('GET_FULL_TOUR_PACKAGE', { id })
}

export function createTour(data = {}) {
  return apiRequest('CREATE_TOUR', data)
}

export function listTourCategories(params = {}) {
  return apiRequest('LIST_TOUR_CATEGORIES', params)
}

export function createTourCategory(data = {}) {
  return apiRequest('CREATE_TOUR_CATEGORY', data)
}

export function updateTourCategory(id, data = {}) {
  return apiRequest('UPDATE_TOUR_CATEGORY', { ...data, id })
}

export function deleteTourCategory(id) {
  return apiRequest('DELETE_TOUR_CATEGORY', { id })
}

export function getTourPackageLookups() {
  return apiRequest('TOUR_PACKAGE_LOOKUPS')
}

export function createFullTourPackage(data = {}) {
  return apiRequest('CREATE_FULL_TOUR_PACKAGE', data)
}

export function updateFullTourPackage(id, data = {}) {
  return apiRequest('UPDATE_FULL_TOUR_PACKAGE', { ...data, id })
}

export function deleteTour(id) {
  return apiRequest('DELETE_TOUR', { id })
}

export function uploadTourMedia(file, data = {}) {
  return uploadRequest('UPLOAD_MEDIA', file, data)
}

export function createTourInquiry(data = {}) {
  return apiRequest('CREATE_INQUIRY', data)
}
