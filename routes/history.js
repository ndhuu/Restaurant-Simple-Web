const sql_query = require('../db');
const passport = require('passport');
const bcrypt = require('bcrypt');

const round = 10;
const salt  = bcrypt.genSaltSync(round);

var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});


//check ejs rating . . .
router.get('/', function(req, res, next) {
	var type;
	// var user = req.users.uname;
	var user = 'foxtrot99';
	var rewards, reserve;
	pool.query(sql_query.query.view_red, [user], (err, data) => {
		if (err) {
			rewards =[];
		}
		else {
			rewards = data.rows;
		}
		pool.query(sql_query.query.view_dinereser, [user], (err, data) => {
			if (err) {
				reserve = [];
			}
			else {
				reserve = data.rows;
			} 
			res.render('history', { title: 'Makan Place', rewards: rewards, reserve: reserve });
		});
	});
});

router.post('/update_rate', function(req, res, next) {
	var rname = req.body.rname;
	var address = req.body.address;
	var date = req.body.date;
	var time = req.body.time;
	var user = req.users.uname;
	pool.query(sql_query.query.give_rate, [user, rname, address, time, date], (err, data) => {
		if (err) {
			throw err;
		}
		else {
			//successfully rated 
		}
		res.redirect('/history')
	})
})



module.exports = router;
