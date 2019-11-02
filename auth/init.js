const sql_query = require('../db/index');
const db = require('../db/db')

const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const authMiddleware = require('./middleware');
const antiMiddleware = require('./antimiddle');

// Postgre SQL Connection
const pool = db.getDatabase();

function findUser (username, type, callback) {
	pool.query(sql_query.query.userpass, [username, type], (err, data) => {
		if(err) {
			console.error("Cannot find user");
			return callback(null);
		}
		
		if(data.rows.length == 0) {
			console.error("User does not exists?");
			return callback(null)
		} else if(data.rows.length == 1) {
			return callback(null, {
				uname       : data.rows[0].uname,
				passwordHash: data.rows[0].password,
				name        : data.rows[0].name,
				type        : data.rows[0].type,
			});
		} else {
			console.error("More than one user?");
			return callback(null);
		}
	});
}

passport.serializeUser(function (user, cb) {
  cb(null, {uname: user.uname, type: user.type});
})

passport.deserializeUser(function (user, cb) {
  findUser(user.uname, user.type, cb);
})

function initPassport () {
  passport.use(new LocalStrategy(
    (username, password, type, done) => {
      findUser(username, type, (err, user) => {
        if (err) {
          return done(err);
        }

        // User not found
        if (!user) {
          console.error('User not found');
          return done(null, false);
        }

        // Always use hashed passwords and fixed time comparison
        bcrypt.compare(password, user.passwordHash, (err, isValid) => {
          if (err) {
            return done(err);
          }
          if (!isValid) {
            return done(null, false);
          }
          return done(null, user);
        })
      })
    }
  ));

  passport.authMiddleware = authMiddleware;
  passport.antiMiddleware = antiMiddleware;
	passport.findUser = findUser;
}

module.exports = initPassport;