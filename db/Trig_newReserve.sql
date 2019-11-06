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