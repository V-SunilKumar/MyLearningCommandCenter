# Indexes and constraints

> Source: `MySql_Notes.pdf`, pages 35, 36, 37, 38. These are source-derived notes; verify version-specific commands before using them in a current environment.


create table accounts (
  accountid int,
  accountname varchar(255)
);
## Now insert some data, the data will be well within the limits of the varchar
insert into accounts values (1,'Company one LTD');
insert into accounts values (2,'Company two LTD');
insert into accounts values (3,'Company three LTD');
insert into accounts values (4,'Company four LTD');
insert into accounts values (5,'Company five LTD');
insert into accounts values (6,'Company six LTD');
insert into accounts values (7,'Company seven LTD');
insert into accounts values (8,'Company eight LTD');
insert into accounts values (9,'Company nine LTD');
insert into accounts values (10,'Company ten LTD');
insert into accounts values (11,'top shop inc 11');
insert into accounts values (12,'top shop inc 12');
insert into accounts values (13,'top shop inc 13');
insert into accounts values (14,'top shop inc 14');
insert into accounts values (15,'top shop inc 15');
insert into accounts values (16,'top shop inc 16');
insert into accounts values (17,'top shop inc 17');
insert into accounts values (18,'top shop inc 18');
insert into accounts values (19,'top shop inc 19');
insert into accounts values (20,'top shop inc 20');
insert into accounts values (21,'top shop ltd');
insert into accounts values (22,'top shop plc');
insert into accounts values (23,'top shop inc');
insert into accounts values (24,'top shop partners');
insert into accounts values (25,'top shop corp');
insert into accounts values (26,'bottom shop ltd');
insert into accounts values (27,'bottom shop plc');
insert into accounts values (28,'bottom shop partners');
## Lets insert some NULL's
insert into accounts values (29,NULL);
insert into accounts values (30,NULL);
## Lets insert some empty fields
insert into accounts values (31,'');
insert into accounts values (32,'');
## Now run the procedure analyse and see what we get, from the output we can see the NULL,s and the
## empties fields, also the analyzer has picked up that the size of the accountname fields is too large
## and recommended's we shrink the size (see the Optimal_fieldtype). Normally I would add on a few bytes
## to make sure just in case a longer company name comes along. Other information is the min and max
## values
## One note is that if you increase the first argument to the procedure analyze eventually MySQL
## recommended's that you use a enum data type, this is because you are asking for more values to
## consider
select * from accounts procedure analyse(5,256) \G
*************************** 1. row ***************************
Field_name: datadisk.accounts.accountid
Min_value: 1
Max_value: 32
Min_length: 1
Max_length: 2
Empties_or_zeros: 0
Nulls: 0
Avg_value_or_avg_length: 16.5000
Std: 9.2331
Optimal_fieldtype: TINYINT(2) UNSIGNED NOT NULL
*************************** 2. row ***************************
Field_name: datadisk.accounts.accountname
Min_value: bottom shop ltd
Max_value: top shop plc
Min_length: 12
Max_length: 20
Empties_or_zeros: 2
Nulls: 2
Avg_value_or_avg_length: 14.1667
Std: NULL
Optimal_fieldtype: VARCHAR(20)
2 rows in set (0.03 sec)
This tool can be useful if you are planning to migrate to a new system and want to reduce table column sizes so that not to waste space, if you
already have a system you can always alter the table providing it is not to large or you have an enough time to alter the table. Be careful when
using the procedure analyse function it does not always get it right, sometimes you are the best person to know what is right for your data
optimization as you would know the data.
Table Maintenance
There are a number of tasks that you can perform on an tables and indexes which are available in MySQL
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
check table
check table tablename [option]
## You can use one of the following options
EXTENDED - performs a full lookup on all keys and indexes, checking for 100% consistency
- 
MEDIUM - for evey table calculate a checksum for the indexes on each data row, comparing the final result to the checksum of the index rows, also verify
that deleted liniks are valid
- 
CHANGED - only check a table if it has changed since the last time is was checked, or of the table was not closed properly, if checks are performed they
are the same as MEDUM
- 
FAST - only check if the table was not closed properly, if checks are performed they are the same a MEDIUM
- 
QUICK - for evey table calculate a checksum for the indexes on each data row, comparing the final result to the checksum of the index rows, without the
verifcation for deleted links
- 
FOR UPGRADE - checks to see if the table is out of date due to a server upgrade, a MEDIUM check will be performed
- 
repair table
repair table tablename [option]
## You can use one of the following options
QUICK - only repair of the index tree is attempted
- 
EXTENDED - instead of attempting to fix indexes by doing a REPAIR BY SORT on one entire index at a time, the index is rebuilt one row at a time
- 
USE_FRM - uses the .frm file to rebuilt the index, disregarding the existing .MYI index file
- 
checksum
table
checksum table tablename [option]
## You can use one of the following options

---


QUICK - returns the live checksum if supported by the table, otherwise returns NULL
- 
EXTENDED - calculates a checksum of the table even if the live checksum is supported
- 
analyze table
analyze table tablename
optimize table
optimize table tablename

---


SQL theory states that a key is a data constraint, for example a unique key or foreign key, it also provides access to a limited set of data more
quickly. Constraints can be applied to a single data field or to more than one data field.
simple key
a key constraint or index applied to one data field
composite key a key constraint or index applied to more than one data field
surrogate key
a unique key that is a meaningless number, normally a ID key
There are a number of different types of constraints and index which I will discuss throughout this section
constraints UNIQUE KEY, PRIMARY KEY and FOREIGN KEY
indexes
INDEX, FULLTEXT INDEX, SPATIAL INDEX
you also have UNIQUE KEY and PRIMARY KEY which are also constraints
To constraint data we use the UNIQUE KEY, PRIMARY KEY and FOREIGN KEY, data is check during an insert or an update. unique keys and primary keys
protect against duplicating, the difference being that you can have only one primary key and NULL's are not allowed for a primary key. A foreign
key is like a check where the data must be in another table, there is no check constraint in MySQL.
creating constraints
alter table tablename add unique key key_name (col1,col2..)
alter table tablename add primary key key_name (column)
create unique index index_name on tablename (col1,col2..)
Note: you can create constraints when creating the table which is known as in-line - see below examples
dropping constraints
drop index index_name on tablename
alter table tablename drop foreign key key_name
constraints examples ## creating the constraints all on one line (known as in-line)
  create table test_cons (
  rowid int PRIMARY KEY AUTO_INCREMENT,
  uniqkey1 int UNIQUE KEY
);
## Now lets use the out-of-line example to create the constraints and give them meaningful names
create table other_table (
  other_column int primary key
);
create table test_cons2 (
  rowid int,
  uniqkey1 int,
  uniqkey2 int,
  uniqkey3 int,
  foreign_id int,
  PRIMARY KEY (rowid),
  constraint UNIQUE KEY simple_key (uniqkey1),
  constraint UNIQUE KEY composite_key (uniqkey2,uniqkey3),
  constraint fk_foreign_id FOREIGN KEY (foreign_id) REFERENCES other_table(other_column)
);
## Seeing the results, first a quick look at the table, notice the key column
mysql> desc test_cons2;
+------------+---------+------+-----+---------+-------+
| Field      | Type    | Null | Key | Default | Extra |
+------------+---------+------+-----+---------+-------+
| rowid      | int(11) | NO   | PRI | 0       |       |
| uniqkey1   | int(11) | YES | UNI | NULL    |       |
| uniqkey2   | int(11) | YES | MUL | NULL    |       |
| uniqkey3   | int(11) | YES |     | NULL    |       |
| foreign_id | int(11) | YES | MUL | NULL    |       |
+------------+---------+------+-----+---------+-------+
5 rows in set (0.00 sec)
## Here you can see in detail the key names what columns the indexes are on and sequence number of the key (if you have a composite key)
## also you can see the type of index, if I had any data in the table I would be able to see the cardinality
mysql> show indexes from test_cons2;
+------------+------------+---------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| Table      | Non_unique | Key_name      | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type |
+------------+------------+---------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| test_cons2 | 0          | PRIMARY       | 1            | rowid       | A         | 0           | NULL     | NULL   |      | BTREE      |
| test_cons2 | 0          | simple_key    | 1            | uniqkey1    | A         | 0           | NULL     | NULL   | YES | BTREE      |
| test_cons2 | 0          | composite_key | 1            | uniqkey2    | A         | 0           | NULL     | NULL   | YES | BTREE      |
| test_cons2 | 0          | composite_key | 2            | uniqkey3    | A         | 0           | NULL     | NULL   | YES | BTREE      |
| test_cons2 | 1          | fk_foreign_id | 1            | foreign_id | A         | 0           | NULL     | NULL   | YES | BTREE      |
+------------+------------+---------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
5 rows in set (0.00 sec)
Speed
Indexes are data structures, they can either be B-tree, R-tree (only available for indexes on SPATIAL data) or hash data structures. B-tree's are
the most common and is available for all storage engines (except NDB), they are excellent for finding data ranges, hash data structures are for
finding exact matches or a series of exact matches.
You generally create indexes on the most common fields of a table that are used, if no index exists a full table scan is performed which can be
an expensive operation in terms of I/O, using an index reduces the amount of data that has to be search and thus reduces the I/O operation. Think
of it in terms of a reading book it's easy to lookup something in the index and find the page number than to search through the whole the book
trying to find what you are looking for, hence why lots of books have indexes at the back.
Data constraints are particularly good candidates for indexes, they enable you to perform very quick lookups on data. FULLTEXT INDEX and SPATIAL
INDEX create special data structures designed to easily perform text matching and spatial data searching.
Indexes are always kept current in MySQL, when an update, insert or delete occurs within the table the index must change too, so if your table
has many writes creating an index may reduce performance, this is the tradeoff for faster data lookups is slower data updates, in other words if
the table has lots of write keep the indexes to a minimum. Also check that columns don't have two indexes on the same information, remember both
indexes will have to be maintained.
Indexes
The MySQL optimizer uses the leftmost prefix when it deciding to use an index, what this means is that if you create a composite key your query
should contain the leftmost column of the index otherwise the index would not be used, for example lets say you create a composite key with the
columns (A,B,C) the optimizer would use the index where the query where clause would have the following
Indexes
Wednesday, July 28, 2021
5:32 PM

---


A, B, C
- 
A,B
- 
A,C
- 
A
- 
The index would not be used if you query only contained the following in the where clause
B,C
- 
B
- 
C
- 
Just remember this when creating composite keys, Oracle does have a feature called index skip-scan which can use the rightmost keys.
I have already created some constraints above which as you know will create indexes, now lets create some indexes just for data retrieval
performance, in other words that are not for data integrity.
creating
create index employee_idx on employees (fname, lname);
alter table add index employee_idx on employees (fname, lname);
## if creating a blob or text data type you need to specify a prefix
create index employee_idx on employees (lname(40));
## specifying different index types
create index employee_idx on employees (lname) using BTREE;
create index employee_idx on employees (lname) using HASH;
Note: when using the create statement a index name is required, however when using the alter table to create an index no index name is required and thus the server will
automatically create one for you.
dropping
drop index employee_idx on employees;
alter table drop index employee_idx on employees;
displayin
g
show indexes from employees;
A point to remember is that if you using the alter table to create an index it will obtain a write-lock on the entire table, making it unable to
be updated for the duration of the alter table statement, this could be a long time depending on the size of the index being created.
All Btree indexes are stored in ascending order only, numbers are stored in numerical order and strings are stored in lexical order according to
the string collation being used. The ordering of an index is critical because it is optimized for scanning sequentially, it can only be used to
find the next value not the previous value. It is possible to use the DESC keyword when creating an index but it will be ignored and the index
created in ascending order. String indexes allow you specify a length for the index value, this is known as an index prefix and may be used with
any string type, it is required for blob or text data types.
Foreign Key Constraints
You change change the behavior on the referenced foreign table (parent) if an update or delete statement tries to change the existing data on the
parent table, the server can cascade the change to the corresponding records in the referencing (child) table, or the server can reject the
change.
RESTRICT - changes to data that reference existing foreign keys will be rejected and will not occur in both parent and the child table, for
an example you don't wish to delete any billing records that you need to keep them for tax purposes
- 
CASCADE - changes to data that reference foreign keys will be cascade, if the parent table data is updated the child table data will also be
updated, for example a user wishes to their name which you want to be propagated
- 
SET NULL - this is the same as cascade except that when a delete occurs, records in the child table will not be removed, they will be set to
NULL instead
- 
NO ACTION - this is the same as restrict
- 
Both on update and on delete are optional, if no option is given then restrict is the default. When referencing a foreign key that key must have
an index build on it other you will receive an error, they also must have similar data types. The following requirements are require to create a
foreign key
The reference table must exist
- 
The reference fields must exist
- 
Both tables must be InnoDB tables
- 
Both tables must not be temporary tables
- 
The fields in both tables must have similar data types
- 
The reference fields must be the first fields in an index on the referenced table
- 
The referencing fields must be the first fields in a index on the referencing table
- 
For examples on creating a foreign see above in the constraint examples
Index Maintenance
There is a limited number of tasks that you can perform on an indexes in MySQL, most of the index maintenance tasks are normally performed on the
table itself see Table Maintenance
disable/enable keys
alter table tablename disable keys;
alter table tablename enable keys;
