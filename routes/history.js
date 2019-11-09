const sql_query = require('../db');
const passport = require('passport');
const bcrypt = require('bcrypt');
const notifier = require('node-notifier');

const round = 10;
const salt  = bcrypt.genSaltSync(round);

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

router.get('/', function(req, res, next) {
	var auth = req.isAuthenticated();
	if (!req.isAuthenticated()) {
		res.redirect('/login');
	}
	var type;
	var user = req.user.username;
	var notused, used, reserve;
	pool.query(sql_query.query.view_red_notused, [user], (err, data) => {
		if (err) {
			notused =[];
		}
		else {
			notused = data.rows;
		}
		pool.query(sql_query.query.view_red_used, [user], (err, data) => {
			if (err) {
				used = [];
			}
			else {
				used = data.rows;
			}
			pool.query(sql_query.query.view_dinereser, [user], (err, data) => {
				if (err) {
					reserve = [];
				}
				else {
					for (let i = 0; i < data.rows.length; i++) {
						data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
					}
					reserve = data.rows;
				} 
				res.render('history', { title: 'Makan Place', notused: notused, used: used, reserve: reserve, auth: auth });
			});
		}); 
	});
});

//
router.post('/update_rate', function(req, res, next) {
	var rname = req.body.rname;
	var address = req.body.address;
	var date = req.body.date;
	var time = req.body.time;
	var user = req.user.username;
	var rate = req.body.rate;
	var status = req.body.status;
	if (status != 'Completed') { 
		// console.error(err);
		notifier.notify({
	        title: "Error",
	        message: "Ratings can only be done after the reservation is complete.",
	    }); 
		res.redirect('/history');
	}
	else {
		pool.query(sql_query.query.give_rate, [rate, user, rname, address, time, date], (err, data) => {
			if (err) {
				console.error(err);
				notifier.notify({
			        title: "Error",
			        message: "Please try again.",
			    }); 
			}
			res.redirect('/history');
		});
	}
});

//
router.post('/del_reser', function(req, res, next) {
	var rname = req.body.rname;
	var address = req.body.address;
	var date = req.body.date;
	var time = req.body.time;
	var user = req.user.username;
	pool.query(sql_query.query.del_reser, [rname, address, date, time, user], (err, data) => {
		if (err) {
			console.error(err);
			notifier.notify({
		        title: "Error",
		        message: "Please try again.",
		    }); 
		}
		else {
			notifier.notify({
		        title: "Notice",
		        message: "Reservation successfully deleted",
		    }); 
		}
		res.redirect('/history');
	});
});

module.exports = router;