/* Check if user is authenticated
*  This router reachable only by authenticated users
* */
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
};

module.exports = checkAuth;
