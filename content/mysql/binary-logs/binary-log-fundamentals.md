# Binary log fundamentals

> Source: `MySql_Notes.pdf`, pages 16, 18, 59, 62. These are source-derived notes; verify version-specific commands before using them in a current environment.


Find the version of mysql
# mysql -u sample_user -h mysql-primary.example.local -p[REDACTED] [REDACTED] -e "select * from mysql"
# mysql -uUSER -p -e 'SHOW VARIABLES WHERE Variable_Name LIKE "%dir"'   //  Find the BASE DIRectory in mysql
# mysql -u root -p -e "select version ()";
mysql> show databases;
mysql> use database
mysql> select * from tables \G
mysql> \! uptime
mysql> select user(),database();
mysql> show variables;
mysql> show variables like '%innodb%';
mysql> select @@datadir;     //  Find the BASE DIRectory in mysql
Log / configuration file locations
socket=/var/lib/mysql/mysql.sock
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
DATABASE operations
Database Commands
Description
SHOW DATABASES;
List all databases
SHOW CREATE DATABASE;
Show database create statement
CREATE DATABASE db_name;
Create database
USE database_name; or \u db_name
Uses the given database by default till the next command of use is given
TABLE operations
Database Commands
Description
SHOW TABLES;
Lists all tables from the default database selected
SHOW TABLES FROM db_name;
Show tables from the given database name
CREATE TABLE table_name (a int , b char);
Create the new table with the given columns
DESCRIBE table_name;
Gets the information about table structure
TABLE MAINTENANCE operations
All the flush commands needs RELOAD privileges to execute
Database Commands
Description
CHECK TABLE table_name;
Checks a table for errors
REPAIR TABLE table_name;
Repairs a corrupted table
ANALYZE TABLE table_name;
Analyzes and stores the key distribution for a table
OPTIMIZE TABLE table_name;
Reorganizes the physical storage of table data
CHECKSUM TABLE table_name;
Reports table checksum
FLUSH operations
All the flush commands needs RELOAD privileges to execute below commands
Database Commands
Description
FLUSH BINARY LOGS;
Closes and opens a new binary log
FLUSH ENGINE LOGS;
Closes and reopens flushable log of storage engine Innodb flushes logs to disk
FLUSH ERROR LOGS;
Closes and reopens a new error log
FLUSH SLOW LOG;
Closes and reopens the slow query log
FLUSH GENERAL LOGS;
Closes and reopens the general query log
FLUSH RELAY LOGS;
Closes and opens a new relay log
FLUSH PRIVILEGES;
Reload grant tables
FLUSH HOSTS;
Empties the host cache
FLUSH QUERY CACHE;
De-fragment the query cache to better utilize memory
FLUSH STATUS;
Reset Session status
FLUSH TABLES;
Force all open tables to be closed
FLUSH TABLES table_name;
Forces the named table to be closed if it is open
FLUSH TABLES WITH READ LOCK ;
Close all open tables and lock all tables of all databases with a global read lock
FLUSH TABLES tb1, tb2,.. WITH READ LOCK; Flushes and acquires a read locks for the named tables
ACCOUNT MANAGEMENT operations
All the flush commands needs RELOAD privileges to execute below commands
Database Commands
Description
CREATE USER ‘sam’@’localhost’ IDENTIFIED BY ‘password’;
Creates new MySQL user accounts
DROP USER ‘sam’@’localhost’;
Removes one or more MySQL accounts and its privileges
GRANT PRIVILEGES ON db_name.% to ‘sam’@’localost’ IDENTIFIED BY ‘password’
Grants privileges to MySQL user account
RENAME USER old_user TO new_user;
Rename existing user to a differenr
REVOKE INSERT (PRIVILEGES) ON *.* from ‘sam’@’localhost’;
Revokes privileges from MySQL users
Commands
Friday, July 23, 2021
12:10 PM

---


SHOW PLUGINS
Shows the plugins information
MySQL Server Information
SELECT VERSION();
Show current MySQL server Version
STATUS();
Show the current status of MySQL servers
\s
Short cut command for STATUS
SHOW GLOBAL VARIABLES;
Global level MySQL system variables
SHOW SESSION VARIABLES;
Session level MySQL system variables
SHOW GLOBAL STATUS;
Global Level Server status information
SHOW SESSION STATUS;
Session values for the current session
mysqladmin –u user –p password extended-status
Equivalent to show global status command
Another useful command is mysqladmin, which allows you to perform adminisitive tasks.
Command
Usage
Description
create
mysqladmin create test2
create a database called test2
debug
mysqladmin debug
send additional detailed logging to the error log
drop
mysqladmin drop test2
drop the database called test2
extended-status
mysqladmin extended-status
displays mysqld system variables and their current values
flush-hosts
mysqladmin flush-hosts
clears internal information about hosts including the DNS cache and hostnames blocked due to too many connection errors
flush-logs
mysqladmin flush-logs
flushes server logs by closing current logs and reopening new log files.
flush-p[REDACTED]
mysqladmin flush-p[REDACTED]
reloads the grant tables, thus refreshing users privileges
flush-status
mysqladmin flush-status
resets most server status variables
flush-tables
mysqladmin flush-tables
closes currently open table file handles, it waits for the current thread connections to finish before releasing file handles used by those connections
flush-threads
mysqladmin flush-threads
resets the thread cache
kill
mysqladmin kill 50
kill specified client threads
password
mysqladmin password <password>
change the connection password for the user account specified
old-password
mysqladmin old-password <password>
change the connection password for the user account specified, however stores the password in the old less secure way using 1 6 characters instead of
41 characters
ping
mysqladmin ping
determines if the server is online and available
processlist
mysqladmin processlist
displays all active server threads
reload
mysqladmin reload
see flush-p[REDACTED]
refresh
mysqladmin refresh
similar to flush-hosts and flush-logs
shutdown
mysqladmin shutdown
stop the mysqld daemon cleanly
start-slave
mysqladmin start-slave
starts replication
status
mysqladmin status
Displays a number of global status variables
stop-slave
mysqladmin stop-slave
stop replication
variables
mysqladmin variables
displays the global status variables and values
version
mysqladmin version
displays the version of MySQL
With some of the mysqladmin options you can use two additional options --sleep and --count, if you have ever
used vmstat in the unix world then they act in the same way, for example you could use the following command to
take readings every 5 seconds for 5 times, you can also use --debug-info to get additional information on the
status for example
sleep and count mysqladmin status --sleep 5 --count 5
--debug-info
mysqladmin status --debug-info

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

---


Recovering from Crashes
Most often you have to recover to a point-in-time after the last backup, the normal procedure is as follows
restore the latest backup
- 
recovery the data to a point-in-time using recovery log files
- 
MySQL server uses a binary format for the log files to save space, this means that you cannot view these files directly, a utility
called mysqlbinlog is supplied to convert these log files into a text format that you can view. So the process for performing a point-in-time
restore for MySQL is
Restore the database using the last backup
- 
Determine the first binary log and starting position needed
- 
Determine the last binary log needed
- 
Convert the binary log to text format with the mysqlbinlog utility using options to specify the start and stop time
- 
Check the text file to make sure it's what you need
- 
Import the converted binary log(s)
- 
convert the log files
## convert to a specific binary log file
mysqlbinlog mysql-bin.010310 > mysql-bin.010310.sql
## use a date to end at a specific time
mysqlbinlog --stop-datetime='201204-29 17:00:00' mysql-bin.010312 > mysql-bin.010312.sql
## other options are
--stop-datetime
--start-datatime
--start-p[REDACTED]
--stop-p[REDACTED]
restore the converted file mysql --user=root -password < mysql-bin.010310.sql
Physical backup - backup of physical files / cold backup ( /var/lib/mysql/* ----> remote directory) When server is down these backups will be taken. OFFLINE backups
1.
Logical backups - Online backups -- Taking the backups of logical objects (Databases & tables) -- Using mysqldump utility
2.
To import / restore using mysqlimport or mysql utility
Incremental Backups
3.
# mkdir -p /colddir
cd /var/lib/mysql
ll
cp idbdata1 ib_logfile0 ib_logfile1 /colddir
Cd student
Cp -rf * /colddir
Logical Backup:
All Database backup ---> Mysqldump -u root -p --all-databases > all.sql
Dump files are text files, You can read them.
Student DB backup alone --> Mysqldump -u root -p  student > studentdb.sql
Mysqldump -u root -p  student database2 database3 > threedbs_bkp.sql
Note: Initiate individual database backups for logical backups for minimize the recovering db.
Table backup alone -->  Mysqldump -u root -p -student table1 > student_table1.sql
Mysqldump -u root -p -student table1 > student_table1.sql
Restore DB's:
-------------------
Root> show databases;
Root> drop database student;
Root> use student;
Error connecting
Root> exit
Restore the Student.
First restore the structure of the student database.
Root> crate database student;
Root> show databases;
Root> use student;
Root> show tables;
Root> exit
Import the logical backup
#mysql -u root -p student < studentdb.sql   <--- Restored from student backup
#mysql -u root -p
Root>use students
Root> show tables
Root>select * from color;
Root> drop database student;
Root > create database student;
#mysql -u root -p student < all.sql   <-- restore all databases backup
#mysql -u root -p
Root>use students
Root> show tables
