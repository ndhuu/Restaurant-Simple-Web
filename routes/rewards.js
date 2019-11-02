var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});


/* SQL Query */
/* add condition where reward not redeemed by user */
var sql_query = 'SELECT rewardscode, details, pointsreq, s_date, e_date, duration FROM Rewards WHERE current_date between s_date and e_date';

router.get('/', function(req, res, next) {
	pool.query(sql_query, (err, data) => {
		res.render('select', { title: 'Rewards', data: data.rows });
	});
});

module.exports = router;
