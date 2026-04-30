/*
Name: <your name>
Assignment: C3_Lab Activity 2
Description: Create Employee table, insert data, and run the requested query
Filename: <your_name>_c3la2.sql
Date: 2026-02-05
*/

-- Create database and use it
CREATE DATABASE IF NOT EXISTS C3_LA2;
USE C3_LA2;

-- Drop existing table if present
DROP TABLE IF EXISTS Employee;

-- Create Employee table (self-referential manager ID)
CREATE TABLE Employee (
  ID INT PRIMARY KEY,
  FirstName VARCHAR(50) NOT NULL,
  LastName VARCHAR(50) NOT NULL,
  ManagerID INT NULL
) ENGINE=InnoDB;

-- Insert provided employee data
INSERT INTO Employee (ID, FirstName, LastName, ManagerID) VALUES
(1, 'David', 'Wallace', NULL),
(2, 'Ryan', 'Howard', 1),
(3, 'Michael', 'Scott', 2),
(4, 'Dwight', 'Schrute', 3),
(5, 'Jim', 'Halpert', 3),
(6, 'Pam', 'Beesly', 3),
(7, 'Andy', 'Bernard', 5),
(8, 'Phyllis', 'Lapin', 7),
(9, 'Stanley', 'Hudson', 7),
(10, 'Angela', 'Martin', 3),
(11, 'Kelly', 'Kapoor', 3),
(12, 'Meredith', 'Palmer', 3);

-- Query: select employee full name and their manager's full name
-- Only employees that have a manager; order by employee first name
SELECT
  CONCAT(e.FirstName, ' ', e.LastName) AS Employee,
  CONCAT(m.FirstName, ' ', m.LastName) AS Manager
FROM Employee e
JOIN Employee m
  ON e.ManagerID = m.ID
ORDER BY e.FirstName;

-- Save this file as <your_name>_c3la2.sql and replace <your name> at top
