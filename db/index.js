const sql = {}

sql.query = {
    
	// Adding new account
	add_user: 'INSERT INTO Users(name, phoneNum, email, uname, password, type) VALUES ($1,$2,$3,$4,$5,$6)',
	add_owner: 'INSER INTO Owners(uname) VALUES ($1)',
	add_worker: 'INSERT INTO Workers(uname) VALUES ($1)',
	add_diner: 'INSERT INTO Diners(uname) VALUES ($1)',

	//Login
	userpass: 'SELECT * FROM Users WHERE uname=$1 and uname <> \'\'DEFAULT\'\'',
	adminpass: 'SELECT * FROM Admin WHERE uname=$1',

	//Update user info
	update_info: 'UPDATE Users SET name=$2, email=$3 phoneNum=$3 WHERE uname=$1',
	update_pass: 'UPDATE Users SET password=$2 WHERE uname=$1',
	
	//Delete user
	del_user: 'DELETE FROM Users WHERE uname = $1',

	//Diners
	update_point: 'UPDATE Diners SET points =$2 WHERE uname=$1',
	view_point: 'SELECT points FROM Diners where uname =$1',
	
	//Rewards
	add_reward: 'INSERT INTO Rewards(rewardsCode, pointsReq, s_date, e_date, amountSaved) VALUES ($1,$2,$3,$4,$5)',
	del_reward: 'DELEE FROM Rewards where rewardsCode = $1',
	view_reward: 'SELECT * FROM Rewards WHERE rewardsCode <> \'\'0\'\' ',
	view_rewarddate: 'SELECT * FROM Rewards where s_date <= $1 AND e_date >= $1 AND rewardsCode <> \'\'0\'\' ',
	
	//Cuisines
	add_cui: 'INSERT INTO Cuisines(cname) VALUES ($1)',
	view_cui: 'SELECT * FROM Cuisines',
	
	//Locations
	add_loc: 'INSERT INTO Locations(areas) VALUES ($1)',
	view_loc: 'SELECT * FROM Locations',
	
	//Restaurants
	view_allrest: 'SELECT * FROM Restaurants WHERE rname <> \'\'Rest\'\'  AND address <> \'\'address\'\'  ',
	view_restname: 'SELECT * FROM Restaurants where rname LIKE \'$1%\' AND rname <> \'\'Rest\'\'  AND address <> \'\'address\'\' ',
	view_rest: 'SELECT rname,address FROM Owner_Rest where owner = $1',
	add_rest: 'INSERT INTO Restaurants(rname, address) VALUES ($1,$2)',
	del_rest: 'DELETE FROM Restaurants WHERE rname = $1 AND address = $2',
	view_rest_specific_name: 'SELECT r.rname, r.address, l.area FROM Restaurants r LEFT JOIN Rest_Location l ON r.rname = l.rname AND r.address = l.address WHERE r.rname = $1 AND r.address = $2',
	edit_rest_sepecific_name: 'UPDATE Restaurants SET rname = $1, address = $2 WHERE rname = $3 AND address = $4',	
	add_ownrest: 'INSERT INTO Owner_Rest(rname, uname, address) VALUES ($1,$2,$3)',
	add_restcui: 'INSERT INTO Rest_Cuisine(rname, address, cname) VALUES ($1,$2,$3)',
	add_restloc: 'INSERT INTO Rest_Location(rname, address, area) VALUES ($1,$2,$3)',

	view_restbyloc: 'SELECT rname, address FROM Rest_Location WHERE area = $1',
	view_restbycui: 'SELECT rname, address FROM Rest_Cuisine WHERE cname = $1',
	view_restloc: 'SELECT area FROM Rest_Location WHERE dname = $1 AND address = $2',
	view_restcui: 'SELECT cname FROM Rest_Cuisine WHERE dname = $1 AND address = $2',
	edit_restloc:'UPDATE Rest_Location SET area =$1 WHERE rname = $2 AND address = $3',
	
	//Favourites
	add_fav: 'INSERT INTO Favourites(dname, rname, address) VALUES ($1,$2,$3)',
	del_fav: 'DELETE FROM Favourites where rname = $1 AND address = $2 AND dname = $3',
	view_fav: 'SELECT * FROM Favourites where dname = $1',
	
	//Redemptions
	add_red: 'INSERT INTO Redemptions(dname, rewardsCode, date, time) VALUES ($1,$2,$3,$4)',
	view_red: 'SELECT * FROM Redemptions WHERE dname = $1',
	
	//Fnb
	add_fnb: 'INSERT INTO Fnb(rname,address,fname,price) VALUES ($1,$2,$3,$4)',
	del_fnb: 'DELETE FROM Fnb WHERE rname = $1 AND address = $2 AND fname = $3',
	view_fnb: 'SELECT rname, address, fname, price FROM Fnb WHERE rname = $1 AND address = $2', 
	
	//Promotion
	add_prom: 'INSERT INTO Promotion(rname,address,fname,discount) VALUES ($1,$2,$3,$4)',
	del_prom: 'DELETE FROM Promotion WHERE rname = $1 AND address = $2 AND fname = $3 and discount = $4',
	view_prom: 'SELECT * FROM Promotion where rname = $1 AND address = $2',
	view_restprom: 'SELECT fname,price FROM Promotion WHERE dname = $1 AND address = $2',
	
	//Opening Hours
	add_oh: 'INSERT INTO OpeningHours(rname, address, day, s_time, hours) VALUES ($1,$2,$3,$4,$5)',
	view_restoh: 'SELECT day,s_time, hours FROM OpeningHours WHERE dname = $1 AND address = $2',
	view_restbyoh: 'SELECT rname, address FROM OpeningHours WHERE day = $1 AND s_time = $2', //filter by day and start time
	add_oh: 'INSERT INTO OpeningHours(rname, address, day, s_time, hours) VALUES ($1,$2,$3,$4,$5)',
	del_oh: 'DELETE FROM OpeningHours WHERE rname = $1 AND address = $2 AND day = $3 AND s_time = $4',
	
	//Availability
	add_av: 'INSERT INTO Availability(rname, address, date, time, maxPax) VALUES ($1,$2,$3,$4,$5)',
	edit_av: 'UPDATE Availability SET maxPax = $1 WHERE rname = $2 AND address = $3 AND date = $4 AND s_time = $5',
	get_pax: 'SELECT max_pax FROM Availability WHERE rname = $1 AND address = $2 AND date = $3 AND s_time = $4',
	
	//Reservations
	add_reser: 'INSERT INTO Reservations(dname, rname, address, maxPax, time, date) VALUES ($1,$2,$3,$4,$5,$6)',
	accept_reser: 'Update Reservations status = \'\'Confirmed\'\' WHERE dname = $1 AND rname = $2 AND address = $3 AND time = $4 AND date = $5',
	com_reser: 'Update Reservations status = \'\'Completed\'\' WHERE dname = $1 AND rname = $2 AND address = $3 AND time = $4 AND date = $5',
	view_dinereser: 'SELECT * FROM Reservations WHERE dname = $1',
	view_restreser: 'SELECT * FROM Reservations WHERE rname = $1 AND address = $2',
	give_rate: 'UPDATE Reservations rating = $1 WHERE dname = $1 AND rname = $2 AND address = $3 AND time = $4 AND date = $5',
	
	//Aggregate
	view_moneysaved: 'SELECT SUM(amountSaved) FROM Redemptions WHERE dname = $1 AND address = $2 ANDs_date = $3 AND e_date = $4 AND is_valid = FALSE',
	view_restaverate: 'SELECT AVG(rating) FROM Reservations WHERE rname = $1 AND address = $2 AND rating != NULL',
	
	//Complex, need 2 CTE
	view_poprestloc: 'WITH X AS (SELECT area, COUNT(area) AS count FROM Reservations R, Rest_Location L WHERE R.status = \'\'Completed\'\' AND R.dname = $1 AND R.rname = L.rname AND R.address = L.address GROUP BY area ORDER BY COUNT DESC LIMIT 1), Y AS (SELECT rname, address FROM Reservations GROUP BY rname, address HAVING MAX(rating)>=3) SELECT DISTINCT Y.rname, Y.address, X.area FROM Y NATURAL JOIN Rest_Location L INNER JOIN X ON L.area= X.area',
	view_restreport: 'WITH X AS (SELECT rname, address, EXTRACT(MONTH FROM (date)) AS month, COUNT(*) AS count FROM Reservations R WHERE R.rname=$1 AND R.address=$2 AND EXTRACT(YEAR FROM (date))=$3 GROUP BY rname, address, EXTRACT(MONTH FROM (date))), Y AS (SELECT rname, address, EXTRACT(MONTH FROM (date)) AS month, CAST(AVG(rating) AS DECIMAL(10,2)) AS rating FROM Reservations R WHERE R.rname=$1 AND R.address=$2 AND EXTRACT(YEAR FROM (date))=$3 GROUP BY rname, address, EXTRACT(MONTH FROM (date))) SELECT * FROM X NATURAL JOIN Y',
	view_recrest: 'WITH X AS (SELECT numPax, COUNT(numPax) as freq FROM Reservations R WHERE R.dname = $1 AND R.status = \'\'Completed\'\' GROUP BY R.numPax ORDER BY freq DESC LIMIT 1), Y AS (SELECT R1.rname,R1.address FROM X JOIN (SELECT rname, address, AVG(numPax) as numPax FROM Reservations R1 GROUP BY rname,address) AS R1 ON X.numPax = R1.numPax), Z AS (SELECT cname FROM (SELECT C.cname FROM Reservations R, Rest_Cuisine C WHERE dname = $1 AND status = \'\'Completed\'\') AS C GROUP BY cname ORDER BY COUNT(cname) DESC LIMIT 3) SELECT Y.rname, Y.address FROM Z NATURAL JOIN Rest_Cuisine JOIN Y ON Rest_Cuisine.rname = Y.rname AND Rest_Cuisine.address = Y.address',
	view_recrest:'WITH X AS (SELECT numPax, COUNT(numPax) as freq FROM Reservations R WHERE R.dname = $1 AND R.status = \'\'Completed\'\' GROUP BY R.numPax ORDER BY freq DESC LIMIT 1), Y AS (SELECT rname,address,numpax,COUNT(*) AS Freq FROM Reservations GROUP BY rname,address,numpax ORDER BY Freq), Z AS (SELECT y1.rname,y1.address,y1.numPax FROM Y y1 WHERE y1.Freq >= ALL (SELECT y2.Freq FROM Y y2 WHERE y2.rname=y1.rname AND y2.address=y1.address)) SELECT DISTINCT Z.rname, Z.address FROM X JOIN Z on X.numPax = Z.numPax; SELECT * FROM test',
	//owners
	view_owner_to_rest: 'SELECT uname FROM Owner_Rest where rname = $1 AND address = $2',
	add_owner_to_rest: 'INSERT INTO Owner_Rest (rname, address, uname) values ($1, $2, $3)',
	del_owner_to_rest: 'DELETE FROM Owner_Rest WHERE rname = $1 AND address = $2 AND uname = $3',
	check_owner: 'SELECT uname FROM Owners WHERE uname = $1'
}

module.exports = sql