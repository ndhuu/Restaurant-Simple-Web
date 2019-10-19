var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('rewards', { title: 'Table' });
});

module.exports = router;
