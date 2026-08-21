import { transaction } from "../config/database.js";
import {
  listRows,
  requireFields,
  updateRow,
} from "./baseModel.js";

const tripPlanFields = [
  "name",
  "email",
  "phone",
  "nationality",
  "number_of_people",
  "arrival_date",
  "departure_date",
  "message",
  "status",
];

export function listTripPlans(payload = {}) {
  return listRows("trip_plans", {
    allowedFilters: ["status"],
    filters: payload.filters,
    limit: payload.limit,
    offset: payload.offset,
    orderBy: "created_at",
    searchable: ["name", "email", "phone", "nationality", "message"],
    search: payload.search,
  });
}

export async function createTripPlan(payload = {}) {
  requireFields(payload, ["name", "email", "number_of_people"]);

  return transaction(async (connection) => {
    const allowedPayload = Object.fromEntries(
      Object.entries(payload).filter(([key]) => tripPlanFields.includes(key)),
    );
    const fields = Object.keys(allowedPayload);
    const placeholders = fields.map(() => "?").join(", ");
    const [result] = await connection.execute(
      `INSERT INTO trip_plans (${fields.join(", ")}) VALUES (${placeholders})`,
      fields.map((field) => allowedPayload[field]),
    );

    if (Array.isArray(payload.interest_ids) && payload.interest_ids.length > 0) {
      await connection.query(
        "INSERT IGNORE INTO trip_plan_interests (trip_plan_id, interest_id) VALUES ?",
        [payload.interest_ids.map((interestId) => [result.insertId, interestId])],
      );
    }

    if (Array.isArray(payload.category_ids) && payload.category_ids.length > 0) {
      await connection.query(
        "INSERT IGNORE INTO trip_plan_categories (trip_plan_id, tour_category_id) VALUES ?",
        [payload.category_ids.map((categoryId) => [result.insertId, categoryId])],
      );
    }

    const [rows] = await connection.execute("SELECT * FROM trip_plans WHERE id = ? LIMIT 1", [
      result.insertId,
    ]);
    return rows[0] || null;
  });
}

export function updateTripPlanStatus(payload = {}) {
  requireFields(payload, ["id", "status"]);
  return updateRow("trip_plans", payload.id, { status: payload.status }, tripPlanFields);
}

export function listInterests(payload = {}) {
  return listRows("interests", {
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
