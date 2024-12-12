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

-- HOLI
DROP TABLE IF EXISTS Cards;
CREATE TABLE Cards(
    idCard INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    balance FLOAT NOT NULL,
    numberCard VARCHAR(16) NOT NULL UNIQUE,
    nameCardOwner VARCHAR(100) NOT NULL,
    expirationDate DATE NOT NULL,
    securityNumbers CHAR(3) NOT NULL,
    idAccount CHAR(6) NOT NULL,
    FOREIGN KEY (idAccount) REFERENCES Account(idAccount) ON DELETE CASCADE
);

DROP TABLE IF EXISTS debt;
CREATE TABLE debt(
    idDebt INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nameCompany VARCHAR(100) NOT NULL UNIQUE,
    amountToPay DECIMAL(10,2) NOT NULL
);

DROP TABLE IF EXISTS Payments;
CREATE TABLE Payments(
    idPayment INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    emailUser VARCHAR(50) NOT NULL,
    datePayment DATE NOT NULL,
    timePayment TIME NOT NULL,
    amountPayment DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (emailUser) REFERENCES Account(emailUser)
);

DROP TABLE IF EXISTS Transfers;
CREATE TABLE Transfers (
    idTransfer INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    emailUser VARCHAR(50) NOT NULL,
    dateTransfer DATE NOT NULL,
    timeTransfer TIME NOT NULL,
    amountTransfer DECIMAL(10,2) NOT NULL,
    messageTransfer TEXT NOT NULL,
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
    IN p_idAccount CHAR(6)
)
BEGIN
    INSERT INTO Cards(balance, numberCard, nameCardOwner, expirationDate, securityNumbers, idAccount) 
    VALUES (p_balance, p_numberCard, p_nameCardOwner, p_expirationDate, p_securityNumbers, p_idAccount);
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE SP_LOGIN(
    IN l_emailUser VARCHAR(50)
)
BEGIN
    SELECT  nameUser, passwordUser
    FROM Account
    WHERE emailUser = l_emailUser;
END$$
DELIMITER ;


DELIMITER //
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
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The amount to transfer must be greater than 0';
    END IF;

    IF (SELECT COUNT(emailUser) FROM Account WHERE emailUser = emailUser_origin) = 0 THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Origin account does not exist';
    END IF;

    IF (SELECT COUNT(emailUser) FROM Account WHERE emailUser = emailUser_destiny) = 0 THEN
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
        SET MESSAGE_TEXT = 'Insufficient balance';
    END IF;

    SELECT balance INTO amount_destiny FROM Account WHERE emailUser = emailUser_destiny;

    SET amount_origin = amount_origin - _amount;
    SET amount_destiny = amount_destiny + _amount;

    UPDATE Account SET balance = amount_origin WHERE emailUser = emailUser_origin;
    UPDATE Account SET balance = amount_destiny WHERE emailUser = emailUser_destiny;

    INSERT INTO Transfers (emailUser, dateTransfer, timeTransfer, amountTransfer, messageTransfer)
    VALUES (emailUser_origin, CURDATE(), CURTIME(), -_amount, _message);

    INSERT INTO Transfers (emailUser, dateTransfer, timeTransfer, amountTransfer, messageTransfer)
    VALUES (emailUser_destiny, CURDATE(), CURTIME(), _amount, _message);

    COMMIT;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS SP_ADD_DEBT;
DELIMITER $$
CREATE PROCEDURE SP_ADD_DEBT(
	p_nameCompany VARCHAR(100),
    p_amountToPay DECIMAL(10,2)
)
BEGIN
    INSERT INTO debt(nameCompany, amountToPay) VALUES (p_nameCompany, p_amountToPay);
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS SP_PAY_DEBT;
DELIMITER $$
CREATE PROCEDURE SP_PAY_DEBT(
    IN p_paymentMethod VARCHAR(10),
    IN p_nameCompany VARCHAR(100),
    IN p_emailUser VARCHAR(50),
    IN p_amount DECIMAL(10,2),
    IN p_numberCard VARCHAR(16),
    IN p_securityNumbers CHAR(3)
)
BEGIN
    DECLARE v_amount DECIMAL(10, 2);
    DECLARE v_balance_account FLOAT;
    DECLARE v_balance_card FLOAT;
    DECLARE v_error_msg VARCHAR(255);
    DECLARE v_securityNumbers CHAR(3);
    
    IF p_securityNumbers = 'NULL' THEN
        SET p_securityNumbers = NULL;
    END IF;

    SELECT amountToPay INTO v_amount
    FROM debt
    WHERE nameCompany = p_nameCompany;

    IF v_amount IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La deuda no existe.';
    END IF;

    IF p_paymentMethod = 'account' THEN
        SELECT balance INTO v_balance_account
        FROM Account
        WHERE emailUser = p_emailUser;
        
        IF p_amount > v_balance_account THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'El monto seleccionado sobrepasa el saldo en la cuenta.';
        END IF;

        IF v_balance_account IS NULL THEN
            SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cuenta no existe.';
        END IF;

        IF v_balance_account < v_amount THEN
            SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Saldo insuficiente de la cuenta.';
        END IF;
        
        IF p_amount < v_amount OR p_amount > v_amount THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Seleccione la cantidad correcta a pagar.';
        END IF;

        UPDATE Account
        SET balance = balance - v_amount
        WHERE emailUser = p_emailUser;

    ELSEIF p_paymentMethod = 'card' THEN
        SELECT balance INTO v_balance_card
        FROM Cards
        WHERE numberCard = p_numberCard;
        
        IF p_amount > v_balance_card THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'El monto seleccionado sobrepasa el saldo en la tarjeta.';
        END IF;
        
        SELECT securityNumbers INTO v_securityNumbers
        FROM Cards
        WHERE numberCard = p_numberCard;
        
        IF p_securityNumbers != v_securityNumbers THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Los numeros de seguridad son erroneos.';
        END IF;
        
        IF v_balance_card IS NULL THEN
            SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'La tarjeta no existe.';
        END IF;

        IF v_balance_card < v_amount THEN
            SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Saldo insuficiente en la tarjeta.';
        END IF;
        
        IF p_amount < v_amount OR p_amount > v_amount THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Seleccione la cantidad correcta a pagar.';
        END IF;

        UPDATE Cards
        SET balance = balance - v_amount
        WHERE numberCard = p_numberCard;
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Método de pago no válido. Use "account" o "card".';
    END IF;

    INSERT INTO Payments (emailUser, datePayment, timePayment, amountPayment)
    SELECT emailUser, CURRENT_DATE, CURRENT_TIME, v_amount
    FROM Account
    WHERE emailUser = p_emailUser;

    DELETE FROM debt
    WHERE nameCompany = p_nameCompany;
END$$
DELIMITER ;

CREATE VIEW existingAccounts AS
SELECT * FROM Account;

CREATE VIEW existingCards AS
SELECT * FROM Cards;

CREATE VIEW transferences AS
SELECT * FROM Transfers;

CREATE VIEW existingPayments AS
SELECT * FROM Payments;

/*
CREATE USER 'Paul' @'localhost' IDENTIFIED BY '123';
GRANT SELECT ON PayMe.existingAccounts TO 'Paul'@'localhost';
GRANT SELECT ON PayMe.existingCards TO 'Paul'@'localhost';
GRANT SELECT ON PayMe.transferences TO 'Paul'@'localhost';
GRANT SELECT ON PayMe.existingPayments TO 'Paul'@'localhost';
FLUSH PRIVILEGES;
*/
-- CALL SP_ADD_DEBT('NETFLIX', 100);


-- EJEMPLO PARA PAGOS
/*
CALL SP_CREATE_ACCOUNT('Juan Antonio', 1000.00, 'jjavier.rojo@gmail.com', 'pppppp');
CALL SP_ADD_CARD (500.0, '1234123412341324', 'Rodolfo', '2025-08-12', '555', 'YB5241');
CALL SP_PAY_DEBT('account', 'NETFLIX', 'jjavier.rojo@gmail.com', 100.0, NULL, NULL);
CALL SP_PAY_DEBT('card', 'NETFLIX', NULL, '1234123412341324', '555');

SELECT * FROM Account;
SELECT * FROM debt;
SELECT * FROM Payments;
*/