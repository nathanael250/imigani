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
  mail: {
    from: process.env.MAIL_FROM || process.env.MAIL_USER || "",
    host: process.env.MAIL_HOST || "",
    pass: process.env.MAIL_PASS || "",
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === "true",
    to: process.env.MAIL_TO || "info@imiganisafarisandtours.com",
    user: process.env.MAIL_USER || "",
  },
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5055),
  wawp: {
    accessToken: process.env.WAWP_ACCESS_TOKEN || "",
    apiUrl: process.env.WAWP_API_URL || "https://api.wawp.net/v2/send/text",
    instanceId: process.env.WAWP_INSTANCE_ID || "",
    notifyNumber: process.env.WAWP_NOTIFY_NUMBER || "+250781796824",
  },
};

export default env;
