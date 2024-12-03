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
/*
DROP TABLE IF EXISTS cardTransfers;
CREATE TABLE cardTransfers(
    idTransfer INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idAccount CHAR(6) NOT NULL,
    typeTransfer VARCHAR(100) NOT NULL,
    idCard INT NOT NULL,
    dateTransfer DATE NOT NULL,
    timeTransfer TIME NOT NULL,
    amountTransfer DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idCard) REFERENCES Cards(idCard),
    FOREIGN KEY (idAccount) REFERENCES Account(idAccount)
);
*/
DROP TABLE IF EXISTS Transfers;
CREATE TABLE Transfers(
    idTransfer INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idAccount CHAR(6) NOT NULL,
    typeTransfer VARCHAR(100) NOT NULL,
    dateTransfer DATE NOT NULL,
    timeTransfer TIME NOT NULL,
    amountTransfer DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idAccount) REFERENCES Account(idAccount)
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
IN p_securityNumbers CHAR(3),
IN p_idAccount CHAR(6))
	BEGIN
    
		INSERT INTO Cards(balance, numberCard, nameCardOwner, securityNumbers, idAccount) VALUES (p_balance, p_numberCard, p_nameCardOwner, p_securityNumbers, p_idAccount);
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
CREATE PROCEDURE SP_TRANSFERE(IN idAccount_origin CHAR(6), IN idAccount_destiny CHAR(6), IN _amount FLOAT)
BEGIN 
	DECLARE type_transfer VARCHAR(100);
	DECLARE amount_origin FLOAT;
    DECLARE amount_destiny FLOAT;

	START TRANSACTION;
    IF _amount <= 0 THEN
		ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The amount to transfer must be greater than 0';
	END IF;
    
    IF(SELECT COUNT(idAccount) FROM Account WHERE idAccount = idAccount_origin) = 0 THEN 
		ROLLBACK;
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Origin account does not exist';
	END IF;
    
    IF(SELECT COUNT(idAccount) FROM Account WHERE idAccount = idAccount_destiny) = 0 THEN
		ROLLBACK;
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Destiny account does not exist';
	END IF;
    
    IF idAccount_origin = idAccount_destiny THEN
		ROLLBACK;
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Origin account is equal to destiny account';
    END IF;
    
    SELECT balance INTO amount_origin FROM Account WHERE idAccount = idAccount_origin;
    IF amount_origin < _amount THEN
		ROLLBACK;
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'insufficient balance';
    END IF;
    
    SET type_transfer = 'Account transfere';
    
    SELECT balance INTO amount_destiny FROM Account WHERE idAccount = idAccount_destiny;
    
    SET amount_origin = amount_origin - _amount;
    SET amount_destiny = amount_destiny + _amount;
    
    UPDATE Account SET balance = amount_origin WHERE idAccount = idAccount_origin;
    UPDATE Account SET balance = amount_destiny WHERE idAccount = idAccount_destiny;
    INSERT INTO Transfers(idAccount, typeTransfer, dateTransfer, timeTransfer, amountTransfer) VALUES (idAccount_origin, type_transfer,  CURDATE(), CURTIME(), _amount);
    COMMIT;
END// 
DELIMITER ;

CALL SP_CREATE_ACCOUNT('Juan Escutia', 1000.0, 'JuanEsc@gmail.com', 'pipipupu');
CALL SP_CREATE_ACCOUNT('Rodolfo', 0.0, 'Rudolf21@gmail.com', 'pipipupu');

CALL SP_TRANSFERE('EL6965', 'EV6500', 50.0);

SELECT * FROM Cards;
SELECT * FROM Account;
SELECT * FROM Transfers;

SELECT * FROM Account WHERE idAccount = 'EL6965';
SELECT * FROM Transfers WHERE idAccount = 'EL6965';
