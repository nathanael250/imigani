import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import "../src/config/env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, "../src/config/imigani_db.sql");

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  multipleStatements: true,
  password: process.env.DB_PASSWORD || "",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
});

try {
  const schema = await fs.readFile(schemaPath, "utf8");
  await connection.query(schema);
  console.log("Database schema imported from src/config/imigani_db.sql");
} finally {
  await connection.end();
}
