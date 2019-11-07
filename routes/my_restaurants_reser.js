var express = require('express');
var router = express.Router();
var sql_query = require('../db/index')

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

router.get('/', function (req, res, next) {
  console.log("Go to full my restaurant reservation page")
  pool.query(sql_query.query.view_rest, [req.user.username], (err, data) => {
    if (err) {
      console.error("Error in my restaurants");
      throw err;
    }
    //data = []
    //data.rows.push({rname: 'sample rname super long', address: 'sampleaddress'})
    for (let i = 0; i < data.rows.length; i++) {
      data.rows[i]["edit_link"] = "/my_restaurants/edit:" + encodeURI(data.rows[i].rname) + "&:" + encodeURI(data.rows[i].address);
      console.log(data.rows[i].edit_link)
    }
    res.render('my_restaurants', { title: 'My Restaurants', data: data.rows, sample_link: "/lalasample" });
  });
});