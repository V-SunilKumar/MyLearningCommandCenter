# Database creation and management

> Source: `MySql_Notes.pdf`, pages 11, 12, 13, 14, 15. These are source-derived notes; verify version-specific commands before using them in a current environment.


MYSQL DATABASE CREATION>
Login to MySQL
mysql -u root -p
- 
Create Database
show databases;
create database VSNL;
create database sample_user character set UTF8mb4 collate utf8mb4_bin;
show databases;
SHOW ENGINES;
show create database VSNL;
- 
Switch database
mysql -u root -p VSNL
OR
SELECT DATABASE();
use VSNL;
- 
How to clear the mysql screen
system 'clear';
- 
Direct connect to Database instead of switch
mysql -u root -p dell
SELECT DATABASE();
select version();
- 
Select version of Database
- 
mysql -u root -p -e 'select version();'
DROP DATABASE
- 
DROP DATABASE testdb;
show databases like 'test%';
SELECT schema_name FROM information_schema.schemata;
LOGS :
[mysql@mysql1 ~]$ mysql -uroot -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 4
Server version: 5.7.35-log MySQL Community Server (GPL)
Copyright (c) 2000, 2021, Oracle and/or its affiliates.
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql>
mysql> show databases;
+--------------------+
DB Creation
Thursday, July 29, 2021
10:21 AM

---


| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.01 sec)

mysql> create database VSNL;
Query OK, 1 row affected (0.00 sec)
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| VSNL               |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)
mysql> show engines;
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| Engine             | Support | Comment                                                        | Transactions | XA   | Savepoints |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| InnoDB             | DEFAULT | Supports transactions, row-level locking, and foreign keys     | YES          | YES  | YES        |
| MRG_MYISAM         | YES     | Collection of identical MyISAM tables                          | NO           | NO   | NO         |
| MEMORY             | YES     | Hash based, stored in memory, useful for temporary tables      | NO           | NO   | NO         |
| BLACKHOLE          | YES     | /dev/null storage engine (anything you write to it disappears) | NO           | NO   | NO         |
| MyISAM             | YES     | MyISAM storage engine                                          | NO           | NO   | NO         |
| CSV                | YES     | CSV storage engine                                             | NO           | NO   | NO         |
| ARCHIVE            | YES     | Archive storage engine                                         | NO           | NO   | NO         |
| PERFORMANCE_SCHEMA | YES     | Performance Schema                                             | NO           | NO   | NO         |
| FEDERATED          | NO      | Federated MySQL storage engine                                 | NULL         | NULL | NULL       |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
9 rows in set (0.00 sec)
mysql>
mysql> show create database VSNL;
+----------+-----------------------------------------------------------------+
| Database | Create Database                                                 |
+----------+-----------------------------------------------------------------+
| VSNL     | CREATE DATABASE `VSNL` /*!40100 DEFAULT CHARACTER SET latin1 */ |
+----------+-----------------------------------------------------------------+
1 row in set (0.00 sec)
mysql> select database();
+------------+
| database() |
+------------+
| NULL       |
+------------+
1 row in set (0.00 sec)
mysql> use VSNL;
Database changed
mysql> select database();
+------------+
| database() |

---


+------------+
| VSNL       |
+------------+
1 row in set (0.00 sec)
mysql>
mysql> show tables
    -> ;
Empty set (0.00 sec)
mysql> create table DBA_TEAM (
    ->     trans_id smallint,
    ->     trans varchar(5),
    ->     primary key (trans_id))
    ->     ENGINE=InnoDB;
Query OK, 0 rows affected (0.08 sec)
mysql> SHOW TABLES;
+----------------+
| Tables_in_VSNL |
+----------------+
| DBA_TEAM       |
+----------------+
1 row in set (0.00 sec)
mysql> SHOW CREATE TABLE TEST;
ERROR 1146 (42S02): Table 'VSNL.TEST' doesn't exist
mysql> show create table dba_team;
ERROR 1146 (42S02): Table 'VSNL.dba_team' doesn't exist
mysql> show create table DBA_TEAM
    -> ;
+----------+---------------------------------------------------------------------------------------------------------------------------------------------------
----------------+
| Table    | Create Table
|
+----------+---------------------------------------------------------------------------------------------------------------------------------------------------
----------------+
| DBA_TEAM | CREATE TABLE `DBA_TEAM` (
  `trans_id` smallint(6) NOT NULL,
  `trans` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`trans_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 |
+----------+---------------------------------------------------------------------------------------------------------------------------------------------------
----------------+
1 row in set (0.01 sec)
mysql> SELECT * FROM DBA_TEAM;
Empty set (0.00 sec)
mysql> INSERT INTO test values(1,'sample_user');
ERROR 1146 (42S02): Table 'VSNL.test' doesn't exist
mysql> INSERT INTO test values(2,'MURALEE');
ERROR 1146 (42S02): Table 'VSNL.test' doesn't exist
mysql> INSERT INTO test values(3,'RANVIJAY');
ERROR 1146 (42S02): Table 'VSNL.test' doesn't exist
mysql> INSERT INTO test values(4,'RAVI');
ERROR 1146 (42S02): Table 'VSNL.test' doesn't exist
mysql> INSERT INTO test values(5,'KASU');
ERROR 1146 (42S02): Table 'VSNL.test' doesn't exist
mysql> INSERT INTO DBA_TEAM values(1,'sample_user');
Query OK, 1 row affected (0.01 sec)
mysql> INSERT INTO DBA_TEAM values(2,'MURALEE');
ERROR 1406 (22001): Data too long for column 'trans' at row 1
mysql> INSERT INTO DBA_TEAM values(3,'RANVIJAY');
ERROR 1406 (22001): Data too long for column 'trans' at row 1
mysql> INSERT INTO DBA_TEAM values(4,'RAVI');
Query OK, 1 row affected (0.01 sec)

---


mysql> INSERT INTO DBA_TEAM values(5,'KASU');
Query OK, 1 row affected (0.01 sec)
mysql> SELECT * FROM DBA_TEAM;
+----------+-------+
| trans_id | trans |
+----------+-------+
|        1 | sample_user |
|        4 | RAVI  |
|        5 | KASU  |
+----------+-------+
3 rows in set (0.00 sec)
mysql> ALTER TABLE DBA_TEAMtrans 'trans' Varchar(15)^C
mysql>
mysql>
mysql> ALTER TABLE DBA_TEAM trans 'trans' Varchar(15);
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near
'trans 'trans' Varchar(15)' at line 1
mysql> ALTER TABLE DBA_TEAM MODIFY trans varchar(15);
Query OK, 0 rows affected (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 0
mysql>
mysql>
mysql> show create table DBA_TEAM;
+----------+-----------------------------------------------------------------------------------------------------------------------------------+
| Table    | Create Table
|
+----------+-----------------------------------------------------------------------------------------------------------------------------------+
| DBA_TEAM | CREATE TABLE `DBA_TEAM` (
  `trans_id` smallint(6) NOT NULL,
  `trans` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`trans_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 |
+----------+------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
mysql> INSERT INTO DBA_TEAM values(1,'sample_user');
ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY'
mysql> INSERT INTO DBA_TEAM values(2,'MURALEE');
Query OK, 1 row affected (0.02 sec)
mysql> INSERT INTO DBA_TEAM values(3,'RANVIJAY');
Query OK, 1 row affected (0.02 sec)
mysql> INSERT INTO DBA_TEAM values(4,'RAVI');
ERROR 1062 (23000): Duplicate entry '4' for key 'PRIMARY'
mysql> INSERT INTO DBA_TEAM values(5,'KASU');
ERROR 1062 (23000): Duplicate entry '5' for key 'PRIMARY'
mysql> SELECT * FROM DBA_TEAM;
+----------+----------+
| trans_id | trans    |
+----------+----------+
|        1 | sample_user    |
|        2 | MURALEE  |
|        3 | RANVIJAY |
|        4 | RAVI     |
|        5 | KASU     |
+----------+----------+
5 rows in set (0.00 sec)
mysql> SELECT VERSION();
+------------+
| VERSION()  |
+------------+
| 5.7.35-log |

---


+------------+
1 row in set (0.00 sec)
mysql> EXIT
Bye
[mysql@mysql1 ~]$ mysql -uroot -p -e 'select version()';
Enter password:
+------------+
| version()  |
+------------+
| 5.7.35-log |
+------------+
