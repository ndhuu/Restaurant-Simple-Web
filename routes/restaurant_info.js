const sql_query = require('../db');
const passport = require('passport');
const bcrypt = require('bcrypt');

var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* GET home page. */
router.get('/', function(req, res, next) {
	var cuisine, location, time, auth, type;
	time = ['5:00 am', '5:30 am', '6:00 am', '6:30 am', '7:00 am', '7:30 am', '8:00 am', '8:30 am',
	'9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm',
	'1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', 
	'5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', 
	'9:00 pm', '9:30 pm', '10:00 pm', '10:30 pm', '11:00 pm', '11:30 pm', '12:00 am', '12:30 am'];
	pool.query(sql_query.query.view_cui, (err, data) => {
		if (err || !data.rows || data.rows.length == 0) {
			cuisine = [];
		}
		else {
			cuisine = data.rows;
		}
		pool.query(sql_query.query.view_loc, (err, data) => {
			if (err || !data.rows || data.rows.length == 0) {
				location = [];
			}
			else {
				location = data.rows;
			}
			if (!req.isAuthenticated()) {
				type = 'Not Logged in'
				res.render('restaurant_info', { title: 'Makan Place', auth: false, type: type, location: location, cuisine: cuisine, time: time });
			}
			else {
				type = 'Diner'
				res.render('restaurant_info', { title: 'Makan Place', auth: true, type: type, location: location, cuisine: cuisine, time: time });
			}
  		});
	});
});

module.exports = router;
