import jwt from "jsonwebtoken";

export default function authOptional(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "imigani_dev_secret");
  } catch {
    req.user = null;
  }

  return next();
}
