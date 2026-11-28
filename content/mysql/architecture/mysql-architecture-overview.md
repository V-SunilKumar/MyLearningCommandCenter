# MySQL architecture overview

> Source: `MySql_Notes.pdf`, pages 19. These are source-derived notes; verify version-specific commands before using them in a current environment.


MySql is a simple database and not to bloated with many features that you don't need, the other feature is that MySQL can hav e a number of different
engine types to suit the application.
MySQL is written in C and C++ and in 2001 MySQL began supporting transactions with the integration of the BDB and InnoDB engines (the default
engine), this allowed for safer handling of concurrent write operations, which began the trend of adding features needed by the Enterprise
environments.
MySQL supports the following platforms and has both 32-bit and 64-bit versions available
Linux
- 
Solaris
- 
Windows
- 
AIX
- 
HPUX
- 
Although MySQL comes with no tools, there are a number of graphical tools available the main one being the MySQL workbench.
MySQL comes in a number of flavors, commercial customers have a number of different choices depending on your needs.
Community Server (free edition)
- 
Standard Edition
- 
Enterprise Edition
- 
Cluster Carrier Grade edition
- 
All the versions have the following features
Pluggable Storage Engine Architecture
- 
Multiple Storage Engines InnoDB, MyISAM, NDB (MySQL Cluster), Memory, Merge, Archive, CSV, etc
- 
Replication
- 
Partitioning
- 
Stored Procedures, Triggers, Views
- 
Information Schema
- 
MySQL connectors (ODBC, JDBC, .NET, etc)
- 
MySQL Workbench for visual modeling, SQL development and administration.
- 
Many web application use MYSQL as the database component of a LAMP  (LINUX,APACHE,MYSQL,PHP/PERL/PYTHON) software stack.
MySQL Storage Engines
MySQL is very different from other databases, in that it's storage engine is pluggable, means by this is that the MySQL server core code is separate from the storage engine, which means that you can
have a pluggable storage engine that fits your application. MySQL has over 20 storage engines.
Storage Engine
Transactional Support
Locking Level
Online Non-blocking Backup
Server Version(s) available
InnoDB (default)
Yes
Row
Yes
5.1, 5.5, 5.6
MyISAM/Merge
No
Table
No
5.1, 5.5, 5.6
Memory
No
Table
No
5.1, 5.5, 5.6
Marta
Yes
Row
No
5.1, 5.5, 5.6
Falcon
Yes
Row
Yes
5.6
PBXT
Yes
Row
Yes
5.1, 5.5, 5.6
FEDERATED
No
n/a
n/a
5.1, 5.5, 5.6
NDB
Yes
Row
Yes
5.1 and available in MySQL Cluster
Archive
No
Row
No
5.1, 5.5, 5.6
CSV
No
Table
No
5.1, 5.5, 5.6
The different storage engines can vastly improve a database performance when using the correct one, below is a list of featur es that may make you
decide to change from the default InnoDB storage engine
Transactional Support - if you application does not require transactional support then you can reduce the resources by using a non-transaction
engine
- 
Table-Level features - if you need specific features for an example the checksum feature then you would have to use the MyISAM engine
- 
Locking - Depending on your application you may want row or table locking
- 
Indexing - different storage engines use different indexing strategies that meet different application types, OLAP, Data Warehouse, etc
- 
Foreign Keys - a number of storage engines do not support foreign keys, so double check when you select a particular engine
- 
Buffering - Some engines use buffering others don't, for example the MyISAM engine does not buffer data but supports multiple buffers for
indexes
- 
File Storage - some engines store their data/indexes in self-contained files, others use centralized metadata this has a impact if you want to
move the data files to another server
- 
Backup - some engines allow you to perform hot backups, others you need to take the database down before performing a backup
- 
MyISAM was the default engine until recently, this engine has been used since MySQL version 3.2, it is a non-transactional engine and does not implement any additional locking mechanisms, this may
cause problems when you have a large number of concurrent writes to a table. If your application has a lot of write activity the writes will end up blocking the reads which will cause performance
problems, thus you should use either a InnoDB or Falcon engine.
MyISAM has three files associated with it, because the three files represent a table they can be simply copied to another server and used, however
to avoid corruption you should take down mysql server before copying. The other server must have the same endian format as the source server, so you
cannot copy from linux X86 server to a Sparc server for instance.
.frm
the table format file
Architecture
Tuesday, July 20, 2021
10:43 AM
