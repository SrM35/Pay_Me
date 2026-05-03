CREATE DATABASE IF NOT EXISTS PayMe;
USE PayMe;

CREATE TABLE IF NOT EXISTS Account (
    idAccount CHAR(6) NOT NULL PRIMARY KEY,
    nameUser VARCHAR(100) NOT NULL,
    balance FLOAT NOT NULL,
    emailUser VARCHAR(50) NOT NULL UNIQUE,
    passwordUser VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Cards (
    idCard INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    balance FLOAT NOT NULL,
    numberCard VARCHAR(16) NOT NULL UNIQUE,
    nameCardOwner VARCHAR(100) NOT NULL,
    expirationDate DATE NOT NULL,
    securityNumbers CHAR(3) NOT NULL,
    idAccount CHAR(6) NOT NULL,
    FOREIGN KEY (idAccount) REFERENCES Account(idAccount) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS debt (
    idDebt INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nameCompany VARCHAR(100) NOT NULL UNIQUE,
    amountToPay DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS Payments (
    idPayment INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    emailUser VARCHAR(50) NOT NULL,
    datePayment DATE NOT NULL,
    timePayment TIME NOT NULL,
    amountPayment DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (emailUser) REFERENCES Account(emailUser)
);

CREATE TABLE IF NOT EXISTS Transfers (
    idTransfer INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    emailUser VARCHAR(50) NOT NULL,
    dateTransfer DATE NOT NULL,
    timeTransfer TIME NOT NULL,
    amountTransfer DECIMAL(10,2) NOT NULL,
    messageTransfer TEXT NOT NULL,
    FOREIGN KEY (emailUser) REFERENCES Account(emailUser)
);