# Storage engines

> Source: `MySql_Notes.pdf`, pages 20, 21, 22, 23, 24, 50, 51, 52. These are source-derived notes; verify version-specific commands before using them in a current environment.


.MYD
the data file
.MYI
the index file
MyISAM has the following features
Non-transactional
- 
No foreign key support
- 
FULLTEXT indexes for text matching
- 
No data cache
- 
Index caches can be specified by name
- 
Implements both HASH and BTREE indexes
- 
Table level locking
- 
Very fast read activity, suitable for data warehouses
- 
Compressed data (with myisampack)
- 
Online backup with mysqlhotcopy
- 
Maximum of 64 indexes per table
- 
You can set a number of parameters within the my.cnf configuration file that relate to the MyISAM engine
key_buffer_size
Determines the size of the memory cache used for storing MyISAM indexes, the default is 8MB and the maximum is 4GB
concurrent_insert
Determines the behavior of concurrent inserts
0 - disables concurrent inserts
- 
1 (default) - concurrent inserts with no data gaps are enabled
- 
2 - concurrent inserts with data gaps are enabled
- 
delay_key_write
Delays updating indexes for MyISAM tables until table are closed.
ON (default) - MyISAM tables that have delay_key_write option defined will delay index updates
- 
OFF - disable delayed index writes entirely
- 
ALL - enable delayed index writes entirely
- 
max_write_lock_count
Determines how many writes to a table take precedence over reads, this helps with read starvation due to constant writes to a table, the default is 4294967295 I will cover this more
in SQL Extensions section.
preload_buffer_size
Determines the size of the buffer used for index preloading of the key cache, the default is 32KB.
There are three utility programs that can be used with MyISAM tables
myisamchk
Used to analyze, optimize and repair tables, to avoid data corruption you should shutdown mysql when performing any of the below actions.
# check a table
myisamchk /var/lib/mysql/<table_name>.MYI
# Repair a table
myisamchk -r /var/lib/mysql/<table_name>.MYI
myisampack
used to create compressed, read-only tables, to avoid data corruption you should shutdown mysql when performing any of the below actions.
# compress a table
myisampack <table_name>.MYI
# Rebuild the indexes for optimal performance
myisampack --rq --sort-index -analyze <table_name>.MYI
myisam_ftdump
used to display information about fulltext fields in tables
# First you need the program to analyze, use show create table command
show create table employees\G
# Now you can dump the table, notice the index number at the end,
myisam_ftdump employees 1
The Merge Storage engine as it is related to the MyISAM one, it is actually a sort of wrapper around MyISAM tables with the same schemas. All underlying tables can be queried at once by querying the
Merged table. This is one way on how to implement partitioning in MySQL, the merged tables use the same buffers and configurations as the underlying MyISAM tables. Two files are
created .frm file contains the table format and the second file .MRG contains the names of the underlying MyISAM tables, as a side note you cannot use the replace statement with merged tables.
The benefits of merged tables are better management of tables and better performance, using merged tables with smaller underlying tables not only speeds up these operations because of the smaller
table size but it will allow you to rotate out the table from use by modifying the merge table definition to exclude it while maintenance is occurring.
InnoDB is now the default storage engine in MySQL, it has the following key features
Transactional support provided by MVCC (Multi Version Concurrency Control)
- 
Row-level locking
- 
Foreign key support
- 
Indexing using clustered B-tree indexes
- 
Configurable buffer caching of both data and indexes
- 
Online non-blocking backup through separate commercial backup program
- 
With the Innodb storage engine you have control of the format and the location of the tablespace, a tablespace is a logical group of one or more
data files in a database (yes the same as in Oracle), using parameters you can control the path the home directory and if you want to use separate
files or a shared tablespace.
innodb_data_file_path
Determine both the path to individual centralized data files (shared tablespace) and the size of the files
innodb_data_home_dir The common part of the directory path for all InnoDB data files
innodb_file_per_table
If enable then any InnoDB tables will be using their own .idb file for both data and indexes rather than in the shared tablespace
The full path to each shared tablespace is formed by adding innoDB_data_home_dir to each path specified in the innoDB_data_file_path, the file sizes
can be specified in K, M or G. By default if innoDB_data_file_path is not specified a 10MB ibdata1 file is created in the data directory (datadir).
You cannot just move the data files from one system to another like you can in the MyISAM engine.
There are a number of configuration parameters that you can use with the InnoDB storage engine
innodb_buffer_pool_size
Determines the size of the buffer that the Innodb storage engine uses to cache both data and indexes
innodb_flush_log_at_trx_commit Configures how often the log buffer is flushed to disk
0 - log buffer is written every second
- 
1 - every commit will make the log buffer flush
- 
2 - basically is a combination of 0 and 1
-

---


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


This is a totally different way of setting up a database to other databases like Oracle where there is only one engine.
Lastly the MySQL data dictionary is stored in the mysql database, a view only copy is stored in the information_schema database, it is a simple set
of tables.
Accessing MySQL
We have both commandline and GUI tools that allow you to access the mysqld daemon, prefer the commandline tool mysql it has a number of options.
mysql Connect String
mysql
mysql -u app_user -h mysqldb -p[REDACTED] <database>
Note: when entering the password make sure there are no space between the password and the -p, if you don't specify a password then you will be prompted for
one.
mysql command
options
-u or --user
You can specify a specific user
-p or --password
You can enter the users password
-h or --host
You can select a particular host which should have a running MySQL daemon
-S or --socket
You can select a particular socket, if on the same server as MySQL, then by default you would use the /tmp/mysqld.sock
-D or --database
You can select a particular database you want to connect too, you can specify the database without using these options as in the example above
-V or --version
obtain the version number
-v or --verbose
display more verbose output, good for tracking down problems when the connect string is not working
--delimiter
change the default delimiter which is a semi-colon (;)
--p[REDACTED]
You can select a different protocol to use
Unix - Socket or TCP
- 
Windows - TCP, PIPE or MEMORY
- 
You also have the option to feed in either a sql file or sql commands from the commandline.
mysql and sql commands
mysql -u app_user -h mysqldb -p[REDACTED] <database> -e "select * from mysql"
mysql -u app_user -h mysqldb -p[REDACTED] <database> < sql_commands.sql
Once you have connected to MySQL, there are a number of useful commands
List all commands
help
\h
?
List databases
show databases;
Select a particular database
\u mysql
use mydatabase
Change the delimiter
\d @
delimiter @
Change the output to vertical
# Just put a \G at the end of the select statement instead of the normal delimiter
select * from tables\G
Run a shell command
\! uptime
list connected database and user
select user(), database();
Lastly there are a number of GUI tools that do the same thing as above, I prefer the commandline but some people prefer a GUI, here are some that
you can download and try
SQLyog
- 
phpMyAdmin
- 
MySQL Query Browser
- 
MySQL Administrator
- 
MySQL Workbench
-

---

![Image extracted from original PDF page 23](images/pdf-page-23-image-1.jpeg)

---


Innodb Engine -    It's a Trsactional support Engine
It has low level locking.
.frm, .ibd
1.
2.
3.
Storage Engine
Friday, July 23, 2021
10:01 AM

---

![Image extracted from original PDF page 50](images/pdf-page-50-image-1.png)

---


4.
MyISAM Engine
It's a non-txn support engine
Read only environment
Has table level locking
.frm,.MYD,.MYI files will generate
Memory Engine
-- Storing the data in the memory
-- It's a non-txn support engine
-- No locking mechanism

---

![Image extracted from original PDF page 51](images/pdf-page-51-image-1.png)

---


Merge Engine.
CSV Storage Engine

---

![Image extracted from original PDF page 52](images/pdf-page-52-image-1.png)

---

![Image extracted from original PDF page 52](images/pdf-page-52-image-2.jpeg)
