var express = require('express');
var router = express.Router();
const sql_query = require('../db/index');
const passport = require('passport');
const bcrypt = require('bcrypt')

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

    app.get('/logout', passport.authMiddleware(), function(req, res, next) {
        req.session.destroy()
        req.logout()
        res.redirect('/home')
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
                        if (req.user.type == "Worker") {
                            res.redirect('/some_dummy')
                        }
                        if (req.user.type == "Owner") {
                            res.redirect('/some_dummy')
                        }
                    }
                });

            }
        });
    });

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login?login=fail'
    }));
}

module.exports = setUpAuthentication;