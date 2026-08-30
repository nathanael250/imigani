import { apiRequest, uploadRequest } from './apiClient'

export function getDashboardSummary() {
  return apiRequest('DASHBOARD_SUMMARY')
}

export function listInquiries(params = {}) {
  return apiRequest('LIST_INQUIRIES', params)
}

export function updateInquiryStatus(id, status) {
  return apiRequest('UPDATE_INQUIRY_STATUS', { id, status })
}

export function markInquiryRead(id) {
  return apiRequest('MARK_INQUIRY_READ', { id })
}

export function listSubscribers(params = {}) {
  return apiRequest('LIST_SUBSCRIBERS', params)
}

export function updateSubscriberStatus(id, status) {
  return apiRequest('UPDATE_SUBSCRIBER_STATUS', { id, status })
}

export function listNotifications(params = {}) {
  return apiRequest('LIST_NOTIFICATIONS', params)
}

export function markNotificationRead(id) {
  return apiRequest('MARK_NOTIFICATION_READ', { id })
}

export function markAllNotificationsRead() {
  return apiRequest('MARK_ALL_NOTIFICATIONS_READ')
}

export function listBlogPosts(params = {}) {
  return apiRequest('LIST_BLOG_POSTS', params)
}

export function getBlogPost(params = {}) {
  return apiRequest('GET_BLOG_POST', params)
}

export function createBlogPost(data = {}) {
  return apiRequest('CREATE_BLOG_POST', data)
}

export function uploadBlogImage(file, data = {}) {
  return uploadRequest('UPLOAD_MEDIA', file, data)
}

export function updateBlogPost(id, data = {}) {
  return apiRequest('UPDATE_BLOG_POST', { ...data, id })
}

export function deleteBlogPost(id) {
  return apiRequest('DELETE_BLOG_POST', { id })
}

export function listReviews(params = {}) {
  return apiRequest('LIST_REVIEWS', params)
}

export function updateReview(id, data = {}) {
  return apiRequest('UPDATE_REVIEW', { ...data, id })
}

export function deleteReview(id) {
  return apiRequest('DELETE_REVIEW', { id })
}

export function getSettings() {
  return apiRequest('GET_SETTINGS')
}

export function updateSettings(data = {}) {
  return apiRequest('UPDATE_SETTINGS', data)
}
