CREATE OR REPLACE FUNCTION which_type()
RETURNS TRIGGER AS $$
DECLARE count NUMERIC;
BEGIN 
	IF (NEW.type = 'Owner') THEN
		SELECT COUNT(*) INTO count FROM Diners WHERE NEW.uname = Diners.uname;
		IF (count > 0) THEN RETURN NULL;
		ELSE
			BEGIN
				INSERT INTO Owners VALUES (NEW.uname);
				RETURN NEW;
			END;
		END IF;
	END IF;
	IF (NEW.type = 'Diners') THEN
		SELECT COUNT(*) INTO count FROM Owners WHERE NEW.uname = Owners.uname;
		IF (count > 0) THEN RETURN NULL;
		ELSE
			BEGIN
				INSERT INTO Diners VALUES (NEW.uname,0);
				RETURN NEW;
			END;
		END IF;	
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

CREATE TRIGGER check_type
AFTER INSERT ON Users
FOR EACH ROW
EXECUTE PROCEDURE which_type();