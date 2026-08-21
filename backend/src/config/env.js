import dotenv from "dotenv";

dotenv.config();

const clientOrigins = (process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const env = {
  clientOrigin: clientOrigins[0],
  clientOrigins,
  db: {
    database: process.env.DB_NAME || "imigani_db",
    host: process.env.DB_HOST || "127.0.0.1",
    password: process.env.DB_PASSWORD || "",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
  },
  host: process.env.HOST || "127.0.0.1",
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5055),
};

export default env;
