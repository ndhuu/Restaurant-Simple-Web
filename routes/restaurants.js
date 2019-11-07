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
	if (req.query == {}) {
		pool.query(sql_query.query.view_allrest, (err, data) => {
			if (err) {
				data = [];
			}
			else {
				for (let i = 0; i < data.rows.length; i++) {
					data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(data.rows[i].rname) + "&:" + encodeURI(data.rows[i].address);
				}
			}
			res.render('restaurants', {title: 'Makan Place', data: data.rows, rname: rname, cuisine: cuisine });
		});
	}
	else if (rname != "%undefined%") {
		rname = '%';
		pool.query(sql_query.query.search_rest, [rname], (err, data) => {
			if (err || !data.rows) {
				data = [];
			}
			else {
				for (let i = 0; i < data.rows.length; i++) {
					data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(data.rows[i].rname) + "&:" + encodeURI(data.rows[i].address);
				}
			}
			res.render('restaurants', {title: 'Makan Place', data: data.rows, rname: rname, cuisine: cuisine });
		});
	}

	//from side form
	else {
		if (cuisine == "Any Cuisine" || cuisine == '') {
			cuisine = '%';
		}
		if (location == "Any Location" || location == '') {
			location = '%';
		}
		//get rname and address where cname = cuisine, area = location, time within opening hours
		//cuisine
		pool.query(sql_query.query.view_cuilocrest, [location, cuisine], (err, data) => {
			if (err || !data.rows) {
				data = [];
			}
			else {
				//location
				// pool.query(sql_query.query.view_restloc, [location], (err, data) => {
				// 	if (!(err || !data.rows || data.rows.length == 0)) {
						for (let i = 0; i < data.rows.length; i++) {
							data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(data.rows[i].rname) + "&:" + encodeURI(data.rows[i].address);
						}
					// }
					// res.render('restaurants', {title: 'Makan Place', data: data.rows, rname: rname });
				// });
			}
			res.render('restaurants', {title: 'Makan Place', data: data.rows, rname: rname, cuisine: cuisine });
		});
	}
});


router.get('/goto:rname&:address', function(req, res, next) {
	var rname = decodeURI(req.params.rname).substr(1);
	var address = decodeURI(req.params.address).substr(1); //idk why not the whole address shown :(
	var addr = address + '%';
	var cuisine, location, time, auth, type, openDay, sHour, eHour, promo, menu;
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
						res.render('restaurant_info', { title: 'Makan Place', rname: rname, address: address, location: location, cuisine: cuisine, time: time, openHour: openHour, promo: promo, menu: menu });
					});
				});
			});
  		});
	});
});


//cant get rname & addr -> undefined :( 
router.post('/restaurant_info/add_fav', function(req, res, next) {
	var rname = req.body.rname;
	var address = req.body.address + '%';
	//var user = req.users.uname; //needs to be logged in 
	var user = 'itsme';
	// res.redirect('/restaurants/goto:${encodeURI(rname)}&:${encodeURI(address)}');
	res.redirect(`/restaurants/goto:${encodeURI(rname)}&:${encodeURI(address)}`);
	// pool.query(sql_query.query.get_addr, [rname, address], (err, data) => {
	// 	if (err || !data.rows || data.rows.length == 0) {
	// 		throw err;
	// 	}
	// 	else {
	// 		address = data.rows.address;
	// 	}
	// 	pool.query(sql_query.query.add_fav, [uname, rname, address], (err, data) => {
	// 		if (err) {
	// 			throw err;
	// 		}
	// 		res.redirect(`/restaurants/goto:${encodeURI(rname)}&:${encodeURI(address)}`) ;
	// 	});
	// });
});

//cant get rname & addr -> undefined :( 
//still have to check if date + time is within opening hours 
router.post('/add_reser', function(req, res, next) {
	var rname = req.body.rname;
	var address = req.body.address + '%';
	//var user = req.users.uname; //needs to be logged in 
	var user = 'itsme';
	var date = req.body.date;
	var time = req.body.time; 
	var pax = req.body.pax; 
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
