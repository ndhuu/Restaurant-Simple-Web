--tempo deletion to be removed at final product
DROP TABLE IF EXISTS location CASCADE;
DROP TABLE IF EXISTS promotion;
DROP TABLE IF EXISTS located CASCADE;
DROP TABLE IF EXISTS restaurant;
DROP TABLE IF EXISTS owner_info;
DROP TABLE IF EXISTS diner_info;
DROP TABLE IF EXISTS user_info;
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
	time integer,
	discount integer,
	FOREIGN KEY (name) REFERENCES restaurant(name) ON DELETE cascade
);

CREATE TABLE location (
	area varchar(255) PRIMARY KEY
);

CREATE TABLE located (
	area varchar(255) REFERENCES location(area),
	name varchar(255) REFERENCES restaurant(name),
	openHour varchar(255) 
	PRIMARY KEY(area,name)
);

CREATE TABLE diner_info (
	uname varchar(255) PRIMARY KEY REFERENCES user_info(uname),
	points integer
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