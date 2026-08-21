import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import env from "./config/env.js";
import paths from "./config/paths.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import masterRoutes from "./routers/master.routes.js";

const app = express();

const corsOptions = {
  allowedHeaders: ["Content-Type", "Authorization", "Command", "X-Command"],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  origin(origin, callback) {
    if (!origin || env.clientOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
};

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", "data:", "blob:", ...env.clientOrigins],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(cors(corsOptions));

app.use(
  rateLimit({
    legacyHeaders: false,
    max: Number(process.env.RATE_LIMIT_MAX || 300),
    standardHeaders: true,
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== "test") {
  app.use(morgan("dev"));
}

app.use(paths.uploads, express.static(path.resolve(process.cwd(), "uploads")));

app.get(paths.health, (_req, res) => {
  res.json({
    ok: true,
    service: "imigani-backend",
  });
});

app.post(paths.health, (_req, res) => {
  res.json({
    ok: true,
    service: "imigani-backend",
  });
});

app.get("/", (_req, res) => {
  res.json({
    message: "Use POST / with a Command header or request body to call the API.",
    ok: true,
    service: "imigani-backend",
  });
});

app.use(paths.apiBase, masterRoutes);
app.use("/api", masterRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
