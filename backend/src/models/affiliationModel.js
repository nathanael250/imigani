import { createRow, deleteRow, listRows, requireFields, updateRow } from "./baseModel.js";
import { query } from "../config/database.js";

const affiliationFields = ["name", "slug", "logo_url", "website_url", "status", "sort_order"];
let ensureTablePromise;

export async function listAffiliations(payload = {}) {
  await ensureAffiliationsTable();

  return listRows("affiliations", {
    allowedFilters: ["status"],
    filters: payload.filters,
    limit: payload.limit,
    offset: payload.offset,
    orderBy: "sort_order, name",
    orderDirection: "ASC",
    searchable: ["name", "slug"],
    search: payload.search,
  });
}

export async function createAffiliation(payload = {}, context = {}) {
  requireContentManager(context);
  await ensureAffiliationsTable();
  requireFields(payload, ["name", "logo_url"]);

  return createRow(
    "affiliations",
    {
      ...payload,
      slug: payload.slug || slugify(payload.name),
      sort_order: normalizeSortOrder(payload.sort_order),
    },
    affiliationFields,
  );
}

export async function updateAffiliation(payload = {}, context = {}) {
  requireContentManager(context);
  await ensureAffiliationsTable();
  requireFields(payload, ["id"]);

  const updates = { ...payload };
  if (payload.name && !payload.slug) updates.slug = slugify(payload.name);
  if (payload.sort_order !== undefined) updates.sort_order = normalizeSortOrder(payload.sort_order);

  return updateRow("affiliations", payload.id, updates, affiliationFields);
}

export async function deleteAffiliation(payload = {}, context = {}) {
  requireContentManager(context);
  await ensureAffiliationsTable();
  requireFields(payload, ["id"]);

  return deleteRow("affiliations", payload.id);
}

function ensureAffiliationsTable() {
  if (!ensureTablePromise) {
    ensureTablePromise = initializeAffiliationsTable().catch((error) => {
      ensureTablePromise = undefined;
      throw error;
    });
  }

  return ensureTablePromise;
}

async function initializeAffiliationsTable() {
  const existingTables = await query(
    `SELECT COUNT(*) AS table_count
     FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = 'affiliations'`,
  );
  const tableAlreadyExisted = Number(existingTables[0]?.table_count || 0) > 0;

  await query(`
    CREATE TABLE IF NOT EXISTS affiliations (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      logo_url VARCHAR(500) NULL,
      website_url VARCHAR(500) NULL,
      status ENUM('active','inactive') NOT NULL DEFAULT 'active',
      sort_order INT UNSIGNED NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  if (!tableAlreadyExisted) {
    await query(
      `INSERT IGNORE INTO affiliations (name, slug, logo_url, website_url, status, sort_order) VALUES
       ('Rwanda Tours and Travel Association', 'rtta', NULL, NULL, 'active', 1),
       ('African Travel & Tourism Association', 'atta', NULL, NULL, 'active', 2),
       ('Visit Rwanda', 'visit-rwanda', NULL, NULL, 'active', 3)`,
    );
  }
}

function requireContentManager(context = {}) {
  if (!context.user) {
    const error = new Error("Authentication is required to manage affiliations");
    error.statusCode = 401;
    throw error;
  }

  if (!["admin", "editor"].includes(context.user.role)) {
    const error = new Error("You are not allowed to manage affiliations");
    error.statusCode = 403;
    throw error;
  }
}

function normalizeSortOrder(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : 0;
}

function slugify(value = "affiliation") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
