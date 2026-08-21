import commands from "../config/command.js";
import { getDashboardSummary } from "./dashboardModel.js";
import {
  createDestination,
  deleteDestination,
  listDestinations,
  updateDestination,
} from "./destinationModel.js";
import { createInquiry, listInquiries, updateInquiryStatus } from "./inquiryModel.js";
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
  "inquiries.updateStatus": updateInquiryStatus,

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
  [commands.UPDATE_INQUIRY_STATUS]: "inquiries.updateStatus",

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
