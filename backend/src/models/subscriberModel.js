import { listRows, requireFields, updateRow } from "./baseModel.js";
import { query } from "../config/database.js";

const subscriberFields = ["email", "status", "source"];

export async function listSubscribers(payload = {}) {
  await ensureSubscribersTable();

  return listRows("subscribers", {
    allowedFilters: ["status", "source"],
    filters: payload.filters,
    limit: payload.limit,
    offset: payload.offset,
    orderBy: "created_at",
    searchable: ["email", "source"],
    search: payload.search,
  });
}

export async function createSubscriber(payload = {}) {
  await ensureSubscribersTable();
  requireFields(payload, ["email"]);

  const email = normalizeEmail(payload.email);

  if (!isValidEmail(email)) {
    const error = new Error("Please provide a valid email address");
    error.statusCode = 400;
    throw error;
  }

  await query(
    `INSERT INTO subscribers (email, status, source)
     VALUES (:email, 'active', :source)
     ON DUPLICATE KEY UPDATE status = 'active', source = VALUES(source), updated_at = CURRENT_TIMESTAMP`,
    {
      email,
      source: payload.source || "website",
    },
  );

  const rows = await query("SELECT * FROM subscribers WHERE email = :email LIMIT 1", { email });
  return rows[0] || null;
}

export async function updateSubscriberStatus(payload = {}) {
  await ensureSubscribersTable();
  requireFields(payload, ["id", "status"]);

  return updateRow("subscribers", payload.id, { status: payload.status }, subscriberFields);
}

async function ensureSubscribersTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      status ENUM('active','unsubscribed') NOT NULL DEFAULT 'active',
      source VARCHAR(100) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);
}

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
