# MySQL command-line reference

> Source: `MySql_Notes.pdf`, pages 16, 17, 18. These are source-derived notes; verify version-specific commands before using them in a current environment.


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


SET PASSWORD FOR ‘sam’@’localhost’ = PASSWORD(‘mypass’);
Assigns password to MySQL user account
Note:
FLUSH LOGS, FLUSH MASTER, FLUSH SLAVE, FLUSH TABLES WITH READ LOCK are not written to the binary logs
because it would cause problem to the slave if replicated to a slave.
RESET operations
All the flush commands needs RELOAD privileges to execute below commands
Database Commands
Description
RESET MASTER
Deletes all the binary logs listed out in index file and resets the index file and starts a fresh binary log
RESET QUERY CACHE
Clears query cache
RESET SLAVE
Slave deletes its master details and its replication co-ordinates and also deletes all the existing relay logs and starts a
new relay log
MySQL SHOW commands
Here are the few important Show commands in MySQL which I use in my day to day activities:
SHOW COMMANDS
DESCRIPTION
SHOW DATABASES;
Show all databases on this instance
SHOW ENGINES;
Show all storage engines supported by the current mysql server
SHOW TABLES;
List all tables from the current database
SHOW TABLES FROM db_name;
List all tables from the given database name
SHOW TABLES LIKE ‘%tmp%’;
List all the tables matching the ‘tmp’ string
SHOW TABLE STATUS;
Show the table status all tables in the current db
SHOW TABLE STATUS LIKE ‘%tbl_name%’;
Show table status of specified table
SHOW BINARY LOGS;
Show all the binary logs available in the server
SHOW MASTER LOGS;
Show all the binary logs available in the server
SHOW CREATE DATABASE db_name;
Show database definition
SHOW CREATE EVENT event_name;
Show event definition
SHOW CREATE FUNCTION func_name;
Show function definition
SHOW CREATE PROCEDURE proc_name;
Show procedure definition
SHOW CREATE TABLE tbl_name;
Show table definition
SHOW CREATE TRIGGER trigger_name;
Show trigger definition
SHOW CREATE VIEW view_name;
Show view definition
SHOW EVENTS;
List all the events in the current database
SHOW EVENTS FROM db_name;
List all the events from the given database name
SHOW MASTER STATUS;
Show the current master binlog and its position
SHOW SLAVE STATUS;
Show the replication status
SHOW OPEN TABLES;
Lists all the tables that are currently in use
SHOW SLAVE HOSTS;
Lists all the slave replicating from the current server
SHOW PRIVILEGES;
List all the privileges supported by the MySQL server
SHOW INDEX FROM tbl_name;
Show indexes of tbl_name
SHOW INDEX IN tbl_name;
Show indexes of tbl_name
SHOW INDEX FROM tbl_name WHERE Key_name=’ PRIMARY’; Show the primary key of the tbl_name
SHOW KEYS FROM tbl_name;
Show indexes of tbl_name
SHOW KEYS IN tbl_name;
Show indexes of tbl_name
SHOW KEYS FROM tbl_name WHERE Key_name=’ PRIMARY’;
Show the primary key of the tbl_name
SHOW WARNINGS;
Show warnings
SHOW ERRORS;
Show errors
SHOW CHARACTER SET;
Shows all available character sets
SHOW CHARACTER SET LIKE ‘%utf8%’;
Show all the utf8 character sets
SHOW CHARACTER SET where Maxlen=2;
Show all the character sets with 2 bytes maxlen
SHOW COLLATION;
Shows all collations supported by the server
SHOW COLLATION LIKE ‘%utf8%’;
Show all the utf8 collations
SHOW COLLATION WHERE Default=’Yes’;
Show all the collation for each character set
SHOW COLUMNS FROM tbl_name;
Show all columns of the given table
SHOW PROCESSLIST;
Show all current process running in MySQL
SHOW ENGINE INNODB STATUS;
Show innodb storage engine status
SHOW ENGINE INNODB MUTEX;
Show innodb mutex statistics
SHOW GRANTS;
Lists the privileges granted to the account that is connected to the DB
SHOW GRANTS FOR CURRENT_USER;
Lists the privileges if current user
SHOW GRANTS FOR ‘db_user’@’hostname’;
List the privileges of given username@host
SHOW COLUMNS FROM db_name.tbl_name;
Describe the table columns
DESC db_name.tablname;
Describe the table columns
SHOW RELAYLOG EVENTS LIMIT 10;
List first 10 queries of the first relay log in the server
SHOW RELAYLOG EVENTS IN ‘relay-log-bin’ FROM 4 LIMIT 10’; List 10 statements from 4 position of the relay log specified
SHOW BINLOG EVENTS LIMIT 10;
List first 10 queries of the first available binary log in the server
SHOW BINLOG EVENTS IN ‘log-bin’ FROM 4 LIMIT 10’;
List 10 statements from 4 position of the binary log specified

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
