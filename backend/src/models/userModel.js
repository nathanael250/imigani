import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/database.js";
import { createRow, listRows, requireFields, updateRow } from "./baseModel.js";

const userFields = ["name", "email", "password_hash", "role", "status"];

export function listUsers(payload = {}) {
  return listRows("users", {
    allowedFilters: ["role", "status"],
    filters: payload.filters,
    limit: payload.limit,
    offset: payload.offset,
    orderBy: "created_at",
    searchable: ["name", "email"],
    search: payload.search,
    select: "id, name, email, role, status, created_at, updated_at",
  });
}

export async function createUser(payload = {}) {
  requireFields(payload, ["name", "email"]);

  if (!payload.password_hash && !payload.password) {
    const error = new Error("Missing required field(s): password");
    error.statusCode = 400;
    throw error;
  }

  const password_hash = payload.password_hash || (await bcrypt.hash(payload.password, 12));
  return createRow("users", { ...payload, password_hash }, userFields);
}

export function updateUser(payload = {}) {
  requireFields(payload, ["id"]);
  return updateRow("users", payload.id, payload, ["name", "email", "role", "status"]);
}

export async function loginUser(payload = {}) {
  requireFields(payload, ["email", "password"]);

  const rows = await query(
    "SELECT id, name, email, password_hash, role, status FROM users WHERE email = :email LIMIT 1",
    { email: payload.email },
  );
  const user = rows[0];

  if (!user || user.status !== "active") {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.password_hash);

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const safeUser = {
    email: user.email,
    id: user.id,
    name: user.name,
    role: user.role,
    status: user.status,
  };
  const token = jwt.sign(safeUser, process.env.JWT_SECRET || "imigani_dev_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  return {
    token,
    user: safeUser,
  };
}
