-- Active: 1732115424953@@localhost@3306@payme
DROP DATABASE IF EXISTS PayMe;
CREATE DATABASE PayMe;
USE PayMe;

DROP TABLE IF EXISTS Account;
CREATE TABLE Account(
    idAccount CHAR(6) NOT NULL PRIMARY KEY,
    nameUser VARCHAR(50) NOT NULL,
    lastNameUser VARCHAR(50) NOT NULL,
    emailUser VARCHAR(50) NOT NULL,
    passwordUser varchar(50) NOT NULL
);

DROP TABLE IF EXISTS Cards;
CREATE TABLE Cards(
    idCard INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    numberCard VARCHAR(50) NOT NULL,
    nameCard VARCHAR(50) NOT NULL
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
    IN p_nameUser VARCHAR(50),
    IN p_lastNameUser VARCHAR(50),
    IN p_emailUser VARCHAR(50),
    IN p_passwordUser VARCHAR(50)
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

    INSERT INTO Account(idAccount, nameUser, lastNameUser, emailUser, passwordUser) 
    VALUES (idGenerator, p_nameUser, p_lastNameUser, p_emailUser, SHA1(p_passwordUser));
END //
DELIMITER ;

CALL SP_CREATE_ACCOUNT('Juan', 'Escutia', 'JuanE@gmail.com', '123456789');
CALL SP_CREATE_ACCOUNT('Pedro', 'Perez', 'pedroperez@gmail.com', 'pepepecas5144');
CALL SP_CREATE_ACCOUNT('Carlos', 'Villagran', 'CarlosV@gmail.com', 'CarVill12');

SELECT * FROM Account;