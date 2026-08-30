import { createRow, deleteRow, listRows, requireFields, updateRow } from "./baseModel.js";
import { createNotification } from "./notificationModel.js";

const reviewFields = ["tour_id", "name", "email", "rating", "review", "status"];

export function listReviews(payload = {}) {
  return listRows("reviews", {
    allowedFilters: ["status", "tour_id"],
    filters: payload.filters,
    limit: payload.limit,
    offset: payload.offset,
    orderBy: "created_at",
    searchable: ["name", "email", "review"],
    search: payload.search,
  });
}

export async function createReview(payload = {}) {
  requireFields(payload, ["name", "rating", "review"]);
  const review = await createRow("reviews", { ...payload, status: payload.status || "pending" }, reviewFields);

  await createNotification({
    entity_id: review.id,
    entity_type: "review",
    message: `${review.name} submitted a ${review.rating}-star review.`,
    title: "New review",
    type: "review",
  });

  return review;
}

export function updateReview(payload = {}) {
  requireFields(payload, ["id"]);
  return updateRow("reviews", payload.id, payload, reviewFields);
}

export function deleteReview(payload = {}) {
  requireFields(payload, ["id"]);
  return deleteRow("reviews", payload.id);
}
