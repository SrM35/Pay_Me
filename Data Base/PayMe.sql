<<<<<<< HEAD
=======
-- Active: 1732115424953@@localhost@3306@payme
>>>>>>> ec1155dfa5f5aee8621da660c86dc2953fb1ff66
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

<<<<<<< HEAD
=======
-- HOLI
>>>>>>> ec1155dfa5f5aee8621da660c86dc2953fb1ff66
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

DROP TABLE IF EXISTS debt;
CREATE TABLE debt(
    idDebt INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nameCompany VARCHAR(100) NOT NULL,
    amountToPay DECIMAL(10,2) NOT NULL
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
CREATE TABLE Transfers (
    idTransfer INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    emailUser VARCHAR(50) NOT NULL,
    dateTransfer DATE NOT NULL,
    timeTransfer TIME NOT NULL,
    amountTransfer DECIMAL(10,2) NOT NULL,
    messageTransfer VARCHAR(100) NOT NULL,
    typeTransfer ENUM('ingreso', 'gasto') NOT NULL,  
    descriptionTransfer TEXT,                      
    FOREIGN KEY (emailUser) REFERENCES Account(emailUser)
);

DELIMITER $$
CREATE TRIGGER generateId BEFORE INSERT ON Account
FOR EACH ROW
BEGIN
    IF NEW.idAccount IS NULL THEN
        SET NEW.idAccount = CONCAT(
            CHAR(FLOOR(65 + (RAND() * 26))),
            CHAR(FLOOR(65 + (RAND() * 26))),
            LPAD(FLOOR(RAND() * 99999), 4, '0')
        );
    END IF;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS SP_CREATE_ACCOUNT;
DELIMITER $$
CREATE PROCEDURE SP_CREATE_ACCOUNT(
    IN p_nameUser VARCHAR(100),
    IN p_balance FLOAT,
    IN p_emailUser VARCHAR(50),
    IN p_passwordUser VARCHAR(100)
)
BEGIN
    IF p_emailUser NOT REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sorry, not valid email format, try again please!';
    END IF;

    INSERT INTO Account(nameUser, balance, emailUser, passwordUser) 
    VALUES (p_nameUser, p_balance, p_emailUser, p_passwordUser);
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS SP_ADD_CARD;
DELIMITER $$
CREATE PROCEDURE SP_ADD_CARD(
    IN p_balance FLOAT,
    IN p_numberCard VARCHAR(16), 
    IN p_nameCardOwner VARCHAR(100),
    IN p_expirationDate DATE,
    IN p_securityNumbers CHAR(3),
    IN p_idAccount CHAR(6)
)
BEGIN
<<<<<<< HEAD
    INSERT INTO Cards(balance, numberCard, nameCardOwner, expirationDate, securityNumbers)
    VALUES (p_balance, p_numberCard, p_nameCardOwner, p_expirationDate, p_securityNumbers);
=======
    INSERT INTO Cards(balance, numberCard, nameCardOwner, expirationDate, securityNumbers, idAccount) 
    VALUES (p_balance, p_numberCard, p_nameCardOwner, p_expirationDate, p_securityNumbers, p_idAccount);
>>>>>>> ec1155dfa5f5aee8621da660c86dc2953fb1ff66
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE SP_LOGIN(
    IN l_emailUser VARCHAR(50)
)
BEGIN
    SELECT nameUser, passwordUser
    FROM Account
    WHERE emailUser = l_emailUser;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE SP_TRANSFERE(
    IN emailUser_origin VARCHAR(50),
    IN emailUser_destiny VARCHAR(50),
    IN _amount FLOAT,
    IN _message VARCHAR(255)
)
BEGIN
    DECLARE amount_origin FLOAT;
    DECLARE amount_destiny FLOAT;

    START TRANSACTION;

    IF _amount <= 0 THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The amount to transfer must be greater than 0';
    END IF;

    IF (SELECT COUNT(emailUser) FROM Account WHERE emailUser = emailUser_origin) = 0 THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Origin account does not exist';
    END IF;

    IF (SELECT COUNT(emailUser) FROM Account WHERE emailUser = emailUser_destiny) = 0 THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Destiny account does not exist';
    END IF;

    IF emailUser_origin = emailUser_destiny THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Origin account is equal to destiny account';
    END IF;

    SELECT balance INTO amount_origin FROM Account WHERE emailUser = emailUser_origin;
    IF amount_origin < _amount THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance';
    END IF;

    SELECT balance INTO amount_destiny FROM Account WHERE emailUser = emailUser_destiny;

    SET amount_origin = amount_origin - _amount;
    SET amount_destiny = amount_destiny + _amount;

    UPDATE Account SET balance = amount_origin WHERE emailUser = emailUser_origin;
    UPDATE Account SET balance = amount_destiny WHERE emailUser = emailUser_destiny;

    INSERT INTO Transfers (emailUser, dateTransfer, timeTransfer, amountTransfer, messageTransfer)
    VALUES (emailUser_origin, CURDATE(), CURTIME(), _amount, _message);

    COMMIT;
END$$
DELIMITER ;

CREATE VIEW existingAccounts AS
SELECT * FROM Account;

CREATE VIEW existingCards AS
SELECT * FROM Cards;

CREATE VIEW transferences AS
SELECT * FROM Transfers;

/*
CREATE USER 'Paul' @'localhost' IDENTIFIED BY '123';
GRANT SELECT ON PayMe.existingAccounts TO 'Paul'@'localhost';
GRANT SELECT ON PayMe.existingCards TO 'Paul'@'localhost';
GRANT SELECT ON PayMe.transferences TO 'Paul'@'localhost';
FLUSH PRIVILEGES;
<<<<<<< HEAD

CALL SP_CREATE_ACCOUNT('maria', 1000, 'mariaw@gmail.com', 'password123');
CALL SP_CREATE_ACCOUNT('juanito', 2000, 'juanito5@gmail.com', 'password456');

CALL SP_TRANSFERE('mariaw@gmail.com', 'juanito5@gmail.com', 500, 'Payment for services');

SELECT * FROM existingAccounts;
SELECT * FROM existingCards;
SELECT * FROM transferences;

SELECT * FROM Cards;
SHOW TABLES;
=======
*/

/*
=======

<<<<<<< HEAD

>>>>>>> a74808f4e2e9e79eca787d2ae08fa65342f47dd3
=======
>>>>>>> fd792a0dfe7a21bcc020310f577615601ceda6b2
*/
>>>>>>> ec1155dfa5f5aee8621da660c86dc2953fb1ff66
