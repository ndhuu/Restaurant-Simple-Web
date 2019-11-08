var express = require('express');
var router = express.Router();
var sql_query = require('../db/index')

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

function getSampleLink(rname, address) {
  rname = encodeURI(encodeHashtag(rname));
  address = encodeURI(encodeHashtag(address));
  var sampleLink = {
    pending_page    : `/my_restaurants/reservation/pending:${rname}&:${address}`,
    confirmed_page  : `/my_restaurants/reservation/confirmed:${rname}&:${address}`,
    completed_page  : `/my_restaurants/reservation/completed:${rname}&:${address}`,
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
      console.error("Error in my owner reservation pending page");
      console.error(err);
      res.redirect('/my_restaurants')
    } else {
      for (let i = 0; i < data.rows.length; i++) {
        data.rows[i]["action"] = "/reservation/pending/accept"
      }
      res.render('my_rest_reservations/pending', { title: 'My Restaurants', data: data.rows, rname, address, sample_link: getSampleLink(rname, address) });
    }
  });
});

router.post('/pending/accept', function (req, res, next) {
  var rname = req.query.rname;
  var dname = req.query.dname;
  var address = req.query.address;
  var time = req.query.time;
  var date = req.query.date;

  console.log("Go to full my restaurant reservation page: pending")
  pool.query(sql_query.query.accept_reser, [dname, rname, address, time, date], (err, data) => {
    if (err) {
      console.error("Error in my owner reservation pending page");
      console.error(err);
    }
    res.redirect(`/my_restaurants/reservation/pending:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});


router.get('/confirmed:rname&:address', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)

  console.log("Go to full my restaurant reservation page: confirmed")
  pool.query(sql_query.query.view_restreser_confirmed, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in my owner reservation confirmed page");
      console.error(err)
      res.redirect('/my_restaurants')
    } else {
      for (let i = 0; i < data.rows.length; i++) {
        data.rows[i]["action"] = "/reservation/pending/complete"
      }
      res.render('my_rest_reservations/confirmed', { title: 'My Restaurants', data: data.rows, rname, address, sample_link: getSampleLink(rname, address) });
    }
  });
});

router.post('/confirmed/complete', function (req, res, next) {
  var rname = req.query.rname;
  var dname = req.query.dname;
  var address = req.query.address;
  var time = req.query.time;
  var date = req.query.date;

  console.log("Go to full my restaurant reservation page: pending")
  pool.query(sql_query.query.com_reser, [dname, rname, address, time, date], (err, data) => {
    if (err) {
      console.error("Error in my owner reservation confirmed page");
      console.error(err)
    }
    res.redirect(`/my_restaurants/reservation/confirmed:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});


router.get('/completed:rname&:address', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)

  console.log("Go to full my restaurant reservation page: completed")
  pool.query(sql_query.query.view_restreser_confirmed, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in my owner reservation completed page");
      console.error(err)
      res.redirect('/my_restaurants')
    } else {
      res.render('my_rest_reservations/completed', { title: 'My Restaurants', data: data.rows, rname, address, sample_link: getSampleLink(rname, address) });
    }
  });
});

module.exports = router;
