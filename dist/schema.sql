DROP DATABASE IF EXISTS LibraryBear;
CREATE DATABASE LibraryBear;

 USE LibraryBear;

DROP TABLE IF EXISTS user;

CREATE TABLE user (
  id varchar(30) NOT NULL,
  source varchar(256) NOT NULL,
  prev_transac datetime NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  

DROP TABLE IF EXISTS book;

CREATE TABLE book (
  id int(11) NOT NULL AUTO_INCREMENT,
  title text NOT NULL,
  author text NOT NULL,
  image text NOT NULL,
  category text NOT NULL,
  borrower varchar(30) DEFAULT NULL,
  CONSTRAINT book_pk PRIMARY KEY (id),
  CONSTRAINT user_book_fk FOREIGN KEY (borrower) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
