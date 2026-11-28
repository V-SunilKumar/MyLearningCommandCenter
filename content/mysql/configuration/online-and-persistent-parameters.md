# Changing and persisting parameters

> Source: `MySql_Notes.pdf`, pages 21, 22, 34. These are source-derived notes; verify version-specific commands before using them in a current environment.


innodb_log_file_size
Determines the size (in bytes) of each of the Innodb log files, by default they are 5MB. Remember the bigger the file the slower recovery after a server
crash.
The larger the buffer the more data you can hold in memory which in turn increases performance, thus try to keep your most fr equently used data in
memory. Don't go too mad as to much memory could cause swapping by the operating system which in turn will degrade performanc e.
You can get detailed information regarding your InnoDB storage engine using the show command, there are a number of status sections which we will
look into it.
show command
show engine innodb status
Innodb Status sections
semaphores
Reports threads waiting for semaphore and statistics on how many times threads have been forced to wait for an OS call, waiting on a spin wait, or a mutex or rw-lock semaphore. A large
number of threads waiting indicates that there is a disk I/O problem or contention issues within the InnoDB.
foreign key errors
Displays information about foreign key problems
deadlocks
Displays information about the last deadlock that occurred
transactions
Reports lock waits, which may highlight lock contention within your application, it can also help detecting transaction deadlocks.
file I/O
Show activity about the threads used by the I/O
insert buffer and adaptive
hash index
Displays information about insert buffer including size and amount of free space.
log
show information about the log files
buffer pool and memory
show buffer pool activity, including hit rates, etc
row operations
show activity of the main thread
InnoDB uses shared tablespace for all tables and indexes that can consist of one or more files, they are generally located in the datadir directory,
The files contain metadata and are referred to as ibdata files. When the tablespace becomes fragmented the files are not shrunk, but the free space is still available to the database, you can view this
free space by using the data_free field of the information_schema.tables system view and the data_free field of show table status.
You can have separate files instead by using the parameter innodb_file_per_table as mentioned above, however a small amount of metadata will be in the shared tablespace, to defrag the
tablespace use the optimize table command
When working with ibdata files you can add additional files, these can be split over different disks, but with SAN replacing the old disk technology
this seems a lesser requirement today, here are some examples on creating the ibdata files
ibdata files
## Create a 1GB ibdata file that will autoextend if needed
innodb_data_file=ibdata1:1024M:autoextend
innodb_data_file=ibdata1:1G:autoextend
## create 1GB ibdata file and a second 1GB ibdata file that will autoextend
innodb_data_file=ibdata1:1024M;ibdata2:1024M:autoextend
MySQL will not stripe across disks, thus the first data file must be full before using the second data file, also some tables may be split across the two files when you start to use the second file, for
example say that you have 1MB free in the first file and you create a 2MB table, 1MB will be in the first file and the second 1MB will be in the second file.
If you wish to change the size of the data files there is no easy way, the following steps must be taken
perform a export of all the InnoDB tables
- 
shutdown MySQL
- 
change the configuration options as desired to remove or reorganize a tablespace
- 
move the existing ibdata file and log files to a backup location
- 
restart MySQL
- 
import the InnoDB tables
- 
once happy you can delete the old database files to recoup some space back
- 
Due to the log files, InnoDB automatic crash recovery is possible, just like in other databases all changes are recorded in the log files and
replayed back if the server were to crash. There are a number of parameters that can affect the log files.
innodb_log_files_in_group
the log files are written in a circular manner, they are initialized to there full size when MySQL starts
innodb_log_file_size
sets the logfile size in each group, the total size of all the logfiles must be less than 4GB, but this may be due to the O/S limitations so check with the latest MySQL release
innodb_fast_shutdown
this determines if logs files are purged during a shutdown which means it may take longer to completely shutdown MySQL
0 - log files are purged after shutdown
- 
1 - log files are not purged after shutdown (default)
- 
2 - simulates a crash, which causes the log buffer to be written after every commit and flushes the log files to disk once per second
- 
innodb_flush_log_at_trx_commit
controls how often the log files are written to
0 - causes the log files to be written to disk once per second
- 
1 - causes the log files to be written after every transaction commit (default)
- 
2 - a combination of 0 and 1
- 
innodb_flush_method
changes how Innodb opens and flushes data log files, this is a trade off between performance and inconsistent data during a crash, I will discuss this further in tuning.
innodb_log_buffer_size
this is a write buffer for the log files, the larger the buffer the less often the log files are written to thus saving I/O.
MEMORY storage engine creates a table in memory only, this allows for extremely fast data access, however the drawback is that data is not
persisted across reboots, also if you replicate this table to a slave server, it will also truncate the slave table as well even though it did not
restart. If rows are deleted from a memory table you must use either alter table or optimize table to defrag the table and reduce the amount of
memory used.Memory engine doesnot support LOB and TEXT.So you should manage the size of data you bring in to the memory.
Memory is not released when row's got deleted. Therefore we have to de-fregemant frequently,Mantainence overhead.
The MEMORY storage has the following features
All data is stored in memory
- 
Non-transactional
- 
No foreign key support
- 
very fast read and write activity due to being entirely in memory
- 
Table-level locking, So no transaction.No rollback, There is no checkpoint,redo,undo
- 
A MEMORY table can include you to 32 indexes per table
- 
Implements both hash and b-tree indexes
- 
tables use a fixed length row storage format and thus cannot be defined with data types of blob or text
-

---


The MEMORY storage engine has a few parameters that you can tweak
max_heap_table_size the maximum size of MEMORY tables is limited by the system variables, default is 16MB
init_file
this can be used to specify a file to use to populate a MEMORY table when mysqld starts
CSV storage engine (Comma Separated Value), it is simply a text file that can be manipulated with a simple text editor, this is ideal for data
exchange or data importing.
CSV storage has the following features
Plain text data in CSV format
- 
Easily imported into programs such as Microsoft Excel
- 
Table-level locking
- 
No foreign key support
- 
Non-transactional
- 
Trivial backups and restores (just copy the files)
- 
Does not support indexes or partitioning
- 
Three files are created .frm which contains the table format, .CSM which contains metadata and lastly .CSV file which contains the data.
NDB Cluster Engine:
NDB cluser divides the data between the datanodes,and also no of data replica too,mirror each other.Therefore the high availability.grouping is no
of replica.
Three types of nodes were used in NDB culster engine.
SQL Node
Management Node
Data Node.
NDB storage has the following features.
Follow ACID properties
1.
Foreigh Key supports
2.
Hot Backups
3.
Write validations
4.
The overall picture of MySQL is below
Firstly you would create a database (or schema as it means the same thing), then inside each database you create tables that c an be associated with
a different type of storage engine, for example I could create four tables all using different storage engines all within the same database
(schema), the picture below describes a single mysqld daemon running two databases/schemas each with fours tables, the tables can be associated with
different storage engines.

---

![Image extracted from original PDF page 22](images/pdf-page-22-image-1.jpeg)

---


level or on a session level, by default the sql_mode is set to '' (blank).
sql_mode # You can set it at a global or sessions level
show global variables like 'sql_mode';
show session variables like 'sql_mode';
SET GLOBAL sql_mode=<value>,<value>,<value>....
SET SESSION sql_mode=<value>,<value>,<value>....
# There are sort of four groups to choose from
Getting rid of silent features, silent conversions and silently allowing invalid data
ALLOW_INVALID_DATES - any date and time is allowed
- 
ERROR_FOR_DIVISION_BY_ZERO - division or modulo 0 functions return NULL with no warnings
- 
NO_AUTO_CREATE_USER - a GRANT statement only creates a new user automatically if a non-empty password is specified
- 
NO_AUTO_VALUE_ON_ZERO - a numeric data type with the AUTO_INCREMENT property will issue the next number in the sequence if 0 or a NULL is inserted
- 
NO_ENGINE_SUBSTITION - an ALTER TABLE or CREATE TABLE that specifies a disabled or unavailable storage engine throws an error
- 
NO_ZERO_DATE - a warning is generated if a date field has a zero date inserted or updated
- 
NO_ZERO_IN_DATE - partial or total zero dates are allowed
- 
STRICT_ALL_TABLES - invalid data values are reject in all tables, an error is thrown
- 
STRICT_TRANS_TABLES - invalid data values are rejected in transactional tables only, an error is thrown
Other changes to default behavior
- 
HIGH_NOT_PROCEDENCE - the NOT operator has a higher precedence
- 
IGNORE_SPACE - allows a space between a built-in function and the open parenthesis
- 
NO_BACKSLASH_ESCAPES - the backslash becomes a ordinary character
- 
NO_DIR_IN_CREATE - ignores options DATA DICTIONARY and INDEX DICTIONARY when using the CREATE TABLE statement
- 
PAD_CHAR_TO_FULL_LENGTH - the behavior of retrieving a fixed-width string from a table is changed
Portability
- 
ANSI QUOTES - a double quote is now treated as an identifier quote
- 
NO_FIELD_OPTIONS - the output of SHOW CREATE TABLE will not display any field definition options and properties
- 
NO_KEY_OPTIONS - the output of SHOW CREATE TABLE will not display any index definition options and properties
- 
NO_TABLE_OPTIONS - the output of SHOW CREATE TABLE will not display any table definition options and properties
- 
NO_UNSIGNED_SUBSTRACTION - the result of a subtraction is always a signed numeric value
- 
ONLY_FULL_GROUP_BY - a GROUP BY query requires the fields in the SELECT and HAVING clauses to contain only aggregated fields and the fields in the GROUP BY clause
- 
PIPES_AS_CONCAT - || is set as an alias for OR
- 
REAL_AS_FLOAT - REAL is an alias for DOUBLE
Act like other database systems (this are self explanatory)
- 
ANSI
- 
DB2
- 
MAXDB
- 
MSSQL
- 
MYSQL323
- 
MYSQL40
- 
ORACLE
- 
POSTGRESQL
- 
TRADITIONAL
- 
By default MySQL will allow you to enter invalid data and will change it to make it valid, this of course means that is may invalidate data
integrity, lets see an example
invalid data entry
create table test_sql_mode (
  sm1 tinyint not null
);
## Lets enter some valid data
insert into test_sql_mode (sm1) values (126);
insert into test_sql_mode (sm1) values (127);
## Lets enter some invalid data, remember a tinyint values are -128 to 127
insert into test_sql_mode (sm1) values (128);
## Did we get any warning
show warnings;
## Lets see whats in the table, as you can see the last value we inserted was truncated
select * from test_sql_mode
As you can see in the example above, values that are too large to fit in a field are truncated to the closest value that does fit, similarly for
string data if they are too large. So what you need MySQL is to throw an error instead of a warning this were the sql_mode comes into play.
Using NULL
You have to be careful when using NULL values in tables, something's to beware of are
A field that allows a NULL uses more storage space and more resources to process storage, retrieval, comparisons and calculations
- 
Most operators and functions are not NULL safe and may return NULL if one side has a NULL value
- 
Aggregate functions sum(), count(), min(), max() and avg() ignore NULL
- 
NULL values make field and index statistics more time consuming to calculate
- 
Only MyISAM, InnoDB and MEMORY storage engines support NULL
- 
NULL appear first in ascending sorts and last in descending sorts
- 
Remember that NULL means no value has been determined it does not mean zero or an empty field, it means unknown.
Optimal Data Types
Using the PROCEDURE ANALYSE statement you can obtain the table information regarding used space on each field, this will be displayed in
the optimal_fieldtype field of the output, you may then want to reduce certain columns to optimize them, when analyzing tables make sure that you
have a good sample size.
optimal data types
# The PROCEDURE ANALYSE takes two options
The first argument is the maximum numbers of values to consider
- 
The second argument is the amount of memory in bytes to use per field to determine an optimal data type
- 
## Lets create a simple table using a high value for varchar thus we will be wasting space
