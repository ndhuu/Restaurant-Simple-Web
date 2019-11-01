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

CREATE TABLE Company (
	uname 		varchar(255) 	PRIMARY KEY,
	FOREIGN KEY (uname) REFERENCES Users(uname) ON DELETE cascade
);

CREATE TABLE Owners (
	uname 		varchar(255) 	PRIMARY KEY,
	FOREIGN KEY (uname) REFERENCES Company(uname) ON DELETE cascade
);

CREATE TABLE Workers (
	uname 		varchar(255) 	PRIMARY KEY,
	FOREIGN KEY (uname) REFERENCES Company(uname) ON DELETE cascade
);

CREATE TABLE Diners (
	uname 		varchar(255) 	PRIMARY KEY,
	points 		integer DEFAULT '0' NOT NULL,
	FOREIGN KEY (uname) REFERENCES Users(uname) ON DELETE cascade
);

CREATE TABLE Restaurants (
    rname 		varchar(255),
	address 	varchar(255),
	PRIMARY KEY (rname, address)
);

CREATE TABLE Cuisines(
	cname 		varchar(255) 	PRIMARY KEY
);

CREATE TABLE Locations (
	area 		varchar(255) 	PRIMARY KEY
);


CREATE TABLE Rewards (
	rewardsCode	integer 		PRIMARY KEY,
	pointsReq 	integer 		NOT NULL,
	s_date 		date 			NOT NULL,
	e_date		date 			NOT NULL,
	duration 	integer		DEFAULT '3' NOT NULL,
	details 	varchar(255)
);

--Diner related
CREATE TABLE Redemptions (
	dname 		varchar(255) 	REFERENCES Diners(uname) ON DELETE CASCADE,
	rewardsCode integer 	DEFAULT '0' REFERENCES Rewards(rewardsCode) ON DELETE SET DEFAULT,
	s_date 		date			NOT NULL,
	e_date		date			NOT NULL,
	time 		time			NOT NULL,
	is_valid	boolean			DEFAULT TRUE NOT NULL,
	PRIMARY KEY (dname, rewardsCode)
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
	s_time 		time,
	maxPax 		integer DEFAULT NULL CHECK (maxPax > 0),
	PRIMARY KEY(rname, address, date, s_time),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade
);


--Relation Set
--Restaurant related
CREATE TABLE Owner_Rest (
	rname 		varchar(255),
	address 	varchar(255),
	uname    	varchar(255),
	PRIMARY KEY (rname, uname),
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
	time 		time,
	date 		date,
	status 		varchar(255)	DEFAULT 'Pending' NOT NULL CHECK (status in ('Pending','Confirmed','Completed')),
	rating 		integer DEFAULT NULL,
	PRIMARY KEY (dname, rname, address, time, date),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade
);


CREATE OR REPLACE FUNCTION t_func1() 
RETURNS TRIGGER AS $$ BEGIN 
RAISE NOTICE 'Trigger 1'; RETURN NULL; 
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trig1 
BEFORE INSERT OR UPDATE ON Users 
FOR EACH ROW 
WHEN (NEW.uname = 'DEFAULT') 
EXECUTE PROCEDURE t_func1();

CREATE OR REPLACE FUNCTION t_func2() 
RETURNS TRIGGER AS $$ BEGIN 
RAISE NOTICE 'Trigger 2'; RETURN NULL; 
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trig2 
BEFORE INSERT OR UPDATE ON Rewards 
FOR EACH ROW 
WHEN (NEW.rewardsCode = 0) 
EXECUTE PROCEDURE t_func2();



/*
CREATE TABLE student_info (
	matric  varchar(9) PRIMARY KEY,
	name    varchar(255) NOT NULL,
	faculty varchar(3) NOT NULL
);

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000001A', 'Leslie Cole', 'SOC');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000002B', 'Myra Morgan', 'SOC');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000003C', 'Raymond Benson', 'SOC');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000004D', 'Wendy Kelley', 'SOC');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000005E', 'Patrick Bowers', 'FOE');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000006F', 'Ralph Hogan', 'FOE');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000007G', 'Cecil Rodriquez', 'SCI');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000008H', 'Delia Ferguson', 'SCI');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000009I', 'Frances Wright', 'SCI');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000010J', 'Alyssa Sims', 'SCI');
*/
