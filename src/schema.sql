DROP DATABASE IF EXISTS LibraryBear;
CREATE DATABASE LibraryBear;

USE LibraryBear;

DROP TABLE IF EXISTS user;

CREATE TABLE user (
  id varchar(256) NOT NULL,
  name varchar(256) DEFAULT NULL,
  source varchar(256) NOT NULL,
  prev_transac datetime NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS book;

CREATE TABLE book (
  id int(11) NOT NULL AUTO_INCREMENT,
  title text NOT NULL,
  author text NOT NULL,
  category text NOT NULL,
  image text NOT NULL,
  borrower varchar(256) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY FK_borrower (borrower),
  CONSTRAINT FK_borrower FOREIGN KEY (borrower) REFERENCES user (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS user_group;

CREATE TABLE user_group (
  name varchar(256) NOT NULL,
  user varchar(256) NOT NULL,
  UNIQUE KEY name (name,user),
  KEY FK_user (user),
  CONSTRAINT FK_user FOREIGN KEY (user) REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;