DROP DATABASE IF EXISTS `CoCurr`;
CREATE DATABASE `CoCurr`;
USE `CoCurr`;

DROP TABLE IF EXISTS Useracc;
DROP TABLE IF EXISTS ToDoList;
DROP TABLE IF EXISTS Calendar;
DROP TABLE IF EXISTS CourseFolder;
DROP TABLE IF EXISTS Task;
DROP TABLE IF EXISTS Course;

-- creating tables --
CREATE TABLE Useracc (
  userID INT(30) NOT NULL,
  username VARCHAR(30) NOT NULL,
  userpw VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  PRIMARY KEY (userID)
);

CREATE TABLE TASK(
	userID INT(30) NOT NULL,
	taskID INT(30) NOT NULL,
    taskTitle VARCHAR(50),
    taskDescription VARCHAR (200),
    dueDate DATE,
    taskStatus VARCHAR(10),
    taskCourse VARCHAR(10),
    PRIMARY KEY (userID, taskID)
);

CREATE TABLE COURSE(
	userID INT(30) NOT NULL,
	courseID INT(30) NOT NULL,
    courseTitle VARCHAR(50),
    courseDescription VARCHAR (200),
    teacher VARCHAR(50),
    coursetimeSTART TIME,
    coursetimeEND TIME,
    courseDay VARCHAR(10),
    taskID VARCHAR(10),
    PRIMARY KEY (userID, courseID)
);

CREATE TABLE CALENDAR(
	calendarID INT(30),
    weekSchedule DATE
);