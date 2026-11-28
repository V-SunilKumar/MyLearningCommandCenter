# MySQL language extensions and deviations

> Source: `MySql_Notes.pdf`, pages 27, 28, 29, 30. These are source-derived notes; verify version-specific commands before using them in a current environment.


An administrator should have the basic knowledge of the following even if he is not going to be developing
How MySQL extends the SQL language
- 
Data Types
- 
Indexes
- 
Stored routines, triggers and events
- 
Views
- 
Transactions
- 
MySQL does not completely follow the SQL standard (ANSI/ISO SQL:2003 standard) and has it's own extensions and deviations. Th e reason for the
extensions is to make the system easy to use.
We start with some of the rules of the SQL language which relate to the following
Comments and portability
- 
Case-sensitivity
- 
Escape characters
- 
Naming limitations
- 
Quoting
- 
Time zones
- 
Character sets and collations
- 
MySQL has a clever extension that manages portability, you can use the MySQL version as part of a comment, it will only be pa rsed if
the mysqld server is the appropriate version, otherwise it will left as a comment and ignored by the database.
single line comment
-- this is a single line comment
multi-line comment
/* this is
a multi-line
comment */
parse the comment line
## Note the bang character
/*! show databases */
parse the comment line for a specific version
## the below only runs on MySQL 4.1.1 or higher
/*!40101 show databases */
first digit            = major version
second & third digit   = minor version
last two digits        = revision number
Like all databases SQL reserved words are written in uppercase (SELECT, FROM, NULL, etc), however they are all case-insensitive so SELECT, Select
and select are all the same, mysqld in general is case-insentive with respect to names of fields, indexes, stored routines and events, However
information is stored on the filesystem which is case-sensitive in the Unix world but not in the windows world in which case the following maybe
affected
Databases
- 
Tablespaces
- 
Tables
- 
Views
- 
Aliases
- 
Triggers
- 
log file groups
- 
You can change the default behavior by using the global system variable lower_case_table_names.
lower_case_table
_names
when set to 0, table and database names are stored using the case specified in the create statement, in queries table names, table aliases and database names are case-sensitive, this is the default
on unix systems.
when set to 1, table and database names are stored using lowercase, in queries table names, table aliases and database names are case-insensitive they are converted into lowercase by mysqld, this
is the default on windows systems.
when set to 2, table and database names are stored using case specified in the create statement apart from the Innodb tables names which are stored in lowercase , in queries table names, table
aliases and database names are case-insensitive they are converted into lowercase by mysqld, this is the default on Mac OS X systems.
The escape character is the backslash (\) and as such an escape sequence is a backslash followed by one character for example \P and \u these are
then interpreted by mysqld, there are a number of escape sequences that are independent of the mysql commands.
escape sequences
\\ prints a \ character
- 
\' prints a single quote
- 
\" prints a double quote
- 
\_ print the underscore character
- 
\% prints the percentage character
- 
\b prints the backslash character
- 
\r and \n prints a carriage return and newline
- 
\t prints a tab separator
- 
\0 and \Z prints ASCII 0 (NULL) and ASCII 26 (Ctrl-Z)
- 
Identifiers are names of databases, tables, views, fields, indexes, tablespaces, stored routines, triggers, events, servers, log file groups and aliases, they are limited to to 64 characters except for aliases
which are limited to 255 characters, you must not end a identifier with a space. You can use reserve words, numbers and punctuation but they must be surrounded by double quotes, however I try
never to use the above as it always causes problems in the end, keep it simple and don't try to be too clever by using fancy names, to be honest this is pretty much the same with all other databases.
MySQL has the normal dot notation which can be used to specify a database when referring to a table
dot notation ## here I specify the database as information_schema and the table as tables
select * from information_schema.tables;
Time zones can be a complex subject and can become confusing, when mysqld starts it determines the time zone of the operating system and sets
Extensions and Deviations
Saturday, July 24, 2021
4:29 PM

---


the system_time_zone system variable accordingly, by default it sets the value of time_zone to SYSTEM, which means that it operates using the time
zone in system_time_zone.
Fields with a timestamp value are converted to UTC and stored, when retrieved hey are converted to the time_zone value. Date,
Time and Datetime fields are not converted and stored as UTC.
MySQL supports may different character sets and collations. A character set is the set of available chracaters that can be used, similar to the alphabet. The default character set is Latin1 which
includes all the character of the Latin languages.
The different levels to which the character set and collations can be set are
Server
The system variables character_set_server and collation_server specify the default character set and collation for the database when you do not use the character set or collation clauses with the create
database command.
Databas
e
The system variables character_set_server and collation_server specify the default character set and collation for the current database, these are set with the character set and collation clauses of the create
database and alter database commands. The character set and collation are used by load data infile and specify the default character set and collation for a table when create table command is used.
Table
A create table or alter table <tablename> add column command can use a character set or collation clause, which will set for a field with no character set or collation specified.
Field
You can sepcify a character set and collation for fields that are data type, char, varchar, tinytext, text, meduimtext or longtext.
String
You can set a character set or collation for a string sent via the current connection, for example a string as the one in "select hi" will be returned with the character set and collation specified by
the character_set_connection and collation_connection system variables.
MySQL Deviations
MySQL has tried to keep to the standard ODBC SQL standard and the ANSI standard, however like all other databases MySQL has i ts own set of features
that differs from other databases and the standards. Here is a table listing the major differences in MySQL
Storage Engine
Each table is an instantiation of a storage engine, different tables can have different storage engines, different storage engines function differently with regard to erformance, ACID compliance,
supported features and more.
Errors
MySQL makes attempts to make sense of what should throw an error, by default mysqld will truncate invalid data that its too large for a data type, it implicity converts data and more.
The sql_mode server variable can be set to change this type of behavior.
String comparison
Strings are compared in the order determined by the collation, unless you use the binary() function using a cast.
Data Types
see Data Types sections
Index Types
see Index Types sections
Foreign key
constraints
MySQL accepts foreign keys constraints in table definitions but only tables using transactional storage engines (InnoDB and falcon), all other storage engines will disregard foreign key constraints
without producing an error.
You can turn off foreign key checking by using the system variable foreign_key_checks (0=off, 1=on)
String
There are a number of string related differences
The || string concatention is not supported, use the funcation concat() instead.
- 
no support for create assertion and drop assertion
- 
no support for cube and grouping sets
- 
no support for rank, dense_rank, percent_rank, cume_dist
- 
no suport for static cursors
- 
no support domain or domain constraints
- 
no support for sequences
- 
no suport for embedded declarations
- 
no support for recursive queries
- 
Privileges and
Permissions
MySQL uses the standard grant and revoke for privileges and permissions, here are some differences to be aware of
there is no with admin option, instead you have the super privilege and the with grant option can be specified to allow a user to grant any subset of privileges that user has to another user
- 
no support for the granted by or with hierarchy option
- 
no roles support
- 
the usage privilege is implicity granted by the command create user
- 
drop user will revoke all privileges including usage
- 
there are no character set or collation privileges
- 
Transaction
management
You can only use transactions in the InnoDB and Falcon storage engines, you start a transaction using the start transaction command, there are no options to this command. The transaction modes
are
ISOLATION LEVEL iso_level
- 
READ ONLY
- 
READ WRITE
- 
DIAGNOTICS SIZE
- 
Check Constraints
MySQL does not support check constraints other than those implemented by specifying data types, foreign key constraints and unique key constraints.
You can create a check contraint but it will be ignored by all storage engines.
Upsert statements
MySQL does not support upsert statements with the standard SQL merge statement, it has limited support when using with the on duplicate key update clause to an insert statement.
MySQL Extensions
There are a number of extensions, options, parameters and general awareness regarding MySQL, for example the show command makes life easier than having to query the information_schema.
Aliases
these are the additional aliases extensions
begin and begin work are aliases for start transaction
- 
drop prepare stmt_prep is an aliase for deallocate prepare stmt_prep
- 
explain tbl_name is an alias for show columns from tbl_name
- 
num1 % num2 is the same as mod(num1,num2)
- 
Alter table
the alter table pretty much does all that create table does, you can perform some commands while the table is online and some when the table is offline
Online
add index and drop index for variable-width indexed fields
- 
renaming a field using change column and specifying the same data type
- 
using change column or modifying column to modify the default value for a field
- 
adding items to the end of an enum or set value data type
- 
Offline
add/alter/drop column
- 
add/drop primary/unique/foreign key
- 
add fulltext index
- 
add index
- 
add spatial index
- 
change column
- 
convert to character set
-

---


convert to character set <character set> collation <collation>
- 
disable/enable keys
- 
ignore (this is for duplicate key errors)
- 
modify column
- 
order by
- 
rename
- 
Create
You can use the if not exists extension, which specifies a warning instead of an error should the mysqld not complete the command.
DML
There are also extensions for DML (Data Manipulation Language - insert, replace, update, delete)
ignore any errors are issued as warnings
- 
low_priority does not recieve a write lock and execute the specified DML until all the read locks have been granted and there are no locks waiting in the read lock queue.
- 
limit work on a subset of matching rows
- 
order by specify a specific order
- 
upsert insert/update functionality
- 
delete quick speed up some deletes by not merging index leaves when it changes the index to reflect the records that have moved
- 
truncate to remove quickly all the rows in a table, this does not delete any rows so no delete triggers are invoked
- 
insert delayed specifies that data should be queued for a later batch insertion
- 
load data infile used to load data from a text file created by the select into outfile command
- 
load xml infile load XML data into tables
- 
Drop
Drop has a similar command to create a if exists extension, in other words drop if the object exists
Limit
We mentioned limit above, you can use it to work on a subset of matching rows, and it takes one or two arguements, if one argument is used this it is the number of rows to constrain the output to. If
twp arguments are used the first is the offset and the second is the number of rows to limit
Select
The select statement has a number of options
into outfile, into dumpfile create a text file or dump an entire table into a file
- 
sql_small_result, sql_big_result specify that the result of the query will be small enough that the server can use in-memory temporary tables or that it is too big so use disk-based temorary
tables
- 
union, order by this is the standard command
- 
select ... for update place a write lock on any rows the select statement process for the duration of the transaction
- 
select ... lock in share mode place a read lock on any rows for the duration of the transaction, other reads are premitted
- 
distinctrow this is the standard command
- 
sql_buffer_result means that the result sets are placed into temporary tables, there is a system variable for this called sql_buffer_result
- 
high_priority/low_priority change the behavior of how mysqld chooses to next lock to grant from the read and write lock queues, options are D0, limit, procedure analyse() and explain select
- 
Server
Maintenance
There are a number of server maintenance commands that you can use as an administrator, I will be using these thoughout the whole of the MySQL section
kill kills the query currently running from the thread_id thread
- 
kill connection <thread_id> kill a particular thread (use show processlist to obtain the thread id's)
- 
flush hosts, flush tables, flush status (see accessing MySQL)
- 
flush des_key_file disregard the DES keys currently in memory and load from a file specified by des_key_file
- 
flush logs, flush backup logs (see accessing MySQL)
- 
flush privileges, flush user_resources (see accessing MySQL)
- 
flush tables with read lock will lock the tables and flush MyISAM buffers to disk and close any open file descriptors
- 
flush query cache, reset query cache (see MySQL caching)
- 
reset master, reset slave (see High Availability)
- 
cache index ... in configure MyISAM tables to utilize a named key cache, you have to configure it in the mysql configuration file for example small_cache.key_buffer_size=64M
- 
load index into cache preload one or more tables inot a key cache (see above)
- 
Set
the set extension is used to assign values to variables, you can use the following syntax
set [session|global] @varname:=value
set [session|global] @varname=value
You can use either session varaibles (@@SESSION.<varname>) or global variables (@@GLOBAL.<varname>)
Show
The show extension can obtain metadata information from the information_schema database, you have already seen examples of this in the architecture section, here is a list of the rest I will only
comment to the command is not to obvious
show authors - displays names, locations and authors of MySQL
- 
show binlog events - see replication
- 
show binary logs - see replication
- 
show character set
- 
show collation
- 
show columns - conntains information about table fields
- 
show contributors - displays names, locations and contributors of MySQL
- 
show create [database|event|function|procedure|schema|trigger|view] - display how the object was created
- 
show databases
- 
show [engine|engines]
- 
show errors
- 
show events - dislays database events including the time the event happened
- 
show full tables - same as show tables but with additional column that specifies whether the table is a base table, view or system view
- 
show function code - displays the ordinal position and instructions for each step in a stored function
- 
show function status - displays all functions associated with all databases
- 
show grants
- 
show [index|indexes]
- 
show keys
- 
show master status - see replication
- 
show open tables - display all open tables
- 
show plugins - displays all plugins including storage engine plugins
- 
show privileges - display the name, context and comment about each type of privilege that can be used in a grant statement
- 
show procedure code
- 
show procedure status
- 
show processlist - display the currently running processes in MySQL
- 
show profile - this is a newer command and queries the profiling that can be done on a session-level basis
- 
show schemas - same as show databases
- 
show slave host - see replication
- 
show slave status - see replication
- 
show status - displays the status of the system a good command to start with
- 
show table status
- 
show storage engines
- 
show tables
- 
show triggers
- 
show variables
-

---


show warnings
- 
Table
There are a number of options to add additional features to table
auto_increment - used to increment a field automatically like a sequence number
- 
avg_row_length - used to allocate proper space records
- 
character set
- 
checksum - this will enable a live checksum table, the checksum is updated eveytime the table is updated
- 
collate
- 
comment
- 
connection - used by the federated storage engine
- 
data dictionary
- 
delay_key_write - this will delay index buffer updates until the table is closed and then it will update the index buffer all at once
- 
engine
- 
index dictionary
- 
insert_method - sets how inserts to a merge table should behave
- 
key_block_size - specify the size of the index block
- 
max_rows - used to allocate proper space records
- 
min_rows - used to allocate proper space records
- 
pack_keys - used to compress long index fields
- 
password - not used
- 
row_format - select the type of row format (default, compact, redundant, fixed, dynamic, page and compressed)
- 
union - specifies a comma-separated list of tables that the merge table is a wrapper for
- 
Table
Maintenance
Indexes need maintenance for time to time, there are a number of commands that can help
check table - used to determine if a table is corrupted (options are extended, meduim, changed, fast, quick, for upgrade)
- 
repair table - used to repair a table (options are quick, extended use_frm)
- 
checksum table - obtain a checksum for the table (options are quick, extended), see above for checksum's on tables
- 
analyze table - updates the statistics of a table to help the optimizer
- 
optimize table - resolves data and index fragmentation
- 
See Table Maintenance for more details
Transactional
The list below, all perform a implicit commit without your approval and without informing you, however they are not performedif no changed actually happened
analyze table
- 
alter [database|event|function|procedure|table|view]
- 
backup database
- 
begin, begin work
- 
cache index
- 
check table
- 
create [database|event|function|index|procedure|table|trigger|user|view]
- 
drop [database|event|function|index|procedure|table|trigger|user|view]
- 
flush
- 
grant, revoke
- 
load index into cache
- 
lock tables
- 
rename [table|user]
- 
optimize table
- 
repair table
- 
restore
- 
revoke
- 
set password
- 
start transaction
- 
truncate table
- 
unlock tables
-
