const sql_query = require('../db');
const passport = require('passport');
const bcrypt = require('bcrypt');

var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});


//change sql query to all rewards that is valid at the current date AND the user have not redeemed yet
router.get('/', function(req, res, next) {
	var user = req.users.uname; 
	var rewards, points;
	pool.query(sql_query.query.view_curr_rewards, (err, data) => {
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
				points = data;
			}
		})
		res.render('rewards', { title: 'Makan Place', rewards: rewards, points: points });
	});
});

router.post('/redeem', function(req, res, next) {
	var reward_id = req.body.rid;
	var start = req.body.start;
	var end = req.body.end; 
	var user = req.users.uname;


	var date = start, time = start;
	//how get current date and time 

	pool.query(sql_query.sql_query.add_red, [user, reward_id, date, time], (err, data) => {
		// if (err) {
		// 	throw err;
		// }
		res.redirect('/rewards');
	})
})

module.exports = router;