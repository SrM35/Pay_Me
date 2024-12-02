-- Active: 1732115424953@@localhost@3306@payme
DROP DATABASE IF EXISTS PayMe;
CREATE DATABASE PayMe;
USE PayMe;

DROP TABLE IF EXISTS Account;
CREATE TABLE Account(
    idAccount CHAR(6) NOT NULL PRIMARY KEY,
    nameUser VARCHAR(100) NOT NULL,
    emailUser VARCHAR(50) NOT NULL UNIQUE,
    passwordUser varchar(100) NOT NULL
);

DROP TABLE IF EXISTS Cards;
CREATE TABLE Cards(
    idCard INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    -- saldo float not null,
    numberCard VARCHAR(16) NOT NULL,
    nameCardOwner VARCHAR(50) NOT NULL,
    securityNumbers CHAR(3) NOT NULL
);

DROP TABLE IF EXISTS Payments;
CREATE TABLE Payments(
    idPayment INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idCard INT NOT NULL,
    idAccount CHAR(6) NOT NULL,
    datePayment DATE NOT NULL,
    amountPayment DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idCard) REFERENCES Cards(idCard),
    FOREIGN KEY (idAccount) REFERENCES Account(idAccount)
);

DROP TABLE IF EXISTS Trasfers;
CREATE TABLE Trasfers(
    idTransfer INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idAccount CHAR(6) NOT NULL,
    idCard INT NOT NULL,
    dateTransfer DATE NOT NULL,
    amountTransfer DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idCard) REFERENCES Cards(idCard),
    FOREIGN KEY (idAccount) REFERENCES Account(idAccount)
);

DROP PROCEDURE IF EXISTS SP_CREATE_ACCOUNT;
DELIMITER //
CREATE PROCEDURE SP_CREATE_ACCOUNT(
    IN p_nameUser VARCHAR(100),
    IN p_emailUser VARCHAR(50),
    IN p_passwordUser VARCHAR(100)
)
BEGIN

	DECLARE idGenerator CHAR(6);
    SET idGenerator = SUBSTRING(SHA1(RAND()), 1, 6);

	IF p_emailUser NOT REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
		BEGIN
			SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Sorry, Not valid email format, try again please!';
		END;
    END IF;

    INSERT INTO Account(idAccount, nameUser, emailUser, passwordUser) 
    VALUES (idGenerator, p_nameUser, p_emailUser, p_passwordUser);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS SP_ADD_CARD;
DELIMITER $$
CREATE PROCEDURE SP_ADD_CARD(
IN p_numberCard VARCHAR(16), 
IN p_nameCardOwner VARCHAR(100), 
IN p_securityNumbers CHAR(3))
	BEGIN
		INSERT INTO Cards(numberCard, nameCardOwner, securityNumbers) VALUES (p_numberCard, p_nameCardOwner, p_securityNumbers);
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS SP_LOGIN;
DELIMITER $$
CREATE PROCEDURE SP_LOGIN(l_emailUser VARCHAR(50), l_passwordUser VARCHAR(100))
	BEGIN
		SELECT * FROM Account WHERE emailUser = l_emailUser AND passwordUser = l_passwordUser;
    END$$
DELIMITER ;


CALL SP_CREATE_ACCOUNT('Juan Escutia', 'JuanE@gmail.com', '123456789');
CALL SP_CREATE_ACCOUNT('Pedro Perez', 'pedroperez@gmail.com', 'pepepecas5144');
CALL SP_CREATE_ACCOUNT('Carlos Villagran', 'CarlosV@gmail.com', 'CarVill12');


CALL SP_ADD_CARD(1223556879119164, 'Juan Escutia', '123');

SELECT * FROM Cards;
SELECT * FROM Account;

-- bcrypt // hashear contraseñas en la api