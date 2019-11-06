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
	var type;
	if (!req.isAuthenticated()) {
		type = 'Not Logged in'
		res.render('login', { title: 'Makan Place', auth: false, type: type });
	}
	var user = req.users.uname;
	var name = req.users.name;
	var email = req.users.email;
	var phoneNo = req.users.phoneNum;
	var status = req.users.type; 

	if (status == 'Diner') {
		type = 'Diner'; 
	} 
	else {
		type = 'Owner';
	}
	res.render('dashboard', { title: 'Dashboard', auth: true, type: type, name: name, user: user, email: email, phoneNo: phoneNo, status: status, info_msg: msg(req, 'info', 'Information updated successfully', 'Error in updating information'), pass_msg: msg(req, 'pass', 'Password updated successfully', 'Error in updating password') });
});

router.post('/update_info', update_info);
router.post('/update_pass', update_pass);

// POST 
function update_info(req, res, next) {
	var username  = req.user.uname;
	var name = req.body.name;
	var email  = req.body.email;
	var phoneNo  = req.body.phoneNo;
	pool.query(sql_query.query.update_info, [username, name, email, phoneNo], (err, data) => {
		if(err) {
			console.error("Error in update info");
			res.redirect('/dashboard?info=fail');
		} else {
			res.redirect('/dashboard?info=pass');
		}
	});
}
function update_pass(req, res, next) {
	var username = req.user.username;
	var password = bcrypt.hashSync(req.body.password, salt);
	pool.query(sql_query.query.update_pass, [username, password], (err, data) => {
		if(err) {
			console.error("Error in update pass");
			res.redirect('/dashboard?pass=fail');
		} else {
			res.redirect('/dashboard?pass=pass');
		}
	});
}

module.exports = router;
