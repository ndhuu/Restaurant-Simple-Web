const sql_query = require('../db');
const passport = require('passport');
const bcrypt = require('bcrypt');

var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

router.get('/', function(req, res, next) {
	pool.query(sql_query.query.view_allrest, (err, data) => {
		if (err) {
			throw err;
		}
		for (let i = 0; i < data.rows.length; i++) {
			data.rows[i]["link"] = "/restaurant/rname:" + encodeURI(data.rows[i].rname + "&:" + encodeURI(data.rows[i].address));
		}
		res.render('/restaurant_info', {title: 'Restaurant', data: data.rows, sample_link: "/sample"});
	});
});

/* GET home page. */
router.get('/restaurant/rname:&:address', function(req, res, next) {
	var rname = decodeURI(req.params.rname);
	var address = decodeURI(req.params.address);
	var cuisine, location, time, auth, type, openHour, promo, menu;
	pool.query(sql_query.query.view_cuirest, [rname, addr], (err, data) => {
		if (err || !data.rows || data.rows.length == 0) {
			cuisine = [];
		}
		else {
			cuisine = data.rows;
		}
		pool.query(sql_query.query.view_locrest, [rname, addr], (err, data) => {
			if (err || !data.rows || data.rows.length == 0) {
				location = [];
			}
			else {
				location = data.rows;
			}
			pool.query(sql_query.query.view_oh, [rname, addr], (err, data) => {
				if (err || !data.rows || data.rows.length == 0) {
					openHour = [];
				}
				else {
					openHour = data.rows;
				}
				pool.query(sql_query.query.view_prom, [rname, addr], (err, data) => {
					if (err || !data.rows || data.rows.length == 0) {
						promo = [];
					}
					else {
						promo = data.rows;
					}
					pool.query(sql_query.query.view_fnb, [rname, addr], (err, data) => {
						if (err || !data.rows || data.rows.length == 0) {
							menu = [];
						}
						else {
							menu = data.rows;
						}
						if (!req.isAuthenticated()) {
							type = 'Not Logged in'
							res.render('restaurant_info', { title: 'Makan Place', auth: false, type: type, location: location, cuisine: cuisine, time: time, openHour: openHour, promo: promo, menu: menu });
						}
						else {
							type = 'Diner'
							res.render('restaurant_info', { title: 'Makan Place', auth: true, type: type, location: location, cuisine: cuisine, time: time, openHour: openHour, promo: promo, menu: menu });
						}
					});
				});
			});
  		});
	});
});

router.post('/add_fav', function(req, res, next) {
	var rname = req.body.rname;
	var address = req.body.address + '%';
	//var user = req.users.uname; //needs to be logged in 
	var user = 'itsme';
	pool.query(sql_query.query.get_addr, [rname, address], (err, data) => {
		if (err || !data.rows || data.rows.length == 0) {
			throw err;
		}
		else {
			address = data.rows.address;
		}
		pool.query(sql_query.query.add_fav, [uname, rname, address], (err, data) => {
			if (err) {
				throw err;
			}
			res.redirect('/restaurants/goto:${encodeURI(rname)}&:${encodeURI(address)}');
		});
	});
});

//still have to check if date + time is within opening hours 
router.post('/add_reser', function(req, res, next) {
	var rname = req.body.rname;
	var address = req.body.address + '%';
	//var user = req.users.uname; //needs to be logged in 
	var user = 'itsme';
	var date = req.query.date;
	var time = req.query.time; 
	var pax = req.query.pax; 
	pool.query(sql_query.query.get_addr, [rname, address], (err, data) => {
		if (err || !data.rows || data.rows.length == 0) {
			throw err;
		}
		else {
			address = data.rows.address;
		}
		pool.query(sql_query.query.add_reser, [uname, rname, address, pax, time, date], (err, data) => {
			if (err) {
				throw err;
			}
			res.redirect('/restaurants/goto:${encodeURI(rname)}&:${encodeURI(address)}');
		});
	});
});

module.exports = router;
