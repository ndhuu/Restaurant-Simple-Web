var express = require('express');
var router = express.Router();
var sql_query = require('../db/index');
var notifier = require('node-notifier');

const post_err_mess = "Error: cannot make the edit. Check your input!"
const get_err_mess = "Error: Cannot go to this page, back to main page. Something went wrong!"
const get_success_mess = "Success!"

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

function getSampleLink(rname, address) {
  rname = encodeURI(encodeHashtag(rname));
  address = encodeURI(encodeHashtag(address));
  var sampleLink = {
    pending_page: `/my_restaurants/reservation/pending:${rname}&:${address}`,
    confirmed_page: `/my_restaurants/reservation/confirmed:${rname}&:${address}`,
    completed_page: `/my_restaurants/reservation/completed:${rname}&:${address}`,
    report: `/my_restaurants/reservation/report`
  }
  return sampleLink;
}

//libs
function encodeHashtag(str) {
  return str.replace("#", "hashtag");
}

function decodeHashtag(str) {
  return str.replace("hashtag", "#");
}

router.get('/', function (req, res, next) {
  console.log('in root router')
});


router.get('/pending:rname&:address', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)

  console.log("Go to full my restaurant reservation page: pending")
  pool.query(sql_query.query.view_restreser_pending, [rname, address], (err, data) => {
    if (err) {
      notifier.notify(get_err_mess)
      console.error("Error in my owner reservation pending page");
      console.error(err);
      res.redirect('/my_restaurants')
    } else {
      for (let i = 0; i < data.rows.length; i++) {
        data.rows[i]["action"] = "/reservation/pending/accept"
      }
      res.render('my_rest_reservations/pending', { title: 'My Restaurants', data: data.rows, rname: rname, address: address, sample_link: getSampleLink(rname, address) });
    }
  });
});

router.post('/pending/accept', function (req, res, next) {
  var rname = req.body.rname;
  var dname = req.body.dname;
  var address = req.body.address;
  var time = req.body.time;
  var date = req.body.date;

  console.log("Go to full my restaurant reservation page: pending")
  pool.query(sql_query.query.accept_reser, [dname, rname, address, time, date], (err, data) => {
    if (err) {
      notifier.notify(post_err_mess)
      console.error("Error in my owner reservation pending page");
      console.error(err);
    }

    notifier.notify(get_success_mess);
    res.redirect(`/my_restaurants/reservation/pending:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});


router.get('/confirmed:rname&:address', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)

  console.log("Go to full my restaurant reservation page: confirmed")
  pool.query(sql_query.query.view_restreser_confirmed, [rname, address], (err, data) => {
    if (err) {
      notifier.notify(get_err_mess)
      console.error("Error in my owner reservation confirmed page");
      console.error(err)
      res.redirect('/my_restaurants')
    } else {
      for (let i = 0; i < data.rows.length; i++) {
        data.rows[i]["action"] = "/reservation/confirmed/complete"
      }
      res.render('my_rest_reservations/confirmed', { title: 'My Restaurants', data: data.rows, rname: rname, address: address, sample_link: getSampleLink(rname, address) });
    }
  });
});

router.post('/confirmed/complete', function (req, res, next) {
  var rname = req.body.rname;
  var dname = req.body.dname;
  var address = req.body.address;
  var time = req.body.time;
  var date = req.body.date;

  console.log("Go to full my restaurant reservation page: pending")
  pool.query(sql_query.query.com_reser, [dname, rname, address, time, date], (err, data) => {
    if (err) {
      notifier.notify(post_err_mess)
      console.error("Error in my owner reservation confirmed page");
      console.error(err)
    }

    notifier.notify(get_success_mess);
    res.redirect(`/my_restaurants/reservation/confirmed:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});


router.get('/completed:rname&:address', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)

  console.log("Go to full my restaurant reservation page: completed")
  pool.query(sql_query.query.view_restreser_confirmed, [rname, address], (err, data) => {
    if (err) {
      notifier.notify(get_err_mess)
      console.error("Error in my owner reservation completed page");
      console.error(err)
      res.redirect('/my_restaurants')
    } else {
      res.render('my_rest_reservations/completed', { title: 'My Restaurants', data: data.rows, rname: rname, address: address, sample_link: getSampleLink(rname, address) });
    }
  });
});


router.get('/report:rname&:address&:year', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)
  var year = decodeURI(decodeHashtag(req.params.year)).substr(1)
  year = parseInt(year)


  console.log("Go to full my restaurant reservation page: completed")
  pool.query(sql_query.query.view_restreport, [rname, address, year], (err, data) => {
    if (err) {
      notifier.notify(get_err_mess)
      console.error("Error in my owner reservation completed page");
      console.error(err)
      res.redirect('/my_restaurants')
    } else {
      console.log(data.rows)

      res.render('my_rest_reservations/report', { title: 'My Restaurants', data: data.rows, rname: rname, address: address, sample_link: getSampleLink(rname, address) });
    }
  });
});

router.post('/report', function (req, res, next) {
  var rname = req.body.rname;
  var address = req.body.address;
  var year = (req.body.year);

  notifier.notify(get_success_mess);
  res.redirect(`/my_restaurants/reservation/report:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}&:${encodeURI(encodeHashtag(year))}`)

});

module.exports = router;
