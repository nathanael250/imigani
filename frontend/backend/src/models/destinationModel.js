import { createRow, deleteRow, listRows, requireFields, updateRow } from "./baseModel.js";

const destinationFields = ["name", "description", "image_url", "status"];

export function listDestinations(payload = {}) {
  return listRows("destinations", {
    allowedFilters: ["status"],
    filters: payload.filters,
    limit: payload.limit,
    offset: payload.offset,
    orderBy: "name",
    orderDirection: "ASC",
    searchable: ["name", "description"],
    search: payload.search,
  });
}

export async function createDestination(payload = {}) {
  requireFields(payload, ["name"]);
  return createRow("destinations", payload, destinationFields);
}

export function updateDestination(payload = {}) {
  requireFields(payload, ["id"]);
  return updateRow("destinations", payload.id, payload, destinationFields);
}

export function deleteDestination(payload = {}) {
  requireFields(payload, ["id"]);
  return deleteRow("destinations", payload.id);
}
