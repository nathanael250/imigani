import mysql from "mysql2/promise";
import env from "./env.js";

const pool = mysql.createPool({
  ...env.db,
  connectionLimit: 10,
  dateStrings: true,
  namedPlaceholders: true,
  waitForConnections: true,
});

export async function query(sql, params = {}) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function transaction(callback) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;
