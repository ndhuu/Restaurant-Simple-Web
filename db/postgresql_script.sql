--tempo deletion to be removed at final product
DROP TABLE IF EXISTS location CASCADE;
DROP TABLE IF EXISTS promotion;
DROP TABLE IF EXISTS located CASCADE;
DROP TABLE IF EXISTS cuisine CASCADE;
DROP TABLE IF EXISTS fnb CASCADE;
DROP TABLE IF EXISTS favourites CASCADE;
DROP TABLE IF EXISTS owner_info CASCADE;
DROP TABLE IF EXISTS rewards CASCADE;
DROP TABLE IF EXISTS restaurant CASCADE;
DROP TABLE IF EXISTS diner_info CASCADE;
DROP TABLE IF EXISTS user_info CASCADE;
DROP TABLE IF EXISTS redemptions;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS student_info;

--user can be either owner,diner or both at this point of time
--add a type field to user_info,diner_info, owner_info
CREATE TABLE user_info (
	name    varchar(255) NOT NULL,
	phoneNum integer NOT NULL,
	email varchar(255) NOT NULL,
	uname varchar(255) PRIMARY KEY,
	password varchar(255) NOT NULL
);

CREATE TABLE owner_info (
	uname varchar(255) PRIMARY KEY REFERENCES user_info(uname)
);

CREATE TABLE restaurant (
	uname varchar(255) REFERENCES owner_info(uname) ON DELETE cascade,
    name varchar(255) PRIMARY KEY
);

CREATE TABLE promotion (
	name varchar(255) PRIMARY KEY,
	time time,
	discount integer,
	FOREIGN KEY (name) REFERENCES restaurant(name) ON DELETE cascade
);

CREATE TABLE location (
	area varchar(255) PRIMARY KEY
);

--openHour need change way of storing
CREATE TABLE located (
	area varchar(255) REFERENCES location(area),
	name varchar(255) REFERENCES restaurant(name),
	openHour varchar(255), 
	PRIMARY KEY(area,name)
);

CREATE TABLE cuisine (
	cname varchar(255) PRIMARY KEY
);

CREATE TABLE fnb (
	rname varchar(255) REFERENCES restaurant(name) ON DELETE cascade,
    fname varchar(255) PRIMARY KEY,
	price integer NOT NULL,
	cname varchar(255) REFERENCES cuisine(cname)
);

CREATE TABLE diner_info (
	uname varchar(255) PRIMARY KEY REFERENCES user_info(uname),
	points integer
);

CREATE TABLE rewards (
	rID integer PRIMARY KEY,
	points integer,
	duration integer
);

CREATE TABLE redemptions (
	dname varchar(255) REFERENCES diner_info(uname),
	rID integer REFERENCES rewards(rID),
	date date,
	time time,
	PRIMARY KEY (dname, rID)
);

CREATE TABLE favourites (
	dname varchar(255) REFERENCES diner_info(uname),
	rname varchar(255) REFERENCES restaurant(name),
	PRIMARY KEY (dname, rname)
);


--status needs to have check or type changed
CREATE TABLE reservations (
	dname varchar(255) REFERENCES diner_info(uname),
	rname varchar(255) REFERENCES restaurant(name),
	numPax integer,
	time time,
	date date,
	status varchar(255),
	rating integer,
	PRIMARY KEY (dname, rname, time, date)
);

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