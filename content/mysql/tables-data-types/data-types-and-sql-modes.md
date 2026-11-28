# Data types, character sets and SQL modes

> Source: `MySql_Notes.pdf`, pages 31, 32, 33, 34. These are source-derived notes; verify version-specific commands before using them in a current environment.


Choosing the correct data type can lead to a better performing database, for example comparing numeric types takes less time than comparing
character strings types because character string types have character set and collation considerations, also the smaller the data the faster it
will be processed and less I/O is used making queries perform even better.
MySQL includes many of the ISO SQL 2003 standard data types and adds more data types of its own, the data types can be categorized by the following
Character string types
- 
National character string types
- 
Binary large object string types
- 
Numeric types
- 
Boolean types
- 
Datetime types
- 
Interval types
- 
I am only going to give a quick discussion on each as it is best to refer to the latest MySQL documentation or to a specific version that you have,
I will try and give examples but I do not have examples for every possibility.
MySQL Tables
Before we begin a quick review on how to create a table in MySQL, which can come in a number of flavors
Standard table
create table table_name ( ... );
Temporary table
create temporary table_name ( ... );
Memory table
create table table_name ( ... ) ENGINE = MEMORY;
You can also display how the table was created
Display table construction
show create table table_name;
Just some things that you should be aware of regarding tables
they support automatic numbering and the sequence is a property of the table
- 
you can define a table that is supported by any of the storage engines
- 
there is no support for nested tables
- 
they only support scalar data types which include large object types
- 
only two composite data types are supported enum and set
- 
partitioned tables are supported
- 
three tables types are supported: standard, temporary and MEMORY
- 
Lastly on tables is the contraints which I discuss in my indexes section.
Data Types
We start with character types, I have already discussed data types in my Oracle data types section if you wish to compare.
String Type
Character string type
Size
Example
Fixed-width strings
character(length)
create table string_type (
  fixwidth1 CHARACTER(10) NOT NULL DEFAULT '',
  fixwidth2 CHAR(10) NOT NULL DEFAULT'',
  fixwidth3 CHAR(10) CHARACTER SET utf16 COLLATE utf16_general_ci,
  varilength1 CHARACTER VARYING(10) NOT NULL DEFAULT '',
  varilength2 CHAR VARYING(10) NOT NULL DEFAULT '',
  varilength3 VARCHAR(10) NUL NULL DEFAULT ''
);
char(length)
0-255
variable-length strings character varying(length)
char varying(length)
varchar(length)
0-65,535
tinytext
0-255
text
0-64Kb
meduimtext
0-16Mb
longtext
0-4Gb
Character objects
character largeobject
char large object
CLOB
Remember that the length of the string does not mean the size of the string as this depends on the character set used, for example latin1 character
set uses one byte to store each character whereas the utf8 character set uses up to four bytes per character, double check the MySQL version that
you are using as the number of bytes may vary and could have an impact on the size of your database. The system
parameter pad_char_to_full_length changes the behavior of retrieving fixed-width strings from a table, if set the string is retrieved is the full
length of the field.
find the length of a string and checking the padding
select concat('/',fixwidth1,'/'), char_length(fixwidth1) from string_type;
National character sets are pretty much the same as above except that the character set uses the utf8
String Type
Character string type
Size
Example
Fixed-width strings
national character(length)
create table string_type (
  fixwidth1 NATIONAL CHARACTER(10) NOT NULL DEFAULT '',
  fixwidth2 NCHAR(10) NOT NULL DEFAULT'',
  varilength1 NCHAR(10) NOT NULL DEFAULT '',
);
national char(length)
nchar(length)
0-255
variable-length strings national character varying(length)
Tables & Data Types
Wednesday, July 28, 2021
5:38 PM

---


national char varying(length)
nchar(length)
0-65,535
Character objects
national character largeobject
nchar large object
NCLOB
Binary large objects is the least restrictive data type, they are byte strings and are ordered by each bytes value.
Binary type
Size
Example
binary
0-255
create table string_type (
  bin1 BINARY(100) NOT NULL DEFAULT '',
blob1 BLOB(100) NOT NULL DEFAULT'',
);
varbinary
0-65,532
tinyblob
0-255
blob
0-65,532
meduimblob 0-16Mb
longblob
0-4Gb
Numeric types is probably the most vast, as there are many different types, these types all affect data precision and depending on the application
type this category is the one that you will send more time on, I will categorize them in exact number type and approximate numeric type
Numeric Type Type
signed range
unsigned range
Size (bytes) Example
Exact
numeric(g,f) maximum limits depend on the hardware and O/S
max for g = 65, max for f = 30
depends
create table num_test (
  bt1 BIT(10),
  fl1 FLOAT(10),
  dl DECIMAL(5,4),
  uty1 TINYINT(10) unsigned NOT NULL AUTO_INCREMENT
);
decimal(g,f)
maximum limits depend on the hardware and O/S
max for g = 65, max for f = 30
depends
smallint
-32,768 to 32,767
0 to 65,535
2
integer
-2,147,483,648 to
2,147,483,647
0 to 4,294,967,295
4
bigint
-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
0 to 18,446,744,073,709,551,615
8
tinyint
-128 to 127
0 to 255
1
meduimint
-8,388,608 to 8,388,607
0 to 16,777,215
3
bit(x)
1 to 64
1-64
serial
alias for BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE KEY
n/a
approximate
float(p)
maximum limits depend on the hardware and O/S
max for p = 24
4
real
alias for DOUBLE or FLOAT
n/a
double(g,f)
maximum limits depend on the hardware and O/S
max for g = 53
max for f = 30
8
Boolean data types have two options the standard BOOLEAN and the MySQL version called BOOL which is an alias for TINYINT(1);
Datetime types have the following, you can specify any of the valid dates as below
YYYY-mm-dd HH:ii:ss
- 
yy-mm-dd HH:ii:ss
- 
yyyymmdd
- 
yymmdd
- 
YYYYmmddHHiiss
- 
yymmddHHiiss
- 
you can also put microseconds in as well
append .uuuuuu
- 
Datetime type Range
Size (bytes)
Zero value
date
'1000-01-01' to '9999-12-31'
3
'0000-00-00'
datetime
'1000-01-01 00:00:00' to '9999-12-31 23:59:59'
8
'0000-00-00 00:00:00'
timestamp
'1970-01-01 00:00:00' to '2038-01-18 22:14:07'
4
'0000-00-00 00:00:00'
time
'-838:59:59' to '838:59:59'
3
'00:00:00'
year(2)
00 to 99
1
'00'
year(4)
1901 to 2155
1
'0000'
You need to be aware of a number of date, time and numeric conversion issues, here I point you to the MySQL documentation.
Lastly we come to the interval data types, these strictly speaking are not data types that can be stored in a table, they are used as part of an
expression in a time based calculation.
Interval expressions
# below would translate to '2012-04-08'
select date_add('2012-03-08', interval 1 year_month) as test;
# below would translate to 2017-07-08
select date_add('2012-03-08', interval '5-4' year_month) as test;
Interval data types
Name
Format
Example
microsecond
n
INTERVAL 5 MICROSECOND
second
n
INTERVAL 5 SECOND

---


minute
n
INTERVAL 5 MINUTE
hour
n
INTERVAL 5 HOUR
day
n
INTERVAL 5 DAY
week
n
INTERVAL 5 WEEK
month
n
INTERVAL 5 MONTH
quarter
n
INTERVAL 5 QUARTER
year
n
INTERVAL 5 YEAR
second_microsecond
'n.n'
INTERVAL '5.4' SECOND_MICROSECOND
minute_microsecond
'n.n'
INTERVAL '5.4' MINUTE_MICROSECOND
minute_second
'n:n'
INTERVAL '5:4' MINUTE_SECOND
hour_microsecond
'n.n'
INTERVAL '5.4' HOUR_MICROSECOND
hour_second
'n:n:n'
INTERVAL '5:4:3' HOUR_SECOND
hour_minute
'n:n'
INTERVAL '5:4' HOUR_MINUTE
day_microsecond
'n.n'
INTERVAL '5.4' DAY_MICROSECOND
day_second
'n n:n:n'
INTERVAL '5 4:3:2' DAY_SECOND
day_minute
'n n:n'
INTERVAL '5 4:3' DAY_MINUTE
day_hour
'n n'
INTERVAL '5 4' DAY_HOUR
year_month
'n-n'
INTERVAL '5-4' YEAR_MONTH
ENUM and SET types
MySQL has two data types that are very different to the above data types, they are similar to foreign keys in that the values inserted must be one
of the field values set
ENUM
this is a enumerated list of 1 to 65,535 strings which indicate the allowed values for the field, only one of the values can be stored in the list
SET
this is a enumerated list of 1 to 64 strings which indicate the allowed values for the field, any combination of the strings in the enumerated list can be stored as a comma-delimited list.
All trailing spaces will be removed from enum and set data types, the system parameter sys_mode can affect the data types, see below for more
information on sql modes.
sql_mode system
parameter
This parameter affects both the enum and set data types, if the parameter is set to any of the below then an error will occur if a duplicate entry during a field creation, otherwis e you will
get a warning
TRADITIONAL
- 
STRICT_ALL_TABLES
- 
STRICT_TRANS_TABLE
- 
here are some examples on how to use these data types
ENUM example
Example One
=====================================================
CREATE TABLE Countries (
  name char(30),
  continent ENUM('Asia', 'Europe', 'North America', 'Africa', 'Oceania','Antarctica', 'South America')
);
INSERT INTO Countries (name,continent) VALUES('Kenya','Africa');
INSERT INTO Countries (name,continent) VALUES('England','Europe');
INSERT INTO Countries (name,continent) VALUES('Brazil','South America');
select name,continent,continent+0 'Index position' from countries;
Example Two
=====================================================
CREATE TABLE Bike
(
  ID SMALLINT UNSIGNED,
  Model VARCHAR(40),
  Color ENUM('red', 'blue', 'green', 'yellow'),
  Options SET('rack', 'light', 'helmet', 'lock')
);
insert into bike values ('0001', 'chopper', 'red', 'rack,light');
insert into bike values ('0002', 'tomahawk', 'blue', 'lock,helmet,rack');
insert into bike values ('0003', 'grifter', 'green', 'light,helmet,rack');
insert into bike values ('0004', 'chopper', 'red', 'rack,light');
insert into bike values ('0005', 'grifter', 'red', 'rack,light,helmet,lock');
select id, model, color, options from bike;
SET example
CREATE TABLE allergy (symptom SET('sneezing','runny nose','stuffy head','red eyes') );
INSERT INTO allergy (symptom) VALUES('');
INSERT INTO allergy (symptom) VALUES('stuffy head');
INSERT INTO allergy (symptom) VALUES('sneezing,red eyes');
INSERT INTO allergy (symptom) VALUES('sneezing,stuffy head,red eyes');
select symptom,symptom+0 'Index position' from allergy;
There are number of things that you should understand about these data types
they are defined with a limited set of strings
- 
the enum data type indexes its string values sequentially
- 
the set data type treats its string values as digits in a 64-byte value
- 
to compare set values a bitwise comparison can be done
- 
you can use the following attributes to both enum and set - NULL, NOT NULL and DEFAULT
- 
Not many developers use enum and set mainly because they are hard to alter and do require table rebuilds if altered, most developers will use
foreign keys but I reference them here so that you know that you have other options.
Finally the below is a quick table detailing what attributes a data type can use, also check the MySQL documentation of the version you are using.
Data Type
Attributes that can be used
Character Strings
NOT NULL, NULL, DEFAULT and BINARY
National Character Strings NOT NULL, NULL, DEFAULT and BINARY
Binary
NOT NULL, NULL and BINARY (only binary can use this)
Numeric data
NOT NULL, NULL, DEFAULT, AUTO_INCREMENT, SIGNED, UNSIGNED, ZEROFILL, SERIAL DEFAULT VALUE
DateTime
NOT NULL, NULL and DEFAULT
Enum and Sets
NOT NULL, NULL and DEFAULT
SQL Modes
MySQL has a system parameter that allows you to change the default behavior of data validation and allowed SQL syntax, it can be set on a global

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
