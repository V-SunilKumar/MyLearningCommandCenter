# ACID, isolation levels and locking

> Source: `MySql_Notes.pdf`, pages 47, 48, 49, 50. These are source-derived notes; verify version-specific commands before using them in a current environment.


A transaction can be made up of a number of SQL statements but it is only a transactions if it is ACID compliant
ACID stands for
Atomicity
means that either all of the SQL statements inside a transaction are completed or none of them are performed. Atomicity guarantees that the transaction is completed as a whole and not as a part.
Consistency
ensures that the database move from one consistent state to another, if part of a transaction fails then the database will rollback to a consistent state.
Isolation
ensures that data being modified for one transaction cannot be seen or modified by a second transaction until the transaction completes in the first transaction, locks are also used to prevent data
being accessed at the same time. You can alter the isolation level within MySQL which will be discussed later in this section.
Durability
describes the principle that once a transaction has been successfully completed the results are record by the database server permanently, after this point the transaction is complete and the data
will survive even if the database or operating system fails. If the database or operating system were to fail the database should be able to recover up to the last completed transaction.
only InnoDB and Falcon storage engines support transactions, begin, begin work, start transaction can be used to start a
transaction, commit and rollback can be used to end a transaction and savepoint can be used to define a point in a transaction.
The commit statement is used to end a transaction, at this point all changes to the tables are considered to be durable and will survive any system
failures.
The rollback statement is used to roll back a transaction to either the state it was in before execution of the transaction or to a certain point
prior to where the execution is currently occurring, this is called the savepoint.
A savepoint is a defined point in a transaction, it is defined by a savepoint point name of your choice, the rollback to savepoint statement is used
to roll back transactions to the saved point name specified, instead of rolling back all the transactions, you can remove the savepoint by using the
statement release savepoint.
The autocommit statement is another way to work with transactions, by setting the system variable autocommit every statement is treated like a
transaction, basically in the background MySQL wraps a start transaction statement with every SQL statement.
The example below creates a simple table and inserts some data, then starts a transaction and creates a savepoint between two inserts, then we roll
back to the savepoint, you can then see that the first statement was committed but the statement after the savepoint was not. Savepoints are useful
for implementing complex error recovery in database applications — if an error occurs in the midst of a multiple-statement transaction, the
application may be able to recover from the error (by rolling back to a savepoint) without needing to abort the entire transaction.
savepoint example create table spoint_test (id int primary key auto_increament, name varchar(8)) engine -InnoDB;
insert into spoint_test (name) values ('a'),('b');
select id,name from spoint_test;
start transaction;
update spoint_test set name='Z' where id = 1;
savepoint savepoint_one;
update spoint_test set name='y' where id = 2;
select id, name from spoint_test;
rollback savepoint savepoint_one;
select id, name from spoint_test;
commit;
Isolation Levels
Isolation levels determine how data is isolated among different transactions, what happens when you start a transaction, how does it affect other
users on the system, the isolation level determines this outcome. There are a number of isolation levels which are briefly explained below.
READ UNCOMMITTED
This setting allows all transactions to see all uncommitted changes, whether in the own transaction or in another transaction , these are unknown as dirty reads, the data is said to be dirty
because the changes are not permanent. This setting is not ACID compliant and is discouraged as it will make you system non -transactional.
READ COMMITTED
Only data changed by committed transactions are visible to other transactions, however within a transaction, dirty data can s till be read. This means identical queries within a transaction
can return different results.
This setting is the default option in both Oracle and SQL Server.
REPEATABLE READ
All reads within the transaction show the same data values, even if a second transaction has committed a data change while th e first transaction was still running. For example if a
transaction starts, reads a row, waits 60 seconds and then reads the same row again both data reads will be the same even if someone else's changes the row with those 60 seconds, however
any transactions started after the commit will see the new data.
This setting is the default option for MySQL
SERIALIZABLE
Data reads are implicitly run with a read lock (the lock in share mode), other transactions can read the data but no transactions can update this data until the read locks are release, this of
course impacts concurrency.
From a performance point of view read committed is the fastest, then read committed, then repeatable read and finally serializable, however you
should determine how your application will be impacted by each level. It is possible to set the isolation at each connection but this add complexity,
to set the isolation at the system level use the system variable tx_isolation.
isolation level
## you can use either of the below to set the isolation level
set tx_isolation = [read-uncommited|read-committed|repeatable-read|serializable]
set transaction isolation level [read-uncommited|read-committed|repeatable-read|serializable]
To explain the above here are some examples of each of the isolation levels
READ UNCOMMITTED
## open the first session
set tx_isolation='read-uncommitted';
create table isolation_test (id int primary key auto_increament, name varchar(8)) engine-InnoDB;
insert into isolation_test (name) values ('a'),('b');
select id,name from isolation_test;
## open a second connection and insert some data BUT don't commit
insert into isolation_test (name) values ('a'),('b');
## return to the first connection
select id,name from isolation_test;
Transactions
Wednesday, July 28, 2021
5:06 PM

---


## Notice that the first connection can read the uncommitted data from the second connection
## in the second connection rollback the changes
rollback;
## return to the first and the rolled back transaction have gone
select id,name from isolation_test;
READ COMMITTED
## in the first session
set tx_isolation='read-committed';
start transaction;
## in the second session
begin;
insert into isolation_test (name) values ('c'),('d');
## return to the first session and notice this time you don't see the uncommitted changes from the
## second session
select id,name from isolation_test;
## if you commit the changes from the second session you should then see them in the first session.
REPEATABLE READ
## In this example lets imagine that a company reports on customer invoice data
## open the first session and set the isolation level
set tx_isolation='repeatable-read';
create table invoice (customer_id INT NOT NULL, invoice_date DATE NOT NULL) engine=InnoDB;
insert into invoice (customer_id,invoice_date) values (1,'2011-10-07'), (1,'2011-11-07'), (2,'2012-01-07');
start transaction;
select * from invoice where invoice_date > '2011-10-01';
## Now open a second session, begin a transaction and delete 2 rows from the table
begin;
delete from invoice where invoice_date < '2012-01-01';
commit;
select * from invoice;
## Now return to the first session and you should still see the data that was removed by the second session, this is
## as a phantom read
select * from invoice;
SERIALIZABLE
## open the first session and set the isolation level
set tx_isolation='serializable';
start transaction;
select * from isolation_test;
## open a second session and begin a transaction and perform an update, your session will now appear to hang, this is
## becuase it is waiting for the first session to release the implicit read lock it has on the data
start transaction
update invoice set name = 'z' where id = 1;
## Now commit the transaction in the first session, this will release the lock and the update (if not timed out)
## will continue
commit;
You are probably wondering how the repeatable read was able to read the data when it was deleted in the second session, this is made possible
by multi-version concurrency control (MVCC).
MVCC is a versioning system for data just like CVS, Subversion, etc. When a transaction starts you can think of it as checking out a copy of the data
as it is at the start of the transaction, the system is very complex as it could handle many transactions. If a second transaction starts, it "checks
out" its own copy of the data, if the first transaction changes and commits the second transaction will not see the data, the second transaction can
only work with the data it has.
The drawback with MVCC is the cost of storing multiple version of objects in the database, the benefit is that queries are not blocked as they are in
the serializable isolation level.
Locking
Lastly I will briefly touch on locking and deadlocks, again I have covered this area on my Oracle section in locking and concurrency. Locks are used
by a tread to keep other threads from modifying data in the area of the database that is locked. Locks are used to enforce isolation, there are a
number of row and table locks.
Row Locks
Read Lock (shared)
The locked data is reserved for reading by the current thread, other threads can read but not change the data. A read lock is also known as a shared lock.
Write Lock (exclusive) The locked data is reserved for writing by the current thread, other threads can neither read or write the locked the data. A read lock is also known as a exclusive lock.
Table Locks
Table Lock
The entire table is locked
Page Lock
The lock is set at the memory page level, a page is a group of rows, the numbers of rows can vary.
Row Lock
The lock is set at the row level, each row being read or written to is locked.
I will point you to the MySQL documentation on which engine which locking as this could change over time, however InnoDB and Falcon implement row-
level locking and mysqld implements table-level locking, which means that any storage engine can be locked at the table-level because table-level
locking is implemented in the server.
A deadlock is when two transactions are simultaneously trying to access the same data in the database, and each transaction has locked data that the
other transaction needs to continue, without being able to continue. If the client or the database does not intervene the transactions would what
forever. The database can manage the deadlock by having what is called a lock wait timeout value, the InnoDB storage engine will often recognize that
a deadlock has occurred and kill one of the sessions before this timeout has been reached.

---


You can see the timeout values by looking at the timeout variables
lock timeout variables show global variables like '%lock_wait_timeout';

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
