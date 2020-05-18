/* Check if user is not authenticated
*  This router reachable only by unauthenticated users
* */
const checkNotAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
};

module.exports = checkNotAuth;
