const sql = {}

sql.query = {
    
	// Adding new account
	add_user: 'INSERT INTO Users(name, phoneNum, email, uname, password, type) VALUES ($1,$2,$3,$4,$5,$6)',
	add_company: 'INSERT INTO Company uname) VALUES ($1)',
	add_owner: 'INSER INTO Owners(uname) VALUES ($1)',
	add_worker: 'INSERT INTO Workers(uname) VALUES ($1)',
	add_diner: 'INSERT INTO Diners(uname) VALUES ($1)',

	//Diners
	update_point: 'UPDATE Diners SET points =$2 WHERE uname=$1',
	view_point: 'SELECT points FROM Diners where uname =$1',
	
	//Login
	userpass: 'SELECT * FROM Users WHERE uname=$1',
	adminpass: 'SELECT * FROM Admin WHERE uname=$1',

	//Update user info
	update_info: 'UPDATE Users SET name=$2, email=$3 phoneNum=$4 WHERE uname=$1',
	update_pass: 'UPDATE Users SET password=$2 WHERE uname=$1',
	
	//Rewards
	add_reward: 'INSERT INTO Rewards(rewardsCode, pointsReq, s_date, e_date, details) VALUES ($1,$2,$3,$4,$5)',
	del_reward: 'DELEE FROM Rewards where rewardsCode = $1',
	view_reward: 'SELECT * FROM Rewards',
	view_curr_rewards: 'SELECT * FROM Rewards WHERE current_date between s_date and e_date',
	
	//Cuisines
	add_cui: 'INSERT INTO Cuisines(cname) VALUES ($1)',
	view_cui: 'SELECT * FROM Cuisines', 
	
	//Locations
	add_loc: 'INSERT INTO Locations(areas) VALUES ($1)',
	view_loc: 'SELECT * FROM Locations',
	
	//Restaurant
	view_allrest: 'SELECT * FROM Restaurants',
	view_rest: 'SELECT rname,address FROM Owner_Rest where owner = $1',
	add_rest: 'INSERT INTO Restaurants(rname, address) VALUES ($1,$2)',
	del_rest: 'DELETE FROM Restaurants WHERE rname = $1 AND address = $2',
	add_ownrest: 'INSERT INTO Owner_Rest(rname, owner, address) VALUES ($1,$2,$3)',
	add_restcui: 'INSERT INTO Rest_Cuisine(rname, address, cname) VALUES ($1,$2,$3)',
	add_restloc: 'INSERT INTO Rest_Location(rname, address, area) VALUES ($1,$2,$3)',
	view_restloc: 'SELECT rname, address FROM Rest_Location WHERE area LIKE $1',
	view_restcui: 'SELECT rname, address FROM Rest_Cuisine WHERE cname LIKE $1',
	search_rest: 'SELECT * FROM Restaurants WHERE lower(rname) LIKE $1',
	view_cuirest: 'SELECT cname FROM Rest_Cuisine WHERE rname LIKE $1 AND address LIKE $2',
	view_locrest: 'SELECT area FROM Rest_Location WHERE rname LIKE $1 AND address LIKE $2',
	view_cuilocrest: 'SELECT rname, address FROM Rest_Location WHERE area LIKE $1 INTERSECT SELECT rname, address FROM Rest_Cuisine WHERE cname LIKE $2',
	get_addr: 'SELECT address FROM Restaurants WHERE rname LIKE $1 AND address LIKE $2',
	
	//Favourites
	add_fav: 'INSERT INTO Favourites(dname, rname, address) VALUES ($1,$2,$3)',
	del_fav: 'DELETE FROM Favourites where rname = $1 AND address = $2 AND dname = $3',
	view_fav: 'SELECT * FROM Favourites where dname = $1', 
	
	//Redemptions
	add_red: 'INSERT INTO Redemptions(dname, rewardsCode, date, time) VALUES ($1,$2,$3,$4)',
	use_red: 'UPDATE Redemptions SET is_valid = FALSE WHERE dname = $1 AND rewardsCode = $2 AND s_date = $3',
	view_red: 'SELECT * FROM Redemptions WHERE dname = $1',
	
	//Fnb
	add_fnb: 'INSERT INTO Fnb(rname,address,fname,price) VALUES ($1,$2,$3,$4)',
	del_fnb: 'DELETE FROM Fnb WHERE rname = $1 AND address = $2 AND fname = $3',
	view_fnb: 'SELECT fname, price FROM Fnb WHERE rname LIKE $1 AND address LIKE $2', 
	
	//Promotion
	add_prom: 'INSERT INTO Promotion(rname,address,time,discount) VALUES ($1,$2,$3,$4)',
	del_prom: 'DELETE FROM Promotion WHERE rname = $1 AND address = $2',
	view_prom: 'SELECT * FROM Promotion where rname LIKE $1 AND address LIKE $2',
	
	//Opening Hours
	add_oh: 'INSERT INTO OpeningHours(rname, address, day, s_time, hours) VALUES ($1,$2,$3,$4,$5)',
	view_oh: 'SELECT * FROM OpeningHours WHERE rname LIKE $1 AND address LIKE $2',
	
	//Availability
	edit_av: 'UPDATE Availability SET maxPax = $1 WHERE rname = $2 AND address = $3 AND date = $4 AND s_time = $5',
	get_pax: 'SELECT max_pax FROM Availability WHERE rname = $1 AND address = $2 AND date = $3 AND s_time = $4',
	
	//Reservations
	add_reser: 'INSERT INTO Reservations(dname, rname, address, numpax, time, date) VALUES ($1,$2,$3,$4,$5,$6)',
	accept_reser: 'Update Reservations status = \'\'Confirmed\'\' WHERE dname = $1 AND rname = $2 AND address = $3 AND time = $4 AND date = $5',
	com_reser: 'Update Reservations status = \'\'Completed\'\' WHERE dname = $1 AND rname = $2 AND address = $3 AND time = $4 AND date = $5',
	view_dinereser: 'SELECT * FROM Reservations WHERE dname = $1',
	view_restreser: 'SELECT * FROM Reservations WHERE rname = $1 AND address = $2',
	
}

module.exports = sql