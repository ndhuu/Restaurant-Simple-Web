--tempo deletion to be removed at final product
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
	PRIMARY KEY (rname, address)
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
    rname 		varchar(255) DEFAULT 'Rest' REFERENCES Restaurants (rname) ON DELETE SET DEFAULT,
	address 	varchar(255) DEFAULT 'address' REFERENCES Restaurants (address) ON DELETE SET DEFAULT, 
	date 		date, --history purpose
	time 		time, --history purpose
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
	FOREIGN KEY (area) REFERENCES Locations(area) ON DELETE cascade,
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
	FOREIGN KEY (rname, address, date, time) REFERENCES Availability(rname, address, date,time) ON DELETE cascade
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

CREATE OR REPLACE PROCEDURE delete_rest(rest varchar(155),addr varchar(255))
AS $$
BEGIN
	DELETE FROM Restaurants WHERE rname = rest AND address = addr;
END; 
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION no_owner()
RETURNS TRIGGER AS $$
DECLARE count NUMERIC;
DECLARE rest VARCHAR(255);
DECLARE addr VARCHAR(255);
BEGIN 
	WITH rest_involved AS(
		SELECT rname,address FROM Owner_Rest
		WHERE OLD.uname = Owner_Rest.uname
	),
	owners_involved AS(
		SELECT rname,O.address AS address from Owner_Rest O JOIN rest_involved R
		ON O.rname = R.rname AND O.address = R.address
		GROUP BY rname,address
		HAVING count(uname) > 1 --0 if after
	)
	SELECT COUNT(*) INTO count FROM owners_involved;
	WHILE count <> 0 LOOP 
		SELECT rname INTO rest, address INTO addr
		FROM owners_involved
		ORDER BY rname,address
		LIMIT 1;
		
		CALL delete_rest(rest,addr);
		--alternatively
		BEGIN
			DELETE FROM Restaurants WHERE rname = rest AND address = addr;
		END
		
		count := count - 1;
	END LOOP
		
	RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_rest
BEFORE DELETE ON Owners
FOR EACH ROW
EXECUTE PROCEDURE no_owner();

--insert into diners
CREATE OR REPLACE PROCEDURE add_diners(name varchar(155),phoneNum varchar(8),email varchar(255),uname varchar(255),	password varchar(255),type varchar(255))
AS $$
BEGIN
 INSERT INTO Users VALUES (name,phoneNum,email,uname,password,type);
 INSERT INTO Diners VALUES (uname,0);
END; 
$$ LANGUAGE plpgsql;

--insert into owners
CREATE OR REPLACE PROCEDURE add_Owners(name varchar(155),phoneNum varchar(8),email varchar(255),uname varchar(255),	password varchar(255),type varchar(255))
AS $$
BEGIN
 INSERT INTO Users VALUES (name,phoneNum,email,uname,password,type);
 INSERT INTO Owners VALUES (uname);
END;
$$ LANGUAGE plpgsql;

--when inserting diner check that not owner
CREATE OR REPLACE FUNCTION not_owner()
RETURNS TRIGGER AS $$
DECLARE count NUMERIC;
BEGIN 
	SELECT COUNT(*) INTO count FROM Owners WHERE NEW.uname = Owners.uname;
	IF count > 0 THEN RETURN NULL;
	ELSE RETURN NEW;
	END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_diner
BEFORE INSERT OR UPDATE ON Diners
FOR EACH ROW
EXECUTE PROCEDURE not_owner();

--when inserting owner check that not diner
CREATE OR REPLACE FUNCTION not_diner()
RETURNS TRIGGER AS $$
DECLARE count NUMERIC;
BEGIN 
	SELECT COUNT(*) INTO count FROM Diners WHERE NEW.uname = Diners.uname;
	IF count > 0 THEN RETURN NULL;
	ELSE RETURN NEW;
	END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_owner
BEFORE INSERT OR UPDATE ON Diners
FOR EACH ROW
EXECUTE PROCEDURE not_diner();

--Trig: if new reservation
CREATE OR REPLACE FUNCTION has_avail()
RETURNS TRIGGER AS $$
DECLARE pax INTEGER;
DECLARE date DATE;
DECLARE time DATE;
BEGIN 
	SELECT A.maxPax into pax, A.time into time, A.date into date
	FROM Availability A
	WHERE NEW.time = A.time AND NEW.date = A.date;
	IF (pax - NEW.numPax) > 0
		Update Availability SET maxPax = (pax - NEW.numPax) WHERE NEW.time = time AND NEW.date = date;
		RETURN NEW;
	ELSE RETURN NULL;
	END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_avail
BEFORE INSERT ON Reservation
FOR EACH ROW
EXECUTE PROCEDURE has_avail();

--update max pax in
CREATE OR REPLACE PROCEDURE update_reservation(name varchar(155),phoneNum varchar(8),email varchar(255),uname varchar(255),	password varchar(255),type varchar(255))
AS $$
BEGIN
 INSERT INTO Users VALUES (name,phoneNum,email,uname,password,type);
 INSERT INTO Diners VALUES (uname,0);
END; 
$$ LANGUAGE plpgsql;


