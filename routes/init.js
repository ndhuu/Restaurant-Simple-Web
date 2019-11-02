const sql_query = require('../db');
const passport = require('passport');
const bcrypt = require('bcrypt')

// Postgre SQL Connection
const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
  //ssl: true
});

const round = 10;
const salt  = bcrypt.genSaltSync(round);

function initRouter(app) {
	/* GET */
	app.get('/'      , index );
	app.get('/search', search);
	app.get('/restaurant_info', restaurant_info); //how to do dynamic url?

	/* PROTECTED GET aka - logged in */
	/* diner */
	app.get('/dashboard', passport.authMiddleware(), dashboard); //ejs not done
	app.get('/favourites', passport.authMiddleware(), favourites); 
	app.get('/rewards', passport.authMiddleware(), rewards); 
	app.get('/history', passport.authMiddleware(), history); //ejs not done

	/* owner */
	app.get('/my_restaurants', passport.authMiddleware(), my_restaurants); //js done
	app.get('/workers', passport.authMiddleware(), workers); 

	/* owner and worker */
	app.get('/reservations', passport.authMiddleware(), reservations); //ejs not done

	/* all users */
	app.get('/register', passport.authMiddleware(), register); 
	app.get('/password' , passport.antiMiddleware(), retrieve );

	/* PROTECTED POST */
	app.post('/update_info', passport.authMiddleware(), update_info); //all users js done
	app.post('/update_pass', passport.authMiddleware(), update_pass); //js done

	/* diner */
	app.post('/add_reservation', passport.authMiddleware(), add_reservation);
	app.post('/update_rating', passport.authMiddleware(), update_rating);
	app.post('/update_reservation', passport.authMiddleware(), update_reservation); //if diner wants to delete/update 
	app.post('/update_redeemtion', passport.authMiddleware(), update_reservation);
	app.post('/update_favourites', passport.authMiddleware(), update_favourites);

	/* owner */ 
	app.post('/add_restaurant', passport.authMiddleware(), add_restaurant);
	app.post('/add_worker', passport.authMiddleware(), add_worker);
	app.post('/update_restaurant', passport..authMiddleware(), update_restaurant);
	app.post('/delete_worker', passport.authMiddleware(), delete_worker);

	/* owner and worker */
	app.post('/manual_reservation', passport.authMiddleware(), manual_reservation);

	app.post('/reg_user', passport.authMiddleware(), reg_user);

	/* LOGIN */
	app.post('/login', passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/'
	}));
	
	/* LOGOUT */
	app.get('/logout', passport.authMiddleware(), logout);
}

// Render Function
function basic(req, res, page, other) {
	var info = {
		page: page,
		uname: req.users.uname,
		name: req.users.name,
		email : req.users.email,
		phoneNum : req.users.phoneNum,
		type   : req.users.type,
	};
	if(other) {
		for(var fld in other) {
			info[fld] = other[fld];
		}
	}
	res.render(page, info);
}
function query(req, fld) {
	return req.query[fld] ? req.query[fld] : '';
}
function msg(req, fld, pass, fail) {
	var info = query(req, fld);
	return info ? (info=='pass' ? pass : fail) : '';
}

function index(req, res, next) {
	var cuisine, location;
	pool.query(sql_query.query.view_cui, (err, data) => {
		if (err || !data.rows || data.rows.length == 0) {
			cuisine = [];
		}
		else {
			cuisine = data.rows;
		}
		pool.query(sql_query.query.view_loc, (err, data) => {
			if (err || !data.rows || data.rows.length == 0) {
				location = [];
			}
			else {
				location = data.rows;
			}
			if (!req.isAuthenticated()) {
				res.render('index', { page: '', auth: false, location: location, cuisine: cuisine });
			}
			else {
				basic(req, res, 'index', { page: '', auth: true, location: location, cuisine: cuisine })
			}
		});
	});
}

//search restaurant 
//ctx : total num of restaurants
function search(req, res, next) {
	var ctx  = 0, tbl;
	var game = "%" + req.query.restName.toLowerCase() + "%"; //input type text name restName 
	pool.query(sql_query.query.search_rest, [restaurant], (err, data) => {
		if(err || !data.rows || data.rows.length == 0) {
			ctx = 0;
			tbl = [];
		} else {
			ctx = data.rows.length;
			tbl = data.rows;
		}
		if(!req.isAuthenticated()) {
			res.render('search', { page: 'search', auth: false, tbl: tbl, ctx: ctx });
		} else {
			basic(req, res, 'search', { page: 'search', auth: true, tbl: tbl, ctx: ctx });
		}
	});
}

//ejs not done 
//dashboard for user to make changes 
function dashboard(req, res, next) {
	basic(req, res, 'dashboard', { info_msg: msg(req, 'info', 'Information updated successfully', 'Error in updating information'), pass_msg: msg(req, 'pass', 'Password updated successfully', 'Error in updating password'), auth: true });
}

//my_restaurant for owner 
//ctx : number of restaurants
//tbl : list of restaurants
function my_restaurants(req, res, next) {
	var ctx = 0, total = 0, tbl;
	pool.query(sql_query.query.view_rest, [req.user.username], (err, data) => {
		if(err || !data.rows || data.rows.length == 0) {
			ctx = 0;
			tbl = [];
		} else {
			ctx = data.rows.length;
			tbl = data.rows;
		}
		basic(req, res, 'my_restaurant', { ctx: ctx, avg: avg, tbl: tbl, game_msg: msg(req, 'add', 'Game added successfully', 'Game does not exist'), auth: true });
	});
}

function register(req, res, next) {
	res.render('register', { page: 'register', auth: false });
}

function retrieve(req, res, next) {
	res.render('retrieve', { page: 'retrieve', auth: false });
}

// POST 
function update_info(req, res, next) {
	var uname  = req.user.uname;
	var name = req.body.name;
	var email  = req.body.email;
	var phoneNum  = req.body.phoneNum;
	pool.query(sql_query.query.update_info, [uname, name, email, phoneNum], (err, data) => {
		if(err) {
			console.error("Error in update info");
			res.redirect('/dashboard?info=fail');
		} else {
			res.redirect('/dashboard?info=pass');
		}
	});
}

function update_pass(req, res, next) {
	var uname = req.user.uname;
	var password = bcrypt.hashSync(req.body.password, salt);
	pool.query(sql_query.query.update_pass, [uname, password], (err, data) => {
		if(err) {
			console.error("Error in update pass");
			res.redirect('/dashboard?pass=fail');
		} else {
			res.redirect('/dashboard?pass=pass');
		}
	});
}

//owner, rname, address
//location, cuisine
//availability, opening hours
//promotions
function add_restaurant(req, res, next) {

}



/* 
function reg_user(req, rew, next) {

}*/

// LOGOUT
function logout(req, res, next) {
	req.session.destroy()
	req.logout()
	res.redirect('/')
}

module.exports = initRouter;
