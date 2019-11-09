const sql_query = require('../db');
const passport = require('passport');
const bcrypt = require('bcrypt');

const notifier = require('node-notifier');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

function encodeHashtag(str) {
  return str.replace("#", "hashtag");
}

function decodeHashtag(str) {
  return str.replace("hashtag", "#");
}

//TODO: send user to individual restaurant page when clicked
router.get('/', function(req, res, next) {
	var rname = "%" + req.query.restaurantname + "%";
	var cuisine = req.query.cuisine;
	var location = req.query.location;
	var date = req.query.date;
	var time = req.query.time;
	var tbl, type, auth, popular = [];
	var auth = req.isAuthenticated();
	//only from search bar 
	if (Object.keys(req.query).length === 0) {
		if (!req.isAuthenticated()) {
			pool.query(sql_query.query.view_allrest, (err, data) => {
				if (err) {
					data = [];
				}
				else {
					for (let i = 0; i < data.rows.length; i++) {
						data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
					}
				}
				res.render('restaurants', {title: 'Makan Place', data: data.rows, rname: rname, cuisine: cuisine, popular: popular, auth: auth });
			});
		}
		else {
			var user = req.user.username; 
			pool.query(sql_query.query.view_poprestloc, [user], (err, data) => {
				if (err || !data.rows || data.rows.length == 0) {
					popular = [];
				}
				else {
					for (let i = 0; i < data.rows.length; i++) {
						data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
					} 
					popular = data.rows;
				}
				pool.query(sql_query.query.view_poprestloc1, [user], (err, data) => {
					if (err || !data.rows || data.rows.length == 0) {
						data = [];
					}
					else {
						for (let i = 0; i < data.rows.length; i++) {
							data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
						} 
					}
					res.render('restaurants', {title: 'Makan Place', data: data.rows, rname: rname, cuisine: cuisine, popular: popular, auth: auth });
				});
			});
		}
	}
	else if (rname != "%undefined%") {
		if (!req.isAuthenticated()) {
			pool.query(sql_query.query.search_rest, [rname], (err, data) => {
				if (err || !data.rows) {
					data = [];
				}
				else {
					for (let i = 0; i < data.rows.length; i++) {
						data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
					}
				}
				res.render('restaurants', {title: 'Makan Place', data: data.rows, rname: rname, cuisine: cuisine, popular: popular, auth: auth });
			});
		}
		else {
			var user = req.user.username; 
			pool.query(sql_query.query.view_poprestloc, [user], (err, data) => {
				if (err || !data.rows || data.rows.length == 0) {
					popular = [];
				}
				else {
					for (let i = 0; i < data.rows.length; i++) {
						data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
					} 
					popular = data.rows;
				}
				pool.query(sql_query.query.view_poprestloc2, [user, rname], (err, data) => {
					if (err || !data.rows || data.rows.length == 0) {
						data = [];
					}
					else {
						for (let i = 0; i < data.rows.length; i++) {
							data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
						} 
					}
					res.render('restaurants', {title: 'Makan Place', data: data.rows, rname: rname, cuisine: cuisine, popular: popular, auth: auth });
				});
			});
		}
	}
	else {
		if (cuisine == "Any Cuisine" || cuisine == '') {
			cuisine = '%';
		}
		if (location == "Any Location" || location == '') {
			location = '%';
		}
		//get rname and address where cname = cuisine, area = location, time within opening hours
		//cuisine
		if (!req.isAuthenticated()) {
			pool.query(sql_query.query.view_cuilocrest, [location, cuisine], (err, data) => {
				if (err || !data.rows) {
					data = [];
				}
				else {
					for (let i = 0; i < data.rows.length; i++) {
						data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
					} 
				}
				res.render('restaurants', {title: 'Makan Place', data: data.rows, rname: rname, cuisine: cuisine, popular: popular, auth: auth });
			});
		}
		else {
			var user = req.user.username; 
			pool.query(sql_query.query.view_poprestloc, [user], (err, data) => {
				if (err || !data.rows || data.rows.length == 0) {
					popular = [];
				}
				else {
					for (let i = 0; i < data.rows.length; i++) {
						data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
					} 
					popular = data.rows;
				}
				pool.query(sql_query.query.view_poprestloc3, [user, location, cuisine], (err, data) => {
					if (err || !data.rows || data.rows.length == 0) {
						data = [];
					}
					else {
						for (let i = 0; i < data.rows.length; i++) {
							data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
						} 
					}
					res.render('restaurants', {title: 'Makan Place', data: data.rows, rname: rname, cuisine: cuisine, popular: popular, auth: auth });
				});
			});
		}
	}
});


router.get('/goto:rname&:address', function(req, res, next) {
	var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1);
	var address = decodeURI(decodeHashtag(req.params.address)).substr(1); //idk why not the whole address shown :(
	// var addr = address + '%';
	var user = '', addr = address;
	if (req.isAuthenticated()) {
		user = req.user.username;
	}
	var cuisine, location, time, auth, type, openHour, promo, menu, fav, rewards, date, time;
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
			pool.query(sql_query.query.view_ohtime, [rname, addr], (err, data) => {
				if (err || !data.rows || data.rows.length == 0) {
					openHour = [];
				}
				else {
					openHour = data.rows;
					for (var i = 0; i < data.rows.length; i++) {
						if (openHour[i]['day'] == 'Mon') {
							openHour[i]["daynum"] = 0;
						}
						else if (openHour[i]['day'] == 'Tues') {
							openHour[i]["daynum"] = 1;
						}
						else if (openHour[i]['day'] == 'Wed') {
							openHour[i]["daynum"] = 2;
						}
						else if (openHour[i]['day'] == 'Thurs') {
							openHour[i]["daynum"] = 3;
						}
						else if (openHour[i]['day'] == 'Fri') {
							openHour[i]["daynum"] = 4;
						}
						else if (openHour[i]['day'] == 'Sat') {
							openHour[i]["daynum"] = 5;
						}
						else if (openHour[i]['day'] == 'Sun') {
							openHour[i]["daynum"] = 6;
						}
					}
					openHour.sort(sortFunction);
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
						pool.query(sql_query.query.check_fav, [user, rname, addr], (err, data) => {
							if (err || !data.rows || data.rows.length == 0) {
								fav ='Favourite';
							}
							else {
								fav = 'Unfavourite';
							}
							pool.query(sql_query.query.view_red_notused, [user], (err, data) => {
								if (err || !data.rows || data.rows.length == 0) {
									rewards = [];
								}
								else {
									rewards = data.rows;
								}
								pool.query(sql_query.query.view_avdate, [rname, addr], (err, data) => {
									if (err || !data.rows || data.rows.length == 0) {
										date = [];
									}
									else {
										date = data.rows;
									}
									pool.query(sql_query.query.view_avtime, [rname, addr], (err, data) => {
										if (err || !data.rows || data.rows.length == 0) {
											time = [];
										}
										else {
											time = data.rows;
										}
										res.render('restaurant_info', { title: 'Makan Place', rname: rname, address: address, location: location, fav: fav, cuisine: cuisine, time: time, openHour: openHour, promo: promo, menu: menu, rewards: rewards, date: date, time: time, auth: auth });
									});
								});
							});
						});
					});
				});
			});
  		});
	});
});

function sortFunction(a, b) {
    if (a['daynum'] === b['daynum']) {
        return 0;
    }
    else {
        return (a['daynum'] < b['daynum']) ? -1 : 1;
    }
}

router.post('/add_fav', function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.redirect('/login');
	}
	var rname = req.body.rname;
	var address = req.body.address;
	var user = req.user.username; //needs to be logged in 
	var fav = req.body.fav;
	if (fav == 'Favourite') {
		pool.query(sql_query.query.add_fav, [user, rname, address], (err, data) => {
			if (err) {
				throw err;
			}
			res.redirect(`/restaurants/goto:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`) ;
		});
	}
	else {
		pool.query(sql_query.query.del_fav, [rname, address, user], (err, data) => {
			if (err) {
				throw err;
			}
			res.redirect(`/restaurants/goto:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`) ;
		});
	}
});

//still have to check if date + time is within opening hours and numpax is below maxpax
router.post('/add_reser', function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.redirect('/login');
	}
	var rname = req.body.rname;
	var address = req.body.address;
	var user = req.user.username; 
	var date = req.body.date;
	var time = req.body.time; 
	var pax = req.body.pax; 
	var rewards = req.body.rewards;


	//check if num pax below max pax
	pool.query(sql_query.query.add_reser, [user, rname, address, pax, time, date], (err, data) => {
		if (err) {
			console.error(err);
			notifier.notify({
		        title: "Error",
		        message: "Restaurant not able to accept your reservation. Please try another date and time.",
		    }); 
		}
		//check if reward used
		if (rewards != 'No code used') {
			pool.query(sql_query.query.update_red, [rname, address, user, rewards], (err, data) => {
			});
			
		}
		res.redirect(`/restaurants/goto:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`) ;
	});
});
module.exports = router;
