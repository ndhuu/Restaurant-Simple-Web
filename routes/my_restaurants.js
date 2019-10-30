var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('my_restaurants', { title: 'My Restaurants' });
});

module.exports = router;
