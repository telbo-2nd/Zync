exports.isAdminMiddleware = function (request, response, next) {
    const user = request.user;
    if (!user) {
        return response.status(401).json({ message: "un-authorized" });
    }
    if (!user.isAdmin) {
        return response.status(403).json({ message: "Forbidden" });
    }
    next();
};  