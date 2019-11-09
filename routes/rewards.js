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

function loadPage(req, res, next, page, other) {
	var info = {
		page: page,
		user: req.user.username,
	};
	if(other) {
		for(var fld in other) {
			info[fld] = other[fld];
		}
	}
	res.render(page, info);
}

//change sql query to all rewards that is valid at the current date AND the user have not redeemed yet
router.get('/', function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.redirect('/login');
	}
	var user = req.user.username, info_msg=''; 
	var rewards, points;
	pool.query(sql_query.query.view_notred, [user], (err, data) => {
		if (err || !data.rows || data.rows.length == 0) {
			rewards = [];
		}
		else {
			rewards = data.rows;
		}
		pool.query(sql_query.query.view_point, [user], (err, data) => {
			if (err) {
				points = 0;
			}
			else {
				points = data.rows;
			}
			res.render('rewards', { title: 'Makan Place', rewards: rewards, points: points, info_msg });
			// loadPage(req, res, next, 'rewards', { title: 'Makan Place', rewards: rewards, points: points, info_msg, red: red });
		});
	});
});

router.post('/redeem', function(req, res, next) {
	var reward_id = req.body.rid;
	var start = req.body.start;
	var end = req.body.end; 
	var user = req.user.username; 

	var info_msg ='';

	//current date
	let date_ob = new Date();
	let date = ("0" + date_ob.getDate()).slice(-2);
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();

	//current time
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();

	let currDate = year + '-' + month + '-' + date;
	let currTime = hours + ':' + minutes + ':' + seconds;

	let rname = 'Rest';
	let address = 'address';
 
	//how get current date and time 
	console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
	console.log(reward_id);
	pool.query(sql_query.query.add_red, [user, reward_id, rname, address, currDate, currTime], (err, data) => {
		if (err) {
			console.error(err);
			notifier.notify({
		        title: "Error",
		        message: "Not enough points.",
		    }); 
		}
		res.redirect('/rewards');
	});
});

module.exports = router;