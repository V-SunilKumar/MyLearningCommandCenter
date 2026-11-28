# Crash recovery and point-in-time recovery

> Source: `MySql_Notes.pdf`, pages 62, 63. These are source-derived notes; verify version-specific commands before using them in a current environment.


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

---


Root>select * from color;
Restoreation of single tables in mysql is critical. From 100 tables 1 table is lost. It is not that easier my sql. Since the structure is not available. So getting the structure and getting the data is not that
ease. The startegies is different. Using OS level filters to achive this using 'sed' command from the os command.
#mysql -u root -p
Root>use student
Root>show tables;
Root>drop table tabel1;
Root>select * from table1;
#
#mysql -u root -p student table1 < all.sql  --- This will not work in restoreation.
For restoration open the file and using sed command filter the table1 and copy to other file.
Sed -n -e '/CREATE TABLE.*table1/,/UNLOCK TABLES/p' all.sql > table_new.sql
Note: Identified the character_set_client and input the value. Only this change need to be done in the newly created .sql file.
#mysql -u root  -p student < table_new.sql
#mysql -u root -p
Root> show datbases
Root>use student
Root> show tables;
Root> seelct * from table1;
To check the corruption in a database.
#mysqlcheck -u root -p student

---

![Image extracted from original PDF page 63](images/pdf-page-63-image-1.jpeg)

---

![Image extracted from original PDF page 63](images/pdf-page-63-image-2.png)
