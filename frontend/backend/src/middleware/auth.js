import jwt from "jsonwebtoken";

export default function auth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    const error = new Error("Authentication token is required");
    error.statusCode = 401;
    return next(error);
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "imigani_dev_secret");
    return next();
  } catch {
    const error = new Error("Invalid authentication token");
    error.statusCode = 401;
    return next(error);
  }
}
