module.exports = function ensureAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).render('error', {
    pageTitle: 'Forbidden',
    message: 'You do not have permission to access that page.'
  });
};
