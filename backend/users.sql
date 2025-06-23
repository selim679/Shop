-- SQL script to create the users table for your app
CREATE DATABASE myapp;
USE myapp;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nom VARCHAR(50),
  prenom VARCHAR(50),
  email VARCHAR(100) NOT NULL UNIQUE,
  telephone VARCHAR(30),
  pays VARCHAR(50),
  role ENUM('user','admin') DEFAULT 'user',
  reset_code VARCHAR(10)
);

-- Example admin user (password: admin)
INSERT IGNORE INTO users (username, password, nom, prenom, email, telephone, pays, role)
VALUES ('admin', 'admin', 'Admin', 'Admin', 'admin@example.com', '', '', 'admin');
