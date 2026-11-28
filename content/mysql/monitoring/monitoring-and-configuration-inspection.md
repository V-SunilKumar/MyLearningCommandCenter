# Monitoring and configuration inspection

> Source: `MySql_Notes.pdf`, pages 58, 59. These are source-derived notes; verify version-specific commands before using them in a current environment.


How to connect to MySQL / MariaDB database
hostname$ export PATH=/usr/local/mysql/bin:$PATH
hostname$ which mysql
/usr/local/mysql/bin
SYNTAX - mysql -u user -p
C:\Program Files\MariaDB 10.4\bin>mysql -u root -p
show databases;
SELECT * fROM information_schema.schemata;
show databases like 'test%';
Find current connection info:
MariaDB [(none)]> \s
MariaDB [(none)]> status
mariadb> select current_user,database();
switch to another database:
MariaDB> USE TEST;
Database changed
MariaDB> select database();
select version();
mysql --version
SHOW VARIABLES LIKE "%version%";
Uptime of server
MariaDB [(none)]> status;
MariaDB [(none)]> \s
MariaDB [(none)]> select TIME_FORMAT(SEC_TO_TIME(VARIABLE_VALUE ),'%Hh %im') as Uptime from information_schema.GLOBAL_STATUS where
VARIABLE_NAME='Uptime';
SHOW GLOBAL STATUS LIKE 'Uptime';
[root@mysql1 ~]#  mysqladmin version -u root -p
Find the DATA directory location
MariaDB [(none)]> show variables like '%data%';
MariaDB [(none)]> SELECT Variable_Value FROM information_schema.GLOBAL_VARIABLES WHERE Variable_Name = 'datadir';
mysql> select @@datadir;
Find current data/time on MySQL / MariaDB
Scripts
donderdag 29 juli 2021
13:32

---


mysql> select CURRENT_TIMESTAMP,current_date,localtime(0),localtimestamp(0);
Find MySQL / MariaDB configuration values
1 . Get Config values from mysql prompt.
MariaDB [(none)]> SELECT VARIABLE_NAME,VARIABLE_VALUE FROM information_schema.GLOBAL_VARIABLES;
MariaDB [(none)]> SELECT VARIABLE_NAME,VARIABLE_VALUE FROM information_schema.GLOBAL_VARIABLES WHERE Variable_Name = 'port';
MariaDB [(none)]> SELECT VARIABLE_NAME,VARIABLE_VALUE FROM information_schema.GLOBAL_VARIABLES WHERE Variable_Name = 'datadir';
2. Alternatively you can check my.cnf file in /etc folder in Linux
cat /etc/my.cnf
Find the last MySQL / MariaDB Database service restarted / server reboot time
MariaDB [(none)]> status
-- In older version:
MariaDB [(none)]> select TIME_FORMAT(SEC_TO_TIME(VARIABLE_VALUE ),'%Hh %im') as Uptime from information_schema.GLOBAL_STATUS where
VARIABLE_NAME='Uptime';
MariaDB [(none)]> mysql> show engines;
