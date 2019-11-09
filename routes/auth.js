var express = require('express');
var router = express.Router();
const sql_query = require('../db/index');
const passport = require('passport');
const bcrypt = require('bcrypt');
var notifier = require('node-notifier');

//var pool = require("../db/db").getDatabase()
const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
  //ssl: true
});

const round = 10;
const salt = bcrypt.genSaltSync(round);

function setUpAuthentication(app) {
    app.get('/login', passport.antiMiddleware(), function(req, res, next) {
        var auth = false;
        res.render('login', { title: 'Login', auth: auth });
    });

    app.get('/register', passport.antiMiddleware(), function(req, res, next) {
        res.render('register', { title: 'Register', auth: false });
    });

    app.get('/logout', passport.authMiddleware(['Diner', 'Owner', 'Worker']), function(req, res, next) {
        req.session.destroy()
        req.logout()
        res.redirect('/')
    });

    app.post('/reg_user', passport.antiMiddleware(), function(req, res, next) {
        // Retrieve Information
        var uname = req.body.username;
        var name = req.body.name;
        var password = bcrypt.hashSync(req.body.password, salt);
        var email = req.body.email;
        var phoneNum = req.body.phonenum;
        var type = req.body.type;
        
        pool.query(sql_query.query.add_user, [name, phoneNum, email, uname, password, type], (err, data) => {
            if (err) {
                notifier.notify("Error: Cannot register this user. The user has alr existed!")
                console.error("Error in register")
                res.redirect('/register?reg=fail')
            } else {
                console.log("success")
                req.login({
                    username    : uname,
                    passwordHash: password,
                    name        : name,
                    email       : email,
                    phoneum     : phoneNum,
                    type        : type
                }, function(err) {
                    if (err) {
                        return res.redirect('/register?reg=fail');
                    } else {
                        if (req.user.type == "Diner") {
                            res.redirect('/')
                        }
                        if (req.user.type == "Owner") {
                            res.redirect('/my_restaurants')
                        }
                    }
                });

            }
        });
    });

    app.post('/login', passport.authenticate('local'), function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        if (req.user.type == "Diner") {
            res.redirect('/')
        }
        if (req.user.type == "Owner") {
            res.redirect('/my_restaurants')
        }
      });
}

module.exports = setUpAuthentication;