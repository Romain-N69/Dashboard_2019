const router = require('express').Router();
const Users_tools = require('../models/user_tools');

var userP;

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/login');
  } else {
    next();
  }
}

router.get('/', authCheck, (req, res) => {
  (async () => {
      userP = await Users_tools.findUserById(req.user);
      res.render('profile', { user: userP});
  })();
});

module.exports = router;