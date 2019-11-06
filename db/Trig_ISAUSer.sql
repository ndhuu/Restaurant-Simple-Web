CREATE OR REPLACE FUNCTION which_type()
RETURNS TRIGGER AS $$
DECLARE count NUMERIC;
BEGIN 
	IF NEW.type = 'Owner'
		SELECT COUNT(*) INTO count FROM Diners WHERE NEW.uname = Diners.uname;
		IF count > 0 RETURN NULL;
		ELSE
			BEGIN
				INSERT INTO Owners VALUES (NEW.uname);
				RETURN NEW;
			END;
		ENDIF;
	IF NEW.type = 'Diners'
		SELECT COUNT(*) INTO count FROM Owners WHERE NEW.uname = Owners.uname;
		IF count > 0 RETURN NULL;
		ELSE
			BEGIN
				INSERT INTO Diners VALUES (NEW.uname,0);
				RETURN NEW;
			END;
		ENDIF;	
	ENDIF;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER check_type()
AFTER INSERT ON Users
FOR EACH ROW
EXECUTE PROCEDURE which_type();
