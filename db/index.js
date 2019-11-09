const sql = {}

sql.query = {
    
	// Adding new account
	add_user: 'INSERT INTO Users(name, phoneNum, email, uname, password, type) VALUES ($1,$2,$3,$4,$5,$6)',
	add_owner: 'INSER INTO Owners(uname) VALUES ($1)',
	add_worker: 'INSERT INTO Workers(uname) VALUES ($1)',
	add_diner: 'INSERT INTO Diners(uname) VALUES ($1)',

	//Login
	userpass: 'SELECT * FROM Users WHERE uname=$1 and uname <> \'default\'',

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
	view_reward: 'SELECT rewardsCode, pointsReq, CAST(s_date AS VARCHAR), CAST(e_date AS VARCHAR), amountSaved FROM Rewards WHERE rewardsCode <> \'0\' ',
	view_rewarddate: 'SELECT rewardsCode, pointsReq, CAST(s_date AS VARCHAR), CAST(e_date AS VARCHAR), amountSaved FROM Rewards WHERE s_date <= $1 AND e_date >= $1 AND rewardsCode <> \'0\' ',
	view_curr_rewards: 'SELECT * FROM Rewards WHERE current_date between s_date and e_date',
	view_notred: 'SELECT rewardsCode, pointsReq, CAST(s_date AS VARCHAR), CAST(e_date AS VARCHAR), amountSaved from Rewards WHERE rewardsCode NOT IN (SELECT rewardsCode from Redemptions where dname = $1) AND current_date between s_date and e_date',
	
	//Cuisines
	add_cui: 'INSERT INTO Cuisines(cname) VALUES ($1)',
	view_cui: 'SELECT * FROM Cuisines',
	
	//Locations
	add_loc: 'INSERT INTO Locations(areas) VALUES ($1)',
	view_loc: 'SELECT * FROM Locations',
	
	//Restaurants
	view_allrest: 'SELECT * FROM Restaurants WHERE rname <> \'rest\'  AND address <> \'address\'  ',
	view_restname: 'SELECT * FROM Restaurants where rname LIKE \'$1%\' AND rname <> \'rest\'  AND address <> \'address\' ',
	view_rest: 'SELECT rname,address FROM Owner_Rest where uname = $1',
	add_rest: 'INSERT INTO Restaurants(rname, address) VALUES ($1,$2)',
	del_rest: 'DELETE FROM Restaurants WHERE rname = $1 AND address = $2',
	view_rest_specific_name: 'SELECT r.rname, r.address, l.area FROM Restaurants r LEFT JOIN Rest_Location l ON r.rname = l.rname AND r.address = l.address WHERE r.rname = $1 AND r.address = $2',
	edit_rest_sepecific_name: 'UPDATE Restaurants SET rname = $1, address = $2 WHERE rname = $3 AND address = $4',	
	add_ownrest: 'INSERT INTO Owner_Rest(rname, uname, address) VALUES ($1,$2,$3)',
	add_restcui: 'INSERT INTO Rest_Cuisine(rname, address, cname) VALUES ($1,$2,$3)',
	add_restloc: 'INSERT INTO Rest_Location(rname, address, area) VALUES ($1,$2,$3)',
	view_cuilocrest: 'SELECT rname, address FROM Rest_Location WHERE area LIKE $1 INTERSECT SELECT rname, address FROM Rest_Cuisine WHERE cname LIKE $2',
	view_cuirest: 'SELECT cname FROM Rest_Cuisine WHERE rname LIKE $1 AND address LIKE $2',
	view_locrest: 'SELECT area, address FROM Rest_Location WHERE rname LIKE $1 AND address LIKE $2',
	search_rest: 'SELECT * FROM Restaurants WHERE lower(rname) LIKE lower($1)',

	view_restbyloc: 'SELECT rname, address FROM Rest_Location WHERE area = $1',
	view_restbycui: 'SELECT rname, address FROM Rest_Cuisine WHERE cname = $1',
	view_restloc: 'SELECT area FROM Rest_Location WHERE dname = $1 AND address = $2',
	view_restcui: 'SELECT cname FROM Rest_Cuisine WHERE rname = $1 AND address = $2',
	edit_restloc:'UPDATE Rest_Location SET area =$1 WHERE rname = $2 AND address = $3',

	del_restcui: 'DELETE FROM Rest_Cuisine WHERE rname = $1 AND address = $2 AND cname = $3',
	
	//Favourites
	add_fav: 'INSERT INTO Favourites(dname, rname, address) VALUES ($1,$2,$3)',
	del_fav: 'DELETE FROM Favourites where rname = $1 AND address = $2 AND dname = $3',
	view_fav: 'SELECT * FROM Favourites where dname = $1',
	check_fav: 'SELECT * FROM Favourites where dname = $1 AND rname = $2 AND address LIKE $3',
	
	//Redemptions
	add_red: 'INSERT INTO Redemptions(dname, rewardsCode, rname, address, date, time) VALUES ($1,$2,$3,$4, $5, $6)',
  update_red: 'UPDATE Redemptions SET rname = $1 AND address = $2 WHERE dname = $3 AND rewardsCode = $4',
	view_red: 'SELECT dname, rewardsCode, rname, address, CAST(date AS VARCHAR), time FROM Redemptions WHERE dname = $1',
	view_red_notused: 'SELECT dname, rewardsCode, rname, address, CAST(date AS VARCHAR), time FROM Redemptions WHERE dname = $1 AND rname = \'Rest\'  AND address = \'address\'',
	view_red_used: 'SELECT dname, rewardsCode, rname, address, CAST(date AS VARCHAR), time FROM Redemptions WHERE dname = $1 AND rname <> \'Rest\'  AND address <> \'address\'',
	
	//Fnb
	add_fnb: 'INSERT INTO Fnb(rname,address,fname,price) VALUES ($1,$2,$3,$4)',
	del_fnb: 'DELETE FROM Fnb WHERE rname = $1 AND address = $2 AND fname = $3',
	view_fnb: 'SELECT rname, address, fname, price FROM Fnb WHERE rname = $1 AND address = $2', 
	
	//Promotion
	add_prom: 'INSERT INTO Promotion(rname,address,time,discount) VALUES ($1,$2,$3,$4)',
	del_prom: 'DELETE FROM Promotion WHERE rname = $1 AND address = $2 AND fname = $3 and discount = $4',
	view_prom: 'SELECT * FROM Promotion where rname = $1 AND address = $2',
	view_restprom: 'SELECT fname,discount FROM Promotion WHERE rname = $1 AND address = $2',
	
	//Opening Hours
	add_oh: 'INSERT INTO OpeningHours(rname, address, day, s_time, hours) VALUES ($1,$2,$3,$4,$5)',
	view_restoh: 'SELECT day,s_time, hours FROM OpeningHours WHERE rname = $1 AND address = $2' +
	' GROUP BY day,s_time,hours'  +  
	' ORDER BY CASE WHEN day = \'Sun\' THEN 1' + 
	' WHEN day = \'Mon\' THEN 2'+
	' WHEN day = \'Tues\' THEN 3'+
	' WHEN day = \'Wed\' THEN 4'+
	' WHEN day = \'Thurs\' THEN 5' +
	' WHEN day = \'Fri\' THEN 6'+
	' WHEN day = \'Sat\' THEN 7'+
	' END ASC, EXTRACT(HOUR from (s_time)), EXTRACT(MINUTE from (s_time)) DESC',
	view_restbyoh: 'SELECT rname, address FROM OpeningHours WHERE day = $1 AND s_time = $2', //filter by day and start time
	add_oh: 'INSERT INTO OpeningHours(rname, address, day, s_time, hours) VALUES ($1,$2,$3,$4,$5)',
	del_oh: 'DELETE FROM OpeningHours WHERE rname = $1 AND address = $2 AND day = $3 AND s_time = $4',
	view_ohtime: 'SELECT rname, address, day, s_time, (s_time + make_interval(0,0,0,0,hours)) AS e_time FROM OpeningHours WHERE rname LIKE $1 AND address LIKE $2',
	
	//Availability

	add_av: 'INSERT INTO Availability(rname, address, date, time, maxPax) VALUES ($1,$2,$3,$4,$5)',
	edit_av: 'UPDATE Availability SET maxPax = $1 WHERE rname = $2 AND address = $3 AND date = $4 AND time = $5',
	del_av: 'DELETE FROM Availability WHERE rname = $1 AND address = $2 AND date = $3 AND time = $4',
	get_pax: 'SELECT max_pax FROM Availability WHERE rname = $1 AND address = $2 AND date = $3 AND time = $4',
	view_av: 'SELECT time, maxPax, CAST(date AS VARCHAR) FROM Availability WHERE rname = $1 AND address = $2' +
	' GROUP BY maxpax, time,date'  +
	' ORDER BY EXTRACT(YEAR from (date)) DESC, EXTRACT(MONTH from (date)) DESC, EXTRACT(DAY FROM (date)) DESC,'+
	' EXTRACT(HOUR FROM(time)), EXTRACT(MINUTE FROM (time))',
	view_avdate: 'SELECT DISTINCT CAST(date AS VARCHAR) FROM Availability WHERE rname = $1 AND address = $2',
	view_avtime: 'SELECT DISTINCT time FROM Availability WHERE rname = $1 AND address = $2',
  
	//Reservations
	add_reser: 'INSERT INTO Reservations(dname, rname, address, numpax, time, date) VALUES ($1,$2,$3,$4,$5,$6)',
	accept_reser: 'Update Reservations status = \'Confirmed\' WHERE dname = $1 AND rname = $2 AND address = $3 AND time = $4 AND date = $5',
	com_reser: 'Update Reservations status = \'Completed\' WHERE dname = $1 AND rname = $2 AND address = $3 AND time = $4 AND date = $5',
	view_dinereser: 'SELECT dname,rname,address,numPax,CAST(date AS VARCHAR), time, status, rating FROM Reservations WHERE dname = $1',
	view_restreser: 'SELECT dname,rname,address,numPax,CAST(date AS VARCHAR), time, status, rating FROM Reservations WHERE rname = $1 AND address = $2',
  view_restreser_pending: 'SELECT * FROM Reservations WHERE rname = $1 AND address = $2 AND status = \'Pending\'',
	view_restreser_confirmed: 'SELECT * FROM Reservations WHERE rname = $1 AND address = $2 AND status = \'Confirmed\'',
	view_restreser_completed: 'SELECT * FROM Reservations WHERE rname = $1 AND address = $2 AND status = \'Completed\'',
	give_rate: 'UPDATE Reservations rating = $1 WHERE dname = $2 AND rname = $3 AND address = $4 AND time = $5 AND date = $6', 
	del_reser: 'DELETE FROM Reservations WHERE rname = $1 AND address = $2 AND date = $3 AND time = $4 AND dname = $5',
	
	//Aggregate
	view_moneysaved: 'SELECT SUM(amountSaved) FROM Redemptions NATURAL JOIN Rewards WHERE dname = $1',
	view_restaverate: 'SELECT AVG(rating) FROM Reservations WHERE rname = $1 AND address = $2',
	
	//Complex, need 2 CTE
	view_poprestloc: 'WITH X AS (SELECT area, COUNT(area) AS count FROM Reservations R, Rest_Location L WHERE R.status = \'Completed\' AND R.dname = $1 AND R.rname = L.rname AND R.address = L.address GROUP BY area ORDER BY COUNT DESC LIMIT 1),' +
	' Y AS (SELECT rname, address FROM Reservations GROUP BY rname, address HAVING MAX(rating)>=3) SELECT DISTINCT Y.rname, Y.address, X.area FROM Y NATURAL JOIN Rest_Location L INNER JOIN X ON L.area= X.area',
	view_restreport: 'WITH X AS (SELECT rname, address, EXTRACT(MONTH FROM (date)) AS month, COUNT(*) AS count FROM Reservations R WHERE R.rname=$1 AND R.address=$2 AND EXTRACT(YEAR FROM (date))=$3 GROUP BY rname, address, EXTRACT(MONTH FROM (date))),' +
	' Y AS (SELECT rname, address, EXTRACT(MONTH FROM (date)) AS month, CAST(AVG(rating) AS DECIMAL(10,2)) AS rating FROM Reservations R WHERE R.rname=$1 AND R.address=$2 AND EXTRACT(YEAR FROM (date))=$3 GROUP BY rname, address, EXTRACT(MONTH FROM (date))) SELECT * FROM X NATURAL JOIN Y',
	view_recrest:'WITH X AS (SELECT numPax, COUNT(numPax) as freq FROM Reservations R WHERE R.dname = $1 AND R.status = \'Completed\' GROUP BY R.numPax ORDER BY freq DESC LIMIT 1),' +
	' Y AS (SELECT rname,address,numpax,COUNT(*) AS Freq FROM Reservations GROUP BY rname,address,numpax ORDER BY Freq),' +
	' Z AS (SELECT y1.rname,y1.address,y1.numPax FROM Y y1 WHERE y1.Freq >= ALL (SELECT y2.Freq FROM Y y2 WHERE y2.rname=y1.rname AND y2.address=y1.address)) SELECT DISTINCT Z.rname, Z.address FROM X JOIN Z on X.numPax = Z.numPax;',
	
	//all restaurants except pop restaurants
	view_poprestloc1: 'WITH X AS (SELECT area, COUNT(area) AS count FROM Reservations R, Rest_Location L WHERE R.status = \'Completed\' AND R.dname = $1 AND R.rname = L.rname AND R.address = L.address GROUP BY area ORDER BY COUNT DESC LIMIT 1), ' +
	'Y AS (SELECT rname, address FROM Reservations GROUP BY rname, address HAVING MAX(rating)>=3) SELECT RS.rname, RS.address, LO.area FROM Restaurants RS, Rest_Location LO WHERE RS.rname <> \'Rest\'  AND RS.address <> \'address\' AND ' +
	'RS.rname = LO.rname AND RS.address = LO.address EXCEPT SELECT DISTINCT Y.rname, Y.address, X.area FROM Y NATURAL JOIN Rest_Location L INNER JOIN X ON L.area= X.area',
	//$1 user $2 rname
	view_poprestloc2: 'WITH X AS (SELECT area, COUNT(area) AS count FROM Reservations R, Rest_Location L WHERE R.status = \'Completed\' AND R.dname = $1 AND R.rname = L.rname AND R.address = L.address GROUP BY area ORDER BY COUNT DESC LIMIT 1),' +
	'Y AS (SELECT rname, address FROM Reservations GROUP BY rname, address HAVING MAX(rating)>=3) SELECT RS.rname, RS.address, LO.area FROM Restaurants RS, Rest_Location LO WHERE lower(RS.rname) LIKE $2 AND RS.rname = LO.rname AND RS.address = LO.address ' +
	'EXCEPT SELECT DISTINCT Y.rname, Y.address, X.area FROM Y NATURAL JOIN Rest_Location L INNER JOIN X ON L.area= X.area',
	//$1 user $2 area $3 cuisine
	view_poprestloc3: 'WITH X AS (SELECT area, COUNT(area) AS count FROM Reservations R, Rest_Location L WHERE R.status = \'Completed\' AND R.dname = $1 AND R.rname = L.rname AND R.address = L.address GROUP BY area ORDER BY COUNT DESC LIMIT 1),' +
	'Y AS (SELECT rname, address FROM Reservations GROUP BY rname, address HAVING MAX(rating)>=3) SELECT rname, address FROM Rest_Location WHERE area LIKE $2 INTERSECT SELECT rname, address FROM Rest_Cuisine WHERE cname LIKE $3 ' + 
	'EXCEPT SELECT DISTINCT Y.rname, Y.address FROM Y NATURAL JOIN Rest_Location L INNER JOIN X ON L.area= X.area',
	
	//Except using view_poprestloc
	//all restaurants except pop restaurants
	view_poprestloc1: 'WITH X AS (SELECT area, COUNT(area) AS count FROM Reservations R, Rest_Location L WHERE R.status = \'Completed\' AND R.dname = $1 AND R.rname = L.rname AND R.address = L.address GROUP BY area ORDER BY COUNT DESC LIMIT 1), ' +
	'Y AS (SELECT rname, address FROM Reservations GROUP BY rname, address HAVING MAX(rating)>=3) SELECT RS.rname, RS.address, LO.area FROM Restaurants RS, Rest_Location LO WHERE RS.rname <> \'Rest\'  AND RS.address <> \'address\' AND ' +
	'RS.rname = LO.rname AND RS.address = LO.address EXCEPT SELECT DISTINCT Y.rname, Y.address, X.area FROM Y NATURAL JOIN Rest_Location L INNER JOIN X ON L.area= X.area',
	//$1 user $2 rname
	view_poprestloc2: 'WITH X AS (SELECT area, COUNT(area) AS count FROM Reservations R, Rest_Location L WHERE R.status = \'Completed\' AND R.dname = $1 AND R.rname = L.rname AND R.address = L.address GROUP BY area ORDER BY COUNT DESC LIMIT 1),' +
	'Y AS (SELECT rname, address FROM Reservations GROUP BY rname, address HAVING MAX(rating)>=3) SELECT RS.rname, RS.address, LO.area FROM Restaurants RS, Rest_Location LO WHERE lower(RS.rname) LIKE lower($2) AND RS.rname = LO.rname AND RS.address = LO.address ' +
	'EXCEPT SELECT DISTINCT Y.rname, Y.address, X.area FROM Y NATURAL JOIN Rest_Location L INNER JOIN X ON L.area= X.area',
	//$1 user $2 area $3 cuisine
	view_poprestloc3: 'WITH X AS (SELECT area, COUNT(area) AS count FROM Reservations R, Rest_Location L WHERE R.status = \'Completed\' AND R.dname = $1 AND R.rname = L.rname AND R.address = L.address GROUP BY area ORDER BY COUNT DESC LIMIT 1),' +
	'Y AS (SELECT rname, address FROM Reservations GROUP BY rname, address HAVING MAX(rating)>=3) SELECT rname, address FROM Rest_Location WHERE area LIKE $2 INTERSECT SELECT rname, address FROM Rest_Cuisine WHERE cname LIKE $3 ' + 
	'EXCEPT SELECT DISTINCT Y.rname, Y.address FROM Y NATURAL JOIN Rest_Location L INNER JOIN X ON L.area= X.area',
	

	//owners
	view_owner_to_rest: 'SELECT uname FROM Owner_Rest where rname = $1 AND address = $2',
	add_owner_to_rest: 'INSERT INTO Owner_Rest (rname, address, uname) values ($1, $2, $3)',
	del_owner_to_rest: 'DELETE FROM Owner_Rest WHERE rname = $1 AND address = $2 AND uname = $3',
	check_owner: 'SELECT uname FROM Owners WHERE uname = $1'
}

module.exports = sql
