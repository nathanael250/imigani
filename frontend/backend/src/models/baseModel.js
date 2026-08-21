import { query } from "../config/database.js";

export function assertAllowed(value, allowed, label) {
  if (!allowed.includes(value)) {
    const error = new Error(`Invalid ${label}: ${value}`);
    error.statusCode = 400;
    throw error;
  }
}

export function cleanPayload(payload, allowedFields) {
  return Object.fromEntries(
    Object.entries(payload || {}).filter(
      ([key, value]) => allowedFields.includes(key) && value !== undefined,
    ),
  );
}

export function requireFields(payload, fields) {
  const missing = fields.filter((field) => payload?.[field] === undefined || payload[field] === "");

  if (missing.length > 0) {
    const error = new Error(`Missing required field(s): ${missing.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
}

export async function listRows(table, options = {}) {
  const {
    allowedFilters = [],
    filters = {},
    limit = 50,
    offset = 0,
    orderBy = "created_at",
    orderDirection = "DESC",
    searchable = [],
    search = "",
    select = "*",
  } = options;

  const clauses = [];
  const safeLimit = Number.isFinite(Number(limit)) ? Number(limit) : 50;
  const safeOffset = Number.isFinite(Number(offset)) ? Number(offset) : 0;
  const params = {
    limit: safeLimit,
    offset: safeOffset,
  };

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue;
    assertAllowed(key, allowedFilters, "filter");
    clauses.push(`${key} = :filter_${key}`);
    params[`filter_${key}`] = value;
  }

  if (search && searchable.length > 0) {
    const searchClauses = searchable.map((field) => `${field} LIKE :search`);
    clauses.push(`(${searchClauses.join(" OR ")})`);
    params.search = `%${search}%`;
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const direction = orderDirection?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  return query(
    `SELECT ${select} FROM ${table} ${where} ORDER BY ${orderBy} ${direction} LIMIT :limit OFFSET :offset`,
    params,
  );
}

export async function getRowById(table, id, select = "*") {
  const rows = await query(`SELECT ${select} FROM ${table} WHERE id = :id LIMIT 1`, { id });
  return rows[0] || null;
}

export async function createRow(table, payload, allowedFields) {
  const data = cleanPayload(payload, allowedFields);
  const fields = Object.keys(data);

  if (fields.length === 0) {
    const error = new Error("No valid fields were provided");
    error.statusCode = 400;
    throw error;
  }

  const columns = fields.join(", ");
  const placeholders = fields.map((field) => `:${field}`).join(", ");
  const result = await query(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, data);

  return getRowById(table, result.insertId);
}

export async function updateRow(table, id, payload, allowedFields) {
  const data = cleanPayload(payload, allowedFields);
  const fields = Object.keys(data);

  if (fields.length === 0) {
    const error = new Error("No valid fields were provided");
    error.statusCode = 400;
    throw error;
  }

  const assignments = fields.map((field) => `${field} = :${field}`).join(", ");
  await query(`UPDATE ${table} SET ${assignments} WHERE id = :id`, { ...data, id });

  return getRowById(table, id);
}

export async function deleteRow(table, id) {
  const result = await query(`DELETE FROM ${table} WHERE id = :id`, { id });
  return {
    deleted: result.affectedRows > 0,
    id,
  };
}
