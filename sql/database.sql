DROP DATABASE IF EXISTS usersdb;
CREATE DATABASE usersdb;

USE usersdb;

-- Aseguramos que no queden residuos de tablas anteriores
DROP TABLE IF EXISTS attribute;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS admin;

-- Creamos las tablas
CREATE TABLE user (
  id BINARY(16) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  identification VARCHAR(255) NOT NULL UNIQUE,
  age INT,
  gender VARCHAR(100) NOT NULL,
  state ENUM('Active', 'Inactive') NOT NULL
);

CREATE TABLE attribute (
  id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  user_id BINARY(16) NOT NULL,
  attribute_name VARCHAR(255) NOT NULL,
  attribute_value TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  UNIQUE (user_id, attribute_name)
);

CREATE TABLE admin (
  id BINARY(16) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
