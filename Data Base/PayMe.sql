-- Active: 1732115424953@@localhost@3306@payme
DROP DATABASE IF EXISTS PayMe;
CREATE DATABASE PayMe;
USE PayMe;

DROP TABLE IF EXISTS Clients;
CREATE TABLE Clients(
    idClient INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nameClient VARCHAR(50) NOT NULL,
    lastNameClient VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL
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
    idClient INT NOT NULL,
    datePayment DATE NOT NULL,
    amountPayment DECIMAL(10,2) NOT NULL
);

INSERT INTO Clients(nameClient, lastNameClient, email, phone) VALUES
('Juan', 'Escutia', 'JuanE@gmail.com', '123456789'),
('Pedro', 'Perez', 'pedroperez@gmail.com', '123456789'),
('Carlos', 'Villagran', 'CarlosV@gmail.com', '123456789');

SELECT * FROM Clients;