--tempo deletion to be removed at final product
--DROP TABLE IF EXISTS Student_info;
DROP TABLE IF EXISTS Reservations 	CASCADE;
DROP TABLE IF EXISTS Favourites 	CASCADE;
DROP TABLE IF EXISTS Redemptions 	CASCADE;
DROP TABLE IF EXISTS Rest_Location 	CASCADE;
DROP TABLE IF EXISTS Rest_Cuisine 	CASCADE;
DROP TABLE IF EXISTS Owner_Rest 	CASCADE;
DROP TABLE IF EXISTS OpeningHours 	CASCADE;
DROP TABLE IF EXISTS Availability 	CASCADE;
DROP TABLE IF EXISTS Promotion 		CASCADE;
DROP TABLE IF EXISTS Fnb 			CASCADE;
DROP TABLE IF EXISTS Rewards 		CASCADE;
DROP TABLE IF EXISTS Locations 		CASCADE;
DROP TABLE IF EXISTS Cuisines 		CASCADE;
DROP TABLE IF EXISTS Restaurants 	CASCADE;
DROP TABLE IF EXISTS Diners 		CASCADE;
DROP TABLE IF EXISTS Workers 		CASCADE;
DROP TABLE IF EXISTS Owners 		CASCADE;
DROP TABLE IF EXISTS Company 		CASCADE;
DROP TABLE IF EXISTS Admin 			CASCADE;
DROP TABLE IF EXISTS Users 			CASCADE;

-- MySQL retrieves and displays DATE values in 'YYYY-MM-DD' format
-- MySQL retrieves and displays TIME values in 'hh:mm:ss' format 
CREATE TABLE Users(
	name		varchar(255) 	NOT NULL,
	phoneNum 	varchar(8) 		NOT NULL,
	email 		varchar(255) 	NOT NULL CHECK (email LIKE '%@%.%'),
	uname 		varchar(255) 	PRIMARY KEY,
	password	varchar(255) 	NOT NULL,
	type		varchar(255) 	NOT NULL CHECK (type in ('Worker','Owner','Diner'))
);

CREATE TABLE Admin (
	uname 		varchar(255) 	PRIMARY KEY,
	password	varchar(255) 	NOT NULL
);

CREATE TABLE Owners (
	uname 		varchar(255) 	PRIMARY KEY,
	FOREIGN KEY (uname) REFERENCES Users(uname) ON DELETE cascade
);

CREATE TABLE Workers (
	uname 		varchar(255) 	PRIMARY KEY,
	FOREIGN KEY (uname) REFERENCES Users(uname) ON DELETE cascade
);

CREATE TABLE Diners (
	uname 		varchar(255) 	PRIMARY KEY,
	points 		integer DEFAULT '0' NOT NULL,
	FOREIGN KEY (uname) REFERENCES Users(uname) ON DELETE cascade
);

CREATE TABLE Restaurants (
    rname 		varchar(255),
	address 	varchar(255),
	PRIMARY KEY (rname, address),
);

CREATE TABLE Cuisines(
	cname 		varchar(255) 	PRIMARY KEY
);

CREATE TABLE Locations (
	area 		varchar(255) 	PRIMARY KEY
);


CREATE TABLE Rewards (
	rewardsCode	integer 		PRIMARY KEY, --can be changed to varchar
	pointsReq 	integer 		NOT NULL,
	s_date 		date 			NOT NULL,
	e_date		date 			NOT NULL,
	amountSaved	integer
);

--Diner related
CREATE TABLE Redemptions (
	dname 		varchar(255) 	REFERENCES Diners(uname) ON DELETE CASCADE,
	rewardsCode integer 	DEFAULT '0' REFERENCES Rewards(rewardsCode) ON DELETE SET DEFAULT, 
    rname 		varchar(255) REFERENCES DEFAULT 'Rest' Restaurants (rname) ON DELETE SET DEFAULT,
	address 	varchar(255) REFERENCES DEFAULT 'address' Restaurants (address) ON DELETE SET DEFAULT, 
	date 		date, --history purpose
	time 		time, --history purpose
	PRIMARY KEY (dname, rewardsCode) --
);

--Weak Entity Sets
CREATE TABLE Fnb (
	rname 		varchar(255),
	address 	varchar(255),
    fname 		varchar(255),
	price 		numeric 		NOT NULL CHECK (price > 0),
	PRIMARY KEY (rname, address, fname),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade 
);

CREATE TABLE Promotion (
	rname 		varchar(255),
	address 	varchar(255),
	time 		time,
	discount 	numeric CHECK (discount > 0),
	PRIMARY KEY (rname, address, time, discount),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade
);


CREATE TABLE OpeningHours (
	rname 		varchar(255),
	address 	varchar(255),
	day 		varchar(255) CHECK (day in ('Mon','Tues','Wed','Thurs','Fri','Sat','Sun')),
	s_time 		time,
	hours 		integer 		NOT NULL CHECK (hours > 0),
	PRIMARY KEY(rname, address, day, s_time),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade
);

CREATE TABLE Availability (
	rname 		varchar(255),
	address 	varchar(255),
	date 		date,
	time		time,
	maxPax 		integer DEFAULT NULL CHECK (maxPax > 0),
	PRIMARY KEY(rname, address, date, time),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade
);


--Relation Set
--Restaurants related
CREATE TABLE Owner_Rest (
	rname 		varchar(255),
	address 	varchar(255),
	uname    	varchar(255),
	PRIMARY KEY (rname, address, uname),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade,
	FOREIGN KEY (uname) REFERENCES Owners(uname) ON DELETE cascade
);

CREATE TABLE Rest_Cuisine (
	rname 		varchar(255),
	address 	varchar(255),
	cname    	varchar(255),
	PRIMARY KEY (rname, address, cname),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade,
	FOREIGN KEY (cname) REFERENCES Cuisine(cname) ON DELETE cascade
);

CREATE TABLE Rest_Location (
	rname 		varchar(255),
	address 	varchar(255),
	area    	varchar(255),
	PRIMARY KEY (rname, address, area),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade
);

--Both related
CREATE TABLE Favourites (
	dname 		varchar(255) 	REFERENCES Diners(uname) ON DELETE cascade,
	rname 		varchar(255),
	address		varchar(255),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade,
	PRIMARY KEY (dname, rname)
);


CREATE TABLE Reservations (
	dname 		varchar(255) 	DEFAULT 'DEFAULT' REFERENCES Diners(uname) ON DELETE SET DEFAULT,
	rname 		varchar(255),
	address 	varchar(255),
	numPax 		integer			NOT NULL CHECK (numPax > 0),
	date 		date,		
	time 		time,
	status 		varchar(255)	DEFAULT 'Pending' NOT NULL CHECK (status in ('Pending','Confirmed','Completed')),
	rating 		integer DEFAULT NULL CHECK (rating >= 0 AND rating <= 5),
	PRIMARY KEY (dname, rname, address, date, time),
	FOREIGN KEY (rname, address, date, time) REFERENCES Availability(rname, address, date,time) ON DELETE cascade,
);


CREATE OR REPLACE FUNCTION t_func3() 
RETURNS TRIGGER AS $$ 
DECLARE oldPoints integer;
DECLARE codePoints integer;
BEGIN 
SELECT points into oldPoints from Diners where dname = NEW.dname;
SELECT pointsReq into codePoints from Rewards where rewardsCode = NEW.rewardsCode;
IF (oldPoints - codePoints < 0) THEN
RAISE NOTICE 'Trigger 3'; RETURN NULL; 
ELSE Update Diners SET points = (oldPoints - codePoints) WHERE dname = NEW.dname; 
END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig3
BEFORE INSERT ON Redemptions 
FOR EACH ROW
EXECUTE PROCEDURE t_func3();



