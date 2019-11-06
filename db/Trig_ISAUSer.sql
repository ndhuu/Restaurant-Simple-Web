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

CREATE TRIGGER check_diner()
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

CREATE TRIGGER check_owner()
BEFORE INSERT OR UPDATE ON Diners
FOR EACH ROW
EXECUTE PROCEDURE not_diner();
