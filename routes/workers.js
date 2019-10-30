var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('workers', { title: 'Workers' });
});

module.exports = router;
