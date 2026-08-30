import {
  createRow,
  deleteRow,
  getRowById,
  listRows,
  requireFields,
  updateRow,
} from "./baseModel.js";
import { query } from "../config/database.js";

const categoryFields = ["name", "slug", "description", "image_url", "status"];
const tourFields = [
  "category_id",
  "name",
  "slug",
  "description",
  "duration_days",
  "duration_nights",
  "status",
];

export function listTourCategories(payload = {}) {
  return listRows("tour_categories", {
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

export async function createTourCategory(payload = {}) {
  requireFields(payload, ["name", "slug"]);
  return createRow("tour_categories", payload, categoryFields);
}

export function updateTourCategory(payload = {}) {
  requireFields(payload, ["id"]);
  return updateRow("tour_categories", payload.id, payload, categoryFields);
}

export function deleteTourCategory(payload = {}) {
  requireFields(payload, ["id"]);
  return deleteRow("tour_categories", payload.id);
}

export function listTours(payload = {}) {
  const filters = payload.filters || {};
  const clauses = [];
  const safeLimit = Number.isFinite(Number(payload.limit)) ? Math.max(1, Math.trunc(Number(payload.limit))) : 50;
  const safeOffset = Number.isFinite(Number(payload.offset)) ? Math.max(0, Math.trunc(Number(payload.offset))) : 0;
  const params = {};

  if (filters.status) {
    clauses.push("t.status = :status");
    params.status = filters.status;
  }

  if (filters.category_id) {
    clauses.push("t.category_id = :category_id");
    params.category_id = filters.category_id;
  }

  if (payload.search) {
    clauses.push("(t.name LIKE :search OR t.description LIKE :search)");
    params.search = `%${payload.search}%`;
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";

  return query(
    `SELECT
       t.*,
       tc.name AS category_name,
       (
         SELECT tm.url
         FROM tour_media tm
         WHERE tm.tour_id = t.id
           AND tm.media_type = 'image'
         ORDER BY tm.is_cover DESC, tm.display_order ASC, tm.id ASC
         LIMIT 1
       ) AS cover_image_url
       ,
       (
         SELECT GROUP_CONCAT(d.name ORDER BY td.display_order ASC, td.id ASC SEPARATOR ', ')
         FROM tour_destinations td
         JOIN destinations d ON d.id = td.destination_id
         WHERE td.tour_id = t.id
       ) AS destination_names,
       (
         SELECT MIN(tp.price)
         FROM tour_prices tp
         WHERE tp.tour_id = t.id
       ) AS lowest_price,
       (
         SELECT c.symbol
         FROM tour_prices tp
         JOIN currencies c ON c.id = tp.currency_id
         WHERE tp.tour_id = t.id
         ORDER BY tp.price ASC, tp.id ASC
         LIMIT 1
       ) AS currency_symbol
     FROM tours t
     LEFT JOIN tour_categories tc ON tc.id = t.category_id
     ${where}
     ORDER BY t.created_at DESC
     LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params,
  );
}

export async function getTour(payload = {}) {
  requireFields(payload, ["id"]);
  return getRowById("tours", payload.id);
}

export async function createTour(payload = {}) {
  requireFields(payload, ["name", "slug"]);
  return createRow("tours", payload, tourFields);
}

export function updateTour(payload = {}) {
  requireFields(payload, ["id"]);
  return updateRow("tours", payload.id, payload, tourFields);
}

export function deleteTour(payload = {}) {
  requireFields(payload, ["id"]);
  return deleteRow("tours", payload.id);
}
