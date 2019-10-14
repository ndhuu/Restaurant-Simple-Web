--tempo deletion to be removed at final product
--DROP TABLE IF EXISTS Student_info;
DROP TABLE IF EXISTS Reservations 	CASCADE;
DROP TABLE IF EXISTS Favourites 	CASCADE;
DROP TABLE IF EXISTS Redemptions 	CASCADE;
DROP TABLE IF EXISTS Rest_Location 	CASCADE;
DROP TABLE IF EXISTS Rest_Cuisine 	CASCADE;
DROP TABLE IF EXISTS Owner_Rest 	CASCADE;
DROP TABLE IF EXISTS OpeningHours 	CASCADE;
DROP TABLE IF EXISTS Promotion 		CASCADE;
DROP TABLE IF EXISTS Fnb 			CASCADE;
DROP TABLE IF EXISTS Rewards 		CASCADE;
DROP TABLE IF EXISTS Locations 		CASCADE;
DROP TABLE IF EXISTS Cuisines 		CASCADE;
DROP TABLE IF EXISTS Restaurants 	CASCADE;
DROP TABLE IF EXISTS Diners 		CASCADE;
DROP TABLE IF EXISTS Owners 		CASCADE;
DROP TABLE IF EXISTS Users 			CASCADE;

--user can be either owner,diner or both at this point of time
--add a type field to users, diners, owners
--Normal Entity Sets
CREATE TABLE Users(
	name		varchar(255) 	NOT NULL,
	phoneNum 	integer 		NOT NULL,
	email 		varchar(255) 	NOT NULL,
	uname 		varchar(255) 	PRIMARY KEY,
	password	varchar(255) 	NOT NULL
);

CREATE TABLE Owners (
	uname 		varchar(255) 	PRIMARY KEY,
	FOREIGN KEY (uname) REFERENCES Users(uname) ON DELETE cascade
);

CREATE TABLE Diners (
	uname 		varchar(255) 	PRIMARY KEY,
	points 		integer,
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
	rID 		integer 		PRIMARY KEY,
	pointsReq 	integer 		NOT NULL,
	duration 	integer
);

--Weak Entity Sets
CREATE TABLE Fnb (
	rname 		varchar(255),
	address 	varchar(255),
    fname 		varchar(255),
	price 		integer 		NOT NULL,
	PRIMARY KEY (rname, address, fname),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade
);

CREATE TABLE Promotion (
	rname 		varchar(255),
	address 	varchar(255),
	time 		time,
	discount 	integer,
	PRIMARY KEY (rname, address, time, discount),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade
);

--need create check for day and time
--Is day sufficient or do we consider the s_time, how would be know the s_time then?
CREATE TABLE OpeningHours (
	rname 		varchar(255),
	address 	varchar(255),
	day 		varchar(255),
	s_time 		time 			NOT NULL,
	hours 		integer 		NOT NULL,
	PRIMARY KEY(rname, address, day, s_time),
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
	FOREIGN KEY (uname) REFERENCES Users(uname) ON DELETE cascade
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

--Diner related
CREATE TABLE Redemptions (
	dname 		varchar(255) 	REFERENCES Diners(uname),
	rID 		integer 		REFERENCES Rewards(rID),
	date 		date			NOT NULL,
	time 		time			NOT NULL,
	PRIMARY KEY (dname, rID)
);

--Both related
CREATE TABLE Favourites (
	dname 		varchar(255) 	REFERENCES Diners(uname),
	rname 		varchar(255),
	address		varchar(255),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade,
	PRIMARY KEY (dname, rname)
);

--status needs to have check or type changed
CREATE TABLE Reservations (
	dname 		varchar(255) 	REFERENCES Diners(uname),
	rname 		varchar(255),
	address 	varchar(255),
	numPax 		integer			NOT NULL,
	time 		time			NOT NULL,
	date 		date			NOT NULL,
	status 		varchar(255)	NOT NULL,
	rating 		integer,
	PRIMARY KEY (dname, rname, address, time, date),
	FOREIGN KEY (rname, address) REFERENCES Restaurants(rname, address) ON DELETE cascade
);
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