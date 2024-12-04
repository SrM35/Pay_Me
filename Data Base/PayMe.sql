-- Active: 1732115424953@@localhost@3306@payme
DROP DATABASE IF EXISTS PayMe;
CREATE DATABASE PayMe;
USE PayMe;

DROP TABLE IF EXISTS Account;
CREATE TABLE Account(
    idAccount CHAR(6) NOT NULL PRIMARY KEY UNIQUE,
    nameUser VARCHAR(100) NOT NULL,
    balance FLOAT NOT NULL,
    emailUser VARCHAR(50) NOT NULL UNIQUE,
    passwordUser VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS Cards;
CREATE TABLE Cards(
    idCard INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    balance FLOAT NOT NULL,
    numberCard VARCHAR(16) NOT NULL,
    nameCardOwner VARCHAR(100) NOT NULL,
    expirationDate DATE NOT NULL,
    securityNumbers CHAR(3) NOT NULL UNIQUE,
    idAccount CHAR(6) NOT NULL,
    FOREIGN KEY (idAccount) REFERENCES Account(idAccount) ON DELETE CASCADE
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

DROP TABLE IF EXISTS Transfers;
CREATE TABLE Transfers(
    idTransfer INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    emailUser VARCHAR(50) NOT NULL,
    dateTransfer DATE NOT NULL,
    timeTransfer TIME NOT NULL,
    amountTransfer DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (emailUser) REFERENCES Account(emailUser)
);

DELIMITER //
CREATE TRIGGER generateId BEFORE INSERT ON Account
FOR EACH ROW
BEGIN
	IF NEW.idAccount IS NULL THEN
		BEGIN
			SET NEW.idAccount = CONCAT(
            CHAR(FLOOR(65 + (RAND() * 26))),
            CHAR(FLOOR(65 + (RAND() * 26))),
            LPAD(FLOOR(RAND() * 99999), 4, '0')
        );
        END;
    END IF;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS SP_CREATE_ACCOUNT;
DELIMITER //
CREATE PROCEDURE SP_CREATE_ACCOUNT(
    IN p_nameUser VARCHAR(100),
    IN p_balance FLOAT,
    IN p_emailUser VARCHAR(50),
    IN p_passwordUser VARCHAR(100)
)
BEGIN

	IF p_emailUser NOT REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
		BEGIN
			SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Sorry, not valid email format, try again please!';
		END;
    END IF;

    INSERT INTO Account(nameUser, balance, emailUser, passwordUser) 
    VALUES (p_nameUser, p_balance, p_emailUser, p_passwordUser);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS SP_ADD_CARD;
DELIMITER $$
CREATE PROCEDURE SP_ADD_CARD(
IN p_balance FLOAT,
IN p_numberCard VARCHAR(16), 
IN p_nameCardOwner VARCHAR(100),
IN p_expirationDate DATE,
IN p_securityNumbers CHAR(3),
IN p_idAccount CHAR(6))
	BEGIN
    
		INSERT INTO Cards(balance, numberCard, nameCardOwner, expirationDate, securityNumbers, idAccount) VALUES (p_balance, p_numberCard, p_nameCardOwner, p_expirationDate, p_securityNumbers, p_idAccount);
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS SP_LOGIN;
DELIMITER $$
CREATE PROCEDURE SP_LOGIN(l_emailUser VARCHAR(50), l_passwordUser VARCHAR(100))
	BEGIN
		SELECT * FROM Account WHERE emailUser = l_emailUser AND passwordUser = l_passwordUser;
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS SP_TRANSFERE;
DELIMITER //
CREATE PROCEDURE SP_TRANSFERE(IN emailUser_origin VARCHAR(50), IN emailUser_destiny VARCHAR(50), IN _amount FLOAT)
BEGIN 
	DECLARE amount_origin FLOAT;
    DECLARE amount_destiny FLOAT;

	START TRANSACTION;
    IF _amount <= 0 THEN
		ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The amount to transfer must be greater than 0';
	END IF;
    
    IF(SELECT COUNT(emailUser) FROM Account WHERE emailUser = emailUser_origin) = 0 THEN 
		ROLLBACK;
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Origin account does not exist';
	END IF;
    
    IF(SELECT COUNT(emailUser) FROM Account WHERE emailUser = emailUser_destiny) = 0 THEN
		ROLLBACK;
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Destiny account does not exist';
	END IF;
    
    IF emailUser_origin = emailUser_destiny THEN
		ROLLBACK;
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Origin account is equal to destiny account';
    END IF;
    
    SELECT balance INTO amount_origin FROM Account WHERE emailUser = emailUser_origin;
    IF amount_origin < _amount THEN
		ROLLBACK;
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'insufficient balance';
    END IF;
    
    SELECT balance INTO amount_destiny FROM Account WHERE emailUser = emailUser_destiny;
    
    SET amount_origin = amount_origin - _amount;
    SET amount_destiny = amount_destiny + _amount;
    
    UPDATE Account SET balance = amount_origin WHERE emailUser = emailUser_origin;
    UPDATE Account SET balance = amount_destiny WHERE emailUser = emailUser_destiny;
    INSERT INTO Transfers(emailUser, dateTransfer, timeTransfer, amountTransfer) VALUES (emailUser_origin,  CURDATE(), CURTIME(), _amount);
    COMMIT;
END// 
DELIMITER ;

CALL SP_CREATE_ACCOUNT('Juan Escutia', 1000.0, 'JuanEsc@gmail.com', 'pipipupu');
CALL SP_CREATE_ACCOUNT('Rodolfo', 0.0, 'Rudolf21@gmail.com', 'pipipupu');

CALL SP_TRANSFERE('JuanEsc@gmail.com', 'Rudolf21@gmail.com', 100.0);

SELECT * FROM Cards;
SELECT * FROM Account;
SELECT * FROM Transfers;

CREATE VIEW existingAccounts AS
SELECT * FROM Account;

CREATE USER 'Paul' @'localhost' IDENTIFIED BY '123';
GRANT SELECT ON PayMe.existingAccounts TO 'Paul'@'loca