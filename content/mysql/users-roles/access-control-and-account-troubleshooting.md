# Access control and account troubleshooting

> Source: `MySql_Notes.pdf`, pages 53, 54, 55, 56, 57. These are source-derived notes; verify version-specific commands before using them in a current environment.


MySQL does a little different to other database servers, a user in MySQL is a username and a host string (hostname, IP address, fully qualified
domain name or netmask), for example
admin@localhost
- 
admin@192.0.2.10
- 
admin@192.0.2.2.%
- 
Connect Mysql DB Remotely.
mysql –ureplica -p -h 192.0.2.61
SELECT user, host FROM mysql.user;
SELECT USER(), CURRENT_USER();
SHOW VARIABLES LIKE 'skip_networking';
Each of the above users can have different passwords, a user could have multiple entries, MySQL will try and match the most specific username. You
can use wildcards % and _ in host strings here are some examples
192.0.2.1.%
matches 192.0.2.1.[0-255]
192.0.2._.%
matches 192.0.2.[0-9].[0-255]
%.hostname.com
matches any host ending in "hostname.com
To create, drop or rename a user see below
display users
select * from mysql.user;
display who you are logged in as
select user();
select current_user();
create user
create user 'ops'@'192.0.2.2.%' identified by 'password';
delete user
drop user 'ops'@'192.0.2.2.%';
rename user
rename user 'ops'@'192.0.2.2.%' to 'support'@'192.0.2.2.%';
reset password
set password for 'ops'@'192.0.2.2.%' = password('new password');
Create New User Account in MySQL
mysql -u root -p
use mysql;
select database ();
show tables;
desc user;
select host,User from user;
---- OR -----------
use VSNL;
select host,user from mysql.user;
---- OR ------------
select * from USER_PRIVILEGES;
select database();
-- CREATE NEW USER sample_user, localhost=from where user sample_user can connect to mysql db
mysql> create user 'backup_user'@'localhost' identified by '[REDACTED]';
-- sample_user@% -- sample_user user can connect from any host
mysql> create user 'sample_user'@'%' identified by '[REDACTED]';
-- sample_user@192.0.2.2.% -- sample_user user can connect from any host using 192.0.2.0.0 subnet.
mysql> create user 'sample_user'@'192.0.2.0.%' identified by '[REDACTED]';
-- sample_user@192.0.2.102 -- sample_user user allowed only from host ip 192.0.2.62
mysql> create user 'sample_user'@'192.0.2.62' identified by '[REDACTED]';
-- create user with comment
mysql> create user sample_user@localhost identified by '[REDACTED]' COMMENT 'sample_user - Local Master User';
mysql> select * from INFORMATION_SCHEMA.USER_ATTRIBUTES where user = 'sample_user' and host = 'localhost';
-- create user with attribute
mysql> create user 'sample_user'@'localhost' identified by '[REDACTED]' ATTRIBUTE '{"Name":"sample_user","Role":"DBA"}';
User Management
Friday, July 23, 2021
7:31 PM

---


mysql> select * from INFORMATION_SCHEMA.USER_ATTRIBUTES where user = 'sample_user' and host = 'localhost';
-- create user with password expire
mysql> create user 'expired_user'@'localhost' identified by '[REDACTED]' password expire;
mysql -usunilexpire -p[REDACTED]
mysql> show databases;
ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.
mysql>
mysql> SET PASSWORD = '[REDACTED]';
Query OK, 0 rows affected (0.01 sec)
mysql> show databases;
From Root User.
mysql> ALTER USER 'expired_user'@'localhost' IDENTIFIED BY '[REDACTED]';
Mysql> flush privileges;
6. How To Change the Password of Another User Account?
mysql> use mysql;
mysql> SET PASSWORD FOR 'expired_user'@'localhost' = '[REDACTED]';
Mysql> flush privileges;
7. How to Lock user account?
mysql> alter user 'expired_user'@'localhost' account lock;
[mysql@mysql1 ~]$ mysql -usunilexpire -p
Enter password:
ERROR 3118 (HY000): Access denied for user 'expired_user'@'localhost'. Account is locked.
[mysql@mysql1 ~]$
[mysql@mysql1 ~]$ mysql -uroot -p
mysql> alter user 'expired_user'@'localhost' account unlock;

mysql> exit
Bye
[mysql@mysql1 ~]$ mysql -usunilexpire -p
mysql>
mysql> select user,host,account_locked from user where user='raj' and host='localhost';
9. How To Rename an Existing User Account Name?
mysql> select user,host,account_locked from mysql.user where user='hr';
mysql> RENAME USER 'hr'@'localhost' TO 'hr1'@'localhost';
mysql> select user,host,account_locked from mysql.user where user='hr';
mysql> select user,host,account_locked from mysql.user where user='hr1';
10. How to Drop user?
mysql> select user,host,account_locked from mysql.user where user='hr1';
mysql> DROP USER 'hr1'@'localhost';
mysql> select user,host,account_locked from mysql.user where user='hr1';
Grant privileges:
As with other databases users are granted access to database objects, MySQL uses the least privilege when an account is created, what I mean by this
is that they have no permissions to do anything until an administrator grants this privilege. The ACL (also called the grant tables) are held in
memory, when a user tries to access an object it uses the most specific credentials first if a user has multiple credentials. MySQL uses the
standard grant and revoke commands to allow a user access to objects or to take them away.
First lets see what privileges a user can have
all
grants all privileges (except grant option)
alter
allows a user to use alter table
alter routine
allows a user to alter or drop stored routines
create
allows a user to use create table
create routine
allows a user to create stored routines
create temporary tables allows a user to use create temporary table
create user
allows a user to use
create user
drop user
rename user
revoke all privileges

---


create view
allows a user to use create view
delete
allows a user to use delete
drop
allows a user to use drop
event
allows a user to use create event and drop event
execute
allows a user to run stored routines
file
allows a user to execute both select into outfile and load data infile
grant option
allows a user to grant other users privileges
index
allows a user to use create index and drop index
insert
allows a user to use create insert
lock tables
allows a user to use lock tables
process
allows a user to see all processes when executing show processlist
references
this is not used
reload
allows a user to execute flush
replication client
allows a user to execute both show master status and show slave status
replication slave
needed by the replication slave to read binary logs from the master
select
allows a user to execute select
show databases
when a user executes show databases command will return a list of all databases
show view
allows a user to execute show create view
shutdown
allows a user to execute mysqladmin shutdown
super
allows a user to execute
change master kill
kill
purge master logs
set global
grant super on *.* to 'sample_user'@'%';
trigger
allows a user to use create trigger and drop trigger
update
allows a user to execute update
usage
allows a user to connect
There are five levels that privileges can have
Global
Global privileges apply to all databases on a MySQL server, these privileges are stored in mysql.user table, below is an example
sql> grant reload,shutdown on *.* to 'ops'@'192.0.2.%';
sql> REVOKE ALL ON *.* FROM 'database_user'@'localhost';
sql> REVOKE SELECT,INSERT,UPDATE,DELETE ON *.* FROM 'database_user'@'localhost';
Database Database privileges apply to all objects to a specified database, these privileges are stored in mysql.db and mysql.host tables, below is an example
sql> grant all on <database>.* to 'ops'@'192.0.2.%';
sql> REVOKE ALL PRIVILEGES ON database_name.* FROM 'database_user'@'localhost';
sql> REVOKE SELECT,INSERT,UPDATE,DELETE ON database_name.* FROM 'database_user'@'localhost';
Table
Table privileges apply to all columns in a given table, these privileges are stored in the mysql.tables_priv table, below is an example
sql> grant all on <database>.<table_name> to 'ops'@'192.0.2.%';
sql> REVOKE ALL PRIVILEGES ON database_name.table_name FROM 'database_user'@'localhost';
sql> REVOKE SELECT,INSERT,UPDATE,DELETE ON database_name.table_name FROM 'database_user'@'localhost';
Column
Column privileges apply to one or more columns in a given table, these privileges are stored in mysql.columns_priv table, below is an example
sql> grant select (col1,col2), insert (col1,col2), update (col1,col2) on <database>.<table_name> to 'ops'@'192.0.2.%';
sql> REVOKE SELECT,INSERT (`trans`) ON orcl.`test_orcl` FROM 'may'@`localhost`;
sql> REVOKE INSERT (`trans`) ON orcl.`test_orcl` FROM 'may'@`localhost`;
Routine
The create routine, alter routine, execute and grant privileges apply to stored routines (functions and procedures), they can be granted at the global
and database level, they are stored in mysql.procs_priv table, se below for an example
sql> grant create routine on database.* to 'ops'@'192.0.2.%';
I am not going to detail on revoke as it is self explaining and very similar to the grant command.
You can display what privileges you have using either show grants or using the unix commandline command mk-show-grants (maatkit tool kit is
required)
display privileges
## using mysql commandline tool
sql> show grants
## using the unix commandline
#> mk-show-grants -uroot -p[REDACTED]
Resetting the root password
There are times when the root password is lost or you have started a new job and no-one knows what the root password is, the process of resetting
the root password will require a restart of the MySQL server.
The first option involves using the skip-grants-table option,
The second option involves creating a SQL file and using the init-file option to call this SQL upon startup, here are both options
option one
This process involves using the skip-grants-table option, which is less secure than option two as it allows anyone for a brief period of time to access the MySQL
server, as when the server is restarted it is "wide open" with anyone able to log in with all privileges without specifying a username
Edit the configuration file (mysql.ini) and the line skip-grants-table
- 
Restart the server
- 
connect to the server using mysql
- 
change the root password
update mysql.user set password=PASSWORD('new password') where user='root';
- 
exit the client and stop the database, remove the skip-grants-table and restart
option two
The second option invokes creating a SQL file that will be executed when the database starts, this is the more secure option
create a sql file, call it what you like, the contents should be
update mysql.user set password=PASSWORD('new password') where user='root'; FLUSH privileges;
once the file has been saved make a note of the full path and filename
edit the configuration file (mysql.ini) and add the below line in the mysqld section
init-file=<path>/<file_name>
stop and restart the mysql server
check that the root password as been reset
remove the line from task 3 from the configuration file

---


Debugging Account Problems
There will be a time when a user will call regarding an account or privilege problem, below are a few of the common account problems that occur and
how to fault find.
The most common problem i find is the just simply trying to login to mysql, this can be a simple password reset or a confusion on the users account,
to change a users password.
changing a users password
update mysql.user set password=PASSWORD('new password') where user=<user>;
FLUSH privileges;
The next thing to check is the users privileges, the details of the user are held in the mysql.user table, remember MySQL is different from other
databases in that an account is made up of a username and an host string, mostly it is the host string that needs to be checked, check that either
the hostname or IP address has been set correctly within the mysql.user table, you can use the command below to check if the user has a login for
where he/she is trying to login from, sometimes there could be double entries specially for global accounts like admin, ops and each different
having a different password.
check the users grants
show grants for <username>@<hostname or IP address>
show grants for 'ops'@'localhost';
show grants for 'ops'@'192.0.2.30';
One thing to note with MySQL is that there is no locking of accounts after a number of unsuccessful attempts like in other databases.
Another common issue that I have is when you try to connect you get an error message stating "Can't connect to local mysqld through socket
'/path/to/mysqld.sock'", this only happens on Unix/Linux servers, the socket file can be located by examining the my.cnf file and looking for the
entry socket, locate the file and check the permission and that it exists., if it does not, restart MySQL and this file should be recreated, if not
then check the permissions on the directory and make sure that you can write to it.
The next problem is that user has actually logged in with no problems but cannot access anything, first thing to check is to make sure that he is
logged in with who he thinks he has logged in as, to check what account you have logged in as see the below command.
check who you are logged in as
select user();
select current_user();
If the user still has access problems accessing tables, then you need to check the privilege tables which I identified earlier in this section and
grant the user access to what he needs.
create user 'sample_user'@localhost identified by '[REDACTED]';
create user 'sample_user'@% identified by '[REDACTED]'; -- Will connect locally and remote any server
Mysql -u sample_user -p
Passwrod : [REDACTED]
Select user(); -- Which user it connected.
Show databases; -- which DB's sample_user has access
Giving privs connect to root user and grant privs to users
Mysql -u root -p
desc users; -- check the privs
Grant all on  student.* to 'sample_user'@localhost; -- always mention username with hostname.
Mysql -u sample_user -p
Show databases;
Use student;
Show tables;
Select * from table1;
Grant all on  *.* to 'sample_user'@localhost; -- always mention username with hostname. -- all the DB's & all the objects
Show grants for 'sample_user'@localhost; -- to check what grants have the user, This could be done on root user only not with any other user.
Select user(); -- to check which user you connected.
Flush privileges;
Grant usage on *.* to 'sample_user'@localhost; -- To reset the privs to user
Grant all on *.* to 'sample_user'@loaclhost;
Show grants for 'sample_user'@localhost;
Mysql -u root -p
Create user 'sample_user@localhost identified by 'sample_user';
Grant all on *.* to 'sample_user'@localhost;
Show grants for 'sample_user'@localhost;

---


Mysql -u sample_user -p
Show databases;
Limiting access to the users:
Mysql -u root -p
Grant all on customer.* to 'sample_user'@localhost with
MAX_QUERIES_PER_HOUR 20
MAX_SESSIONS_PER_HOUR 10
MAX_CONNECTIONS_PER_HOURS 5
MAX_USER_CONNECTIONS 2;
SHOW GRANTS FOR 'sample_user'@LOCALHOST; -- To Check thelimitations.
Auditing a user:
Root> show processlist; -- thread / process will generate and id will assign
Id = user id
Time = Ideal Time in secs
Info = Query info which user is executing
DB = Database it is connected
Host = from which host it connected.
State=
Root> kill <id> -- To kill the user session.
Root> show processlist;
# mysqladmin -u root -p status  -- Complete status of the mysql server it will show.
Root> desc user;
Root> insert into user(user,host,password,ssl_cipher,x509_issuer,x509_subject) values ('[REDACTED]','localhost',passwrod('[REDACTED]'),' ',' ',' '); -- Security values need to provide for last columns
Root> select user,host from user;
Root> flush privileges; -- Try to make the cahanges permanent. If you forgot to flush the privs the next time connect to the DB will not work the privs
Root>
