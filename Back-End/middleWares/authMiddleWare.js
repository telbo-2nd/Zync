const { verifyToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

exports.authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // 1. Check header exists
    if (!authHeader) {
        return next(new AppError("Authorization header missing", 401));
    }

    // 2. Split Bearer + token
    const [type, token] = authHeader.split(" ");

    // 3. Check Bearer
    if (type !== "Bearer") {
        return next(new AppError("Invalid token type", 401));
    }

    // 4. Check token exists
    if (!token) {
        return next(new AppError("Token missing", 401));
    }

    // 5. Verify token
    const user = verifyToken(token);

    if (!user) {
        return next(new AppError("Invalid or expired token", 401));
    }

    // 6. Attach user to request
    req.user = user;

    next();
};