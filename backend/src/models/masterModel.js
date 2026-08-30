import commands from "../config/command.js";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPost,
  listBlogPosts,
  updateBlogPost,
} from "./blogModel.js";
import { getDashboardSummary } from "./dashboardModel.js";
import {
  createDestination,
  deleteDestination,
  listDestinations,
  updateDestination,
} from "./destinationModel.js";
import { createInquiry, listInquiries, markInquiryRead, updateInquiryStatus } from "./inquiryModel.js";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notificationModel.js";
import { createReview, deleteReview, listReviews, updateReview } from "./reviewModel.js";
import { getSettings, updateSettings } from "./settingsModel.js";
import {
  createSubscriber,
  listSubscribers,
  updateSubscriberStatus,
} from "./subscriberModel.js";
import {
  createTour,
  createTourCategory,
  deleteTour,
  deleteTourCategory,
  getTour,
  listTourCategories,
  listTours,
  updateTour,
  updateTourCategory,
} from "./tourModel.js";
import {
  createFullTourPackage,
  getFullTourPackage,
  getTourPackageLookups,
  updateFullTourPackage,
} from "./tourPackageModel.js";
import {
  createTripPlan,
  listInterests,
  listTripPlans,
  updateTripPlanStatus,
} from "./tripPlanModel.js";
import { uploadMedia } from "./uploadModel.js";
import { createUser, listUsers, loginUser, updateUser } from "./userModel.js";

const requestHandlers = {
  "system.requests": () => listAvailableRequests(),
  "auth.login": loginUser,
  "media.upload": uploadMedia,

  "dashboard.summary": getDashboardSummary,

  "notifications.list": listNotifications,
  "notifications.markRead": markNotificationRead,
  "notifications.markAllRead": markAllNotificationsRead,

  "blogs.create": createBlogPost,
  "blogs.delete": deleteBlogPost,
  "blogs.get": getBlogPost,
  "blogs.list": listBlogPosts,
  "blogs.update": updateBlogPost,

  "reviews.create": createReview,
  "reviews.delete": deleteReview,
  "reviews.list": listReviews,
  "reviews.update": updateReview,

  "settings.get": getSettings,
  "settings.update": updateSettings,

  "tourCategories.create": createTourCategory,
  "tourCategories.delete": deleteTourCategory,
  "tourCategories.list": listTourCategories,
  "tourCategories.update": updateTourCategory,

  "tours.create": createTour,
  "tours.createFull": createFullTourPackage,
  "tours.delete": deleteTour,
  "tours.getFull": getFullTourPackage,
  "tours.get": getTour,
  "tours.list": listTours,
  "tours.lookups": getTourPackageLookups,
  "tours.updateFull": updateFullTourPackage,
  "tours.update": updateTour,

  "destinations.create": createDestination,
  "destinations.delete": deleteDestination,
  "destinations.list": listDestinations,
  "destinations.update": updateDestination,

  "inquiries.create": createInquiry,
  "inquiries.list": listInquiries,
  "inquiries.markRead": markInquiryRead,
  "inquiries.updateStatus": updateInquiryStatus,

  "subscribers.create": createSubscriber,
  "subscribers.list": listSubscribers,
  "subscribers.updateStatus": updateSubscriberStatus,

  "tripPlans.create": createTripPlan,
  "tripPlans.list": listTripPlans,
  "tripPlans.updateStatus": updateTripPlanStatus,
  "interests.list": listInterests,

  "users.create": createUser,
  "users.list": listUsers,
  "users.update": updateUser,
};

const commandToRequest = {
  [commands.AVAILABLE_REQUESTS]: "system.requests",
  [commands.HEALTH]: "health",
  [commands.LOGIN]: "auth.login",
  [commands.UPLOAD_MEDIA]: "media.upload",

  [commands.DASHBOARD_SUMMARY]: "dashboard.summary",

  [commands.LIST_NOTIFICATIONS]: "notifications.list",
  [commands.MARK_NOTIFICATION_READ]: "notifications.markRead",
  [commands.MARK_ALL_NOTIFICATIONS_READ]: "notifications.markAllRead",

  [commands.LIST_BLOG_POSTS]: "blogs.list",
  [commands.GET_BLOG_POST]: "blogs.get",
  [commands.CREATE_BLOG_POST]: "blogs.create",
  [commands.UPDATE_BLOG_POST]: "blogs.update",
  [commands.DELETE_BLOG_POST]: "blogs.delete",

  [commands.LIST_REVIEWS]: "reviews.list",
  [commands.CREATE_REVIEW]: "reviews.create",
  [commands.UPDATE_REVIEW]: "reviews.update",
  [commands.DELETE_REVIEW]: "reviews.delete",

  [commands.GET_SETTINGS]: "settings.get",
  [commands.UPDATE_SETTINGS]: "settings.update",

  [commands.LIST_TOUR_CATEGORIES]: "tourCategories.list",
  [commands.CREATE_TOUR_CATEGORY]: "tourCategories.create",
  [commands.UPDATE_TOUR_CATEGORY]: "tourCategories.update",
  [commands.DELETE_TOUR_CATEGORY]: "tourCategories.delete",

  [commands.LIST_TOURS]: "tours.list",
  [commands.GET_TOUR]: "tours.get",
  [commands.GET_FULL_TOUR_PACKAGE]: "tours.getFull",
  [commands.CREATE_TOUR]: "tours.create",
  [commands.CREATE_FULL_TOUR_PACKAGE]: "tours.createFull",
  [commands.TOUR_PACKAGE_LOOKUPS]: "tours.lookups",
  [commands.UPDATE_TOUR]: "tours.update",
  [commands.UPDATE_FULL_TOUR_PACKAGE]: "tours.updateFull",
  [commands.DELETE_TOUR]: "tours.delete",

  [commands.LIST_DESTINATIONS]: "destinations.list",
  [commands.CREATE_DESTINATION]: "destinations.create",
  [commands.UPDATE_DESTINATION]: "destinations.update",
  [commands.DELETE_DESTINATION]: "destinations.delete",

  [commands.LIST_INQUIRIES]: "inquiries.list",
  [commands.CREATE_INQUIRY]: "inquiries.create",
  [commands.MARK_INQUIRY_READ]: "inquiries.markRead",
  [commands.UPDATE_INQUIRY_STATUS]: "inquiries.updateStatus",

  [commands.LIST_SUBSCRIBERS]: "subscribers.list",
  [commands.CREATE_SUBSCRIBER]: "subscribers.create",
  [commands.UPDATE_SUBSCRIBER_STATUS]: "subscribers.updateStatus",

  [commands.LIST_TRIP_PLANS]: "tripPlans.list",
  [commands.CREATE_TRIP_PLAN]: "tripPlans.create",
  [commands.UPDATE_TRIP_PLAN_STATUS]: "tripPlans.updateStatus",
  [commands.LIST_INTERESTS]: "interests.list",

  [commands.LIST_USERS]: "users.list",
  [commands.CREATE_USER]: "users.create",
  [commands.UPDATE_USER]: "users.update",
};

const handlers = {
  ...requestHandlers,
  health: () => ({
    service: "imigani-backend",
  }),
};

export function listAvailableRequests() {
  return Object.keys(requestHandlers).sort();
}

export async function handleMasterRequest(body = {}, context = {}) {
  const rawRequest = body.request || body.action || body.command;
  const request = commandToRequest[rawRequest] || rawRequest;
  const payload = body.data || body.payload || {};

  if (!request) {
    const error = new Error("Request name is required");
    error.statusCode = 400;
    throw error;
  }

  const handler = handlers[request];

  if (!handler) {
    const error = new Error(`Unsupported request: ${request}`);
    error.statusCode = 400;
    error.details = {
      availableRequests: listAvailableRequests(),
    };
    throw error;
  }

  return handler(payload, context);
}

export async function handleCommand(context = {}) {
  const data = await handleMasterRequest(context.body || {}, context);

  return {
    data,
    message: "Success",
    statusCode: 200,
  };
}

export default {
  handleCommand,
  handleMasterRequest,
  listAvailableRequests,
};
