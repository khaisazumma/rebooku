const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login")
  }
  next()
}

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).render("error", {
      message: "Access denied. Admin privileges required.",
      user: req.session.user,
    })
  }
  next()
}

module.exports = { requireAuth, requireAdmin }
