const sql_query = require('../db');
const passport = require('passport');
const bcrypt = require('bcrypt');

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
	var fav;
	var user = req.user.username
	pool.query(sql_query.query.view_fav, [user], (err, data) => {
		if (err || !data.rows || data.rows.length == 0) {
			fav = [];
		}
		else {
			for (let i = 0; i < data.rows.length; i++) {
				data.rows[i]["link"] = "/restaurants/goto:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
			} 
			fav = data.rows;
		}
		res.render('favourites', { title: 'Makan Place', data: fav, auth: auth });
	});
});

router.post('/unfavourite', function(req, res, next) {
	var rname = req.body.rname;
	var address = req.body.address;
	var user = req.user.username
	console.log(rname);
	console.log(address);
	console.log(user);
	pool.query(sql_query.query.del_fav, [rname, address, user], (err,data) => {
		if (err) {
			throw err;
		}
		else {
			//success  
			res.redirect('/favourites');
		}
	});
});

module.exports = router;