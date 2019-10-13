var express = require('express');
var router = express.Router();
const sql_query = require('../db/index');
const passport = require('passport');
const bcrypt = require('bcrypt')



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

    app.post('/register', passport.antiMiddleware(), function(req, res, next) {
        // Retrieve Information
        var uname = req.body.uname;
        var name = req.body.name;
        var password = bcrypt.hashSync(req.body.password, salt);
        var email = req.body.email;
        var phoneNum = req.body.phoneNum;
        var accountType = req.body.accountType;

        pool.query(sql_query.query.register, [uname, name, password, email, phoneNum, accountType], (err, data) => {
            if (err) {
                console.error("Error in register")
                res.redirect('/register?reg=fail')
            } else {
                req.login({
                    uname: uname,
                    passwordHash: password,
                    name: name,
                    email: email,
                    phoneNum: phoneNum,
                    accountType: accountType
                }, function(err) {
                    if (err) {
                        return res.redirect('/register?reg=fail');
                    } else {
                        return res.redirect('/home');
                    }
                });

            }
        });
    });

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login?login=fail'
    }));
}

module.exports = setUpAuthentication;