
module.exports = function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.csrf = req.csrfToken();
    next();
};
