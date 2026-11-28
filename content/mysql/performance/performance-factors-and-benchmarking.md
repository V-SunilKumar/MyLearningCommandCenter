# Performance factors and benchmarking

> Source: `MySql_Notes.pdf`, pages 69, 70, 71. These are source-derived notes; verify version-specific commands before using them in a current environment.


Factors that affect Performacne.
Environmental Issues:
CPU
- 
Disk I/O
- 
Network Performance
- 
O/S Contention
- 
MySql Configuration:
Database Design
Index
Data Types
Normalization
- 
Application performance
Specific request
Short transactions
- 
Configuration Variables
Buffers
Caches
InnoDB settings
- 
Need to start looking at the monitoring statistics to determine if MySQL requires tuning, firstly you need a benchmark when the system is behaving
well, then over chosen time periods you can compare the benchmark with how the system is performing, over time you will be able to identify
trendlines (capacity planning) and then take a pro-active approach to fix any issues that may come down the road, for example the system may need
more memory, variables may need to be adjusted.
Identify any concurrency issues, not only from a database point of view but from your whole application.Using this data you can then plan when you
expect the system to reach its limits and planning to either upgrade the server, add another server or even replace it.
Benchmarking
There is a benchmark function in mysqld that you can use to see the execute time of an expression, it takes two arguments, a number of how many
times to evaluate the expression and the expression itself.
benchmarking
## the example below shows that the divide takes 10 times longer to run than the addition
select benchmark(10000000, 1+1);
select benchmark(10000000, 1/1);
## the next example we extract the date from a datetime field, surprisingly the left() function is faster
select benchmark(10000000, left('2012-05-14 00:00:00',10));
select benchmark(10000000, date('2012-05-14 00:00:00'));
The mysqlslap program executes an arbitrary number of SQL statements contained in a text file or you can use auto-generated SQL, it comes with
MySQL, you can also use part of a general or (converted) binary log to provide the SQL statements. I am not going to list all the options
for mysqlslap I will leave you to look up the documentation, but will provide a few example to get you going.
mysqldslap
## a simple example
mysqlslap --user=qa_user --password --auto-generate-sql
## a more complex example
mysqlslap --user=qa_user --password --concurrency=5 --auto-generate-sql --auto-generate-sql-execute-number=1000 --auto-generate-sql-unique-query-number=1000
## create your own table and inserts, this can be as complex as you want
## create file called create_table.sql
create table benchmarking (a int)
create table benchmarking_two (b int)
insert into benchmarking (a) values (23)
insert into benchmarking (b) value (45)
## create file called queries.sql
select * from benchmarking
select * from benchmarking_two
## now for the mysqldslap command
mysqlslap --user=qa_user --password --concurrency=100 --iterations=10 --create=create-table.sql
--query=queries.sql
The program sysbench is used to provide a more general system level view of the system running mysqld, you can obtain the source code
from http://sysbench.sf.net, just compile it and then use it, there are separate test modes for the following
CPU performance
- 
I/O performance
- 
mutex contention
- 
memory speed
- 
thread performance
- 
database performance
- 
Again there are a number of options that can be supplied with the sysbench command, I will leave you to lookup the documentation, but here are a
few examples
CPU performance
## run a cpu test with a maximum prime number calculated of 20,000
sysbench --test=cpu --cpu-max-p[REDACTED]=20000 run
I/O
## Complete random read/write test including preparation, running and cleanup
sysbench --num-threads=16 --test=fileio --file-total=1G --file-test-mode=rndrw prepare
sysbench --num-threads=16 --test=fileio --file-total=1G --file-test-mode=rndrw prepare
PERFORMANCE TUNING
Tuesday, July 27, 2021
4:57 PM

---


Mutex contention
## Here we run two test with different number of threads
sysbench --num-threads=2 --mutex-locks=100000 --mutex-num=10000 --test=mutex run
sysbench --num-threads=16 --mutex-locks=100000 --mutex-num=10000 --test=mutex run
Memory Speed
## Examples of a memory test
sysbench --num-threads=16 --test=memory run
Thread performance
## If you have two many threads running it can impact performance, see what the maximum limit is for your system
sysbench --num-threads=2 --test=threads run
sysbench --num-threads=4 --test=threads run
database performance
## You need to prepare the test first then run the test, this will test the OLTP database to see if it identify any problems, you can
## then tweat mysqld and rerun to see if any improvements have been made
sysbench --num-threads=2 --max-requests=100000 --mysql-user=qa_user --mysql-password<password> --test=oltop --oltp-table-size=1000000 prepare
sysbench --num-threads=2 --max-requests=100000 --mysql-user=qa_user --mysql-password<password> --test=oltop --oltp-table-size=1000000 run
sysbench --num-threads=2 --max-requests=100000 --mysql-user=qa_user --mysql-password<password> --test=oltop --oltp-table-size=1000000 cleanup
When benching marking any system and then tuning a system, you must take a slow approach, below are the steps I take
take benchmark of the system without any changes, this will be the baseline
- 
make one and only one change to the system
- 
run the benchmark again
- 
has the performance improved, if yes then you can end the testing or continue to try and improve the system go to step 1
- 
if the performance has not improved the system, then back out the change and go to step 2.
- 
You can repeat the cycle as many times as you wish, however the more changes to the system the more testing and risk you have of that change
affecting something else.
Profiling
Profiling gathers information that can be later compared to determine if there were any changes in behavior, mysqld has a show profile command that
gives the description of the profile of a particular query.
The show global status command can display one important variable regarding performance and that is the slow_queries variable, this can show how
many queries are taking too long to execute, you can set the time length using the variable long_query_time.
You can use the utility mysqltuner which is a Perl script which can give the following information
General statistics
- 
Storage engine statistics
- 
Performance metrics
- 
Just run the script and it will highlight the areas that may need attention.
The utility mysqlreport is my favorite utility, I use it regularly against my databases to highlight any problems, it is very similar
to mysqltuner in that it is a perl script and it uses show status to gather an overall picture of a servers health, however it does not provide any
recommendations. You can download You can download mysqlreport from http://hackmysql.com/mysqlreport. There are a number of options that you can
use but I use the below
mysqlreport
mysqlreport --user root --password <password> -host <host>
I actually have this script hooked into an Apache CGI script so that I can run it from the browser.
The mysqlreport is divided into sections into areas of the MySQL server that is being analyzed.
Section
what to look for
header
this line will detail the MySQL version and how long the server has been running plus the system date
Key
this section cover the key buffer usage, the buffer is used to store MyISAM indexes. The first you should ignore as it is notvery accurate, if you look at the the read and write hit rates it will
determine the following
low write hit rate = lots of updates and inserts are occurring
- 
low read hit rate = lots of select are happening
- 
What you are looking for are high hit rates which means that you are obtain data from the cache instead of disk
Questions
This is a large section, and it details information about SQL queries
Total line shows how many queries have been executed
- 
DMS line is the data manipulation statements (select, insert, update and delete)
- 
The Com_ line displays the server communication commands
- 
The QC Hits line show how many query results sets were served from the query cache
- 
The Unknown line are questions that MySQL handles and increments the total questions counter, this should be small
- 
The Slow line shows how many queries took longer than the variable long_query_time (default 10 seconds)
- 
The DMS and Com_ lines are broken further down to give details on what is going on within the system
Select and Sort
This gives information on the select statements and the type of joins used and even table scans, this could highlight areas where you may have to look into the select statements or even create
indexes. keep an on the lines sort scan and full join these should be low as possible.
Query cache
The memory usage line shows the amount of memory actually being used out of the total memory, the block fragment percentage should be between 10% and 20%, the hits line indicates the
number of query result data sets actually served from the query cache. I have a whole section on caching take a look on how to optimize, etc.
Table Locks
this sections shows how often the database had to wait to obtain a lock on a tabled (waited) and how often the lock was granted immediately (immediate), if these are high then there is
contention in the MyISAM database.
Tables
This section describes how many tables are open while this report was run, and what percentage of them are cached. If the number of open tables is equal to the table cache, it could possibly
indicate a problem, thus you need to increase the size of the table cache.
Connections
This is pretty self explaining, it highlights the number of connections and the maximum total allowed, if this is high then increase max_connections variable.
Created temp
This section is very important, the disk table line shows the total number of temporary tables that were created, if created on disk instead of memory this is a big performance hit. It happens
when the temporary table size exceeds the max_tmp_tables variable, so increase this if necessary.
Threads
This section details the connection threads to the server, play attention to the cache line, this shows the number of threads that are stored in the thread cache ready for use, this keeps the
server from having to create a new thread (wasting time), try to keep this value as high as possible, increase the thread cache if this becomes to low.
Aborted
keep an eye on the section, it indicate client connections that have been dropped, it could indicate the following
the client program did not call mysql_close() before exiting
- 
the client has been sleeping more seconds that either wait_timeout or interactive_time system variables
- 
the client program ended in the middle of a data transfer
- 
The connection line is incremented when one of the following happens
the client does not have the required privileges to connect to the database
-

---


the client used an incorrect password
- 
a connection packet is malformed or does not contain the proper information
- 
it takes the server more than connect_timeout seconds to get a connection packet from the client
- 
Bytes
This displays the number of bytes sent and received from the server
InnoDB Buffer Pool
This large section details information regarding the InnoDB buffer pool, you can see the following
usage - shows the amount of RAM dedicated to the InnoDB buffer pool and how much is actually being used
- 
free pages - are buffers that are not allocated to any data at the time of the report
- 
data pages - are buffers that currently contain data
- 
misc pages - are pages in the buffer for administrative overhead
- 
latched pages - are pages that cannot be flushed or removed from the buffer pool because the were being read/writing to
- 
reads - shows the total read activity both in number of reads and the average amount of reads per second
- 
from file - the number of reads of InnoDB pages that were served from disk instead of memory
- 
Ahead - number of read ahead requests that are random (RND) and sequential (SQL), sequential could indicate full table scans
- 
write - describes the total number and average rate of writes to the buffer pool
- 
flushes - indicates the total and per second average number of flushes
- 
wait free - indicates the number of times and the average that when the buffer pool attempts to create a new page and there are no clean pages available
- 
InnoDB Lock
This section details information about the row-level locks for InnoDB tables, this should be as close to zero as possible
InnoDB Data
The last section details general information on the InnoDB activity, its a quick review before you examine in detail the other InnoDB sections above
The utility mk-query-p[REDACTED] script reads a file containing SQL statements or shell commands, executes them and then performs analysis of the
output of show status. At the end of the program execution it displays statistics about query performance. Again this command has a number of
options, below is an example
mk-query-p[REDACTED]
mk-query-p[REDACTED] --askpass --user=<user> --database=<database> --socket=/var/run/mysqld/mysqld.sock /test_scripts/test_queries.sql
Lastly we have the utility mysqldumpslow, if you have slow queries logging setup you can use this utility to display (dump) the slow query log,
there are lots of options to this command which determines the output outcome.
mysqldumpslow
mysqldumpslow -s t -t 5 /var/log/mysql/slowquery.log
