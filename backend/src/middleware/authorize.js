export default function authorize(allowedRoles = []) {
  return (req, _res, next) => {
    if (!allowedRoles.length) {
      return next();
    }

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const error = new Error("You are not allowed to perform this action");
      error.statusCode = 403;
      return next(error);
    }

    return next();
  };
}
