function authMiddleware(roles) {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      for (var role in roles) {
        if (req.user.type == roles[role]) {
          return next()
        }
      }
      if (req.user.type == "Diner") {
        res.redirect('/')
        return
      }
      if (req.user.type == "Worker") {
        res.redirect('/some_dummy')
        return
      }
      if (req.user.type == "Owner") {
        res.redirect('/my_restaurants')
        return
      }
    }
    res.redirect("/")

  }

}

module.exports = authMiddleware