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
	var rname = "%" + req.query.restaurantname + "%";
	var cuisine = req.query.cuisine;
	var location = req.query.location;
	var date = req.query.date;
	var time = req.query.time;
	var tbl, type, auth;
	//only from search bar 
	if (rname != "%%") {
		pool.query(sql_query.query.search_rest, [rname], (err, data) => {
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
	}
	//from side form
	else {
		//ok idk how to choose all if using WHERE clause
		if (cuisine == "Any Cuisine") {
			cuisine = '1 = 1';
		}
		if (location == "Any Location") {
			location = '1 = 1';
		}
		//get rname and address where cname = cuisine, area = location, time within opening hours
		//cuisine
		pool.query(sql_query.query.view_restcui, [cuisine], (err, data) => {
			if (err || !data.rows || data.rows.length == 0) {
				tbl = [];
			}
			else {
				tbl = data.rows;
				//location
				pool.query(sql_query.query.view_restloc, [location], (err, data) => {
					if (!(err || !data.rows || data.rows.length == 0)) {
						tbl += data.rows; 
					}
				});
			}
		});
	}
});

module.exports = router;
