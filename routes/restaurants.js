const sql_query = require('../db');
const passport = require('passport');
const bcrypt = require('bcrypt');

var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

//TODO: send user to individual restaurant page when clicked
router.get('/', function(req, res, next) {
	var restaurant = "%" + req.query.restaurantname + "%";
	var tbl, type, auth;
	pool.query(sql_query.query.search_rest, [restaurant], (err, data) => {
		if (err || !data.rows || data.rows.length == 0) {
			tbl = [];
		}
		else {
			tbl = data.rows;
		}
		if (!req.isAuthenticated()) {
			type = 'Not Logged in'
			res.render('restaurants', { title: 'Makan Place', auth: false, type: type, tbl: tbl });
		}
		else {
			if (req.users.type == 'Diner') {
				type = 'Diner'
				res.render('restaurants', { title: 'Makan Place', auth: true, type: type, tbl: tbl });
			}
			else {
				type = 'Owner'
				res.render('restaurants', { title: 'Makan Place', auth: true, type: type, tbl: tbl });
			}
		}
	});
});

module.exports = router;
