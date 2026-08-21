import { createRow, listRows, requireFields, updateRow } from "./baseModel.js";

const inquiryFields = ["name", "email", "phone", "inquiry", "status"];

export function listInquiries(payload = {}) {
  return listRows("inquiries", {
    allowedFilters: ["status"],
    filters: payload.filters,
    limit: payload.limit,
    offset: payload.offset,
    orderBy: "created_at",
    searchable: ["name", "email", "phone", "inquiry"],
    search: payload.search,
  });
}

export async function createInquiry(payload = {}) {
  requireFields(payload, ["name", "email", "inquiry"]);
  return createRow("inquiries", payload, inquiryFields);
}

export function updateInquiryStatus(payload = {}) {
  requireFields(payload, ["id", "status"]);
  return updateRow("inquiries", payload.id, { status: payload.status }, inquiryFields);
}
