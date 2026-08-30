import { createRow, listRows, requireFields, updateRow } from "./baseModel.js";
import { query } from "../config/database.js";

const notificationFields = ["title", "message", "type", "entity_type", "entity_id", "is_read"];

export function listNotifications(payload = {}) {
  return listRows("notifications", {
    allowedFilters: ["is_read", "type", "entity_type"],
    filters: payload.filters,
    limit: payload.limit || 20,
    offset: payload.offset,
    orderBy: "created_at",
    searchable: ["title", "message", "entity_type"],
    search: payload.search,
  });
}

export async function createNotification(payload = {}) {
  requireFields(payload, ["title", "message"]);
  return createRow("notifications", payload, notificationFields);
}

export function markNotificationRead(payload = {}) {
  requireFields(payload, ["id"]);
  return updateRow("notifications", payload.id, { is_read: 1 }, notificationFields);
}

export async function markAllNotificationsRead() {
  await query("UPDATE notifications SET is_read = 1 WHERE is_read = 0");
  return { updated: true };
}

export async function getUnreadNotificationCount() {
  const [row] = await query("SELECT COUNT(*) AS total FROM notifications WHERE is_read = 0");
  return Number(row?.total || 0);
}
