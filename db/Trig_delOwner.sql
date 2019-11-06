--Trig: if del owner then del restaurant related to the owner

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
		WHERE OLD.uname = Owner_Rest.uname;
	)
	WITH owners_involved AS(
		SELECT rname,address from Owner_Rest O JOIN rest_involved R
		ON O.rname = R.rname AND O.address = R.address
		GROUP BY rname,address
		HAVING count(uname) > 1; --0 if after
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

CREATE TRIGGER check_rest()
BEFORE DELETE ON Owners
FOR EACH ROW
EXECUTE PROCEDURE no_owner();


--backup
--Trig: Dont allow owner to be deleted if lst owner of some restaurant
'''CREATE OR REPLACE FUNCTION no_owner()
RETURNS TRIGGER AS $$
DECLARE count NUMERIC;
BEGIN 
	WITH rest_involved AS(
		SELECT rname,address FROM Owner_Rest 
		WHERE OLD.uname = Owner_Rest.uname;
	)
	WITH owners_involved AS(
		SELECT count(uname) from Owner_Rest O JOIN rest_involved R
		ON O.rname = R.rname AND O.address = R.address
		GROUP BY rname,address
		HAVING count(uname) > 1; --0 if after
	)
	SELECT COUNT(*) INTO count FROM owners_involved;
	IF count > 0 THEN RETURN NULL;
	ELSE RETURN OLD;
	END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_rest()
BEFORE DELETE ON Owners
FOR EACH ROW
EXECUTE PROCEDURE no_owner();
'''
