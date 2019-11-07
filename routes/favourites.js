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
	var fav;
	// var user = req.users.uname; 
	var user = 'delta99';
	pool.query(sql_query.query.view_fav, [user], (err, data) => {
		if (err || !data.rows || data.rows.length == 0) {
			fav = [];
		}
		else {
			fav = data.rows;
		}
		res.render('favourites', { title: 'Makan Place', data: fav });
	});
});

router.post('/unfavourite', function(req, res, next) {
	var rname = req.body.rname;
	var address = req.body.address;
	// var user = req.users.uname; 
	var user = 'delta99';
	pool.query(sql_query.query.del_fav, [user, rname, address], (err,data) => {
		if (err) {
			throw err;
		}
		else {
			//success 
		}
		res.redirect('/favourites');
	})
})

module.exports = router;