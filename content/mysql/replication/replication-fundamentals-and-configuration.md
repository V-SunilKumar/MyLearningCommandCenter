# Replication fundamentals and configuration

> Source: `MySql_Notes.pdf`, pages 66, 67. These are source-derived notes; verify version-specific commands before using them in a current environment.


Replication
Replication allows you to keep database servers synchronized, be it that the servers are in the same data center or across different locations.
MySQL uses the terminology master server and slave server to represent the two servers that are involved in replication. Replication could be used for
the following reasons.
High Availability (Failover requirements)
Master - Slave
- 
Master - Master
- 
Master - Salave - Slave
- 
NDB Cluster
- 
1.
Load balancing and scaling out
2.
off-site processing - backups, running reports, etc
3.
Shared Disk Clustering (Shared Storage)
Put DATADIR in shared Disk
- 
Point mysqld to point to DATADIR (Good Design for Dataware House (MYISAM) good candidiate)
- 
4.
Disk Clustering (RDBD) [Block level clustering]
5.
A slave can only have one master, but a master can have many slaves, but you can have a master be a slave to another master.
When you are talking about replication be is database, disk storage, etc you will come across two terms
synchronous
(mysql uses semi-synchronous)
means that the data has to be committed on slave (or mirrored, replicated, etc) server before the master server can continue, the master server will wait for an acknowledgment from the
slave or a timeout occurs, this could cause a delay depending on the underlying infrastructure and the location of the slave server.
For semi-synchronous replication you require 3rd party tool (Pluging is required)
asynchronous
means that the does not have to wait for the data to be committed on the salve server before the master server can continue. The master simply write the changes to the binary log with
no regard to the status of the salve servers. This means there is no guarantee that replication is actually synchronized the data, however it is faster than synchronous.
When replication is setup data is written to the binary log, any slave servers connected to the master server uses what is called an I/O thread
process which writes the statements or data received from the master server into the relay log, the SQL thread is the process that reads the from the
relay log and then replays the statements or data changes for the MySQL process on the slave server. The end result is that the slave server has
actually run the same statements as the master server executed. If the slave server is also configured as a master server of other slaves, it simply
writes its own binary logs and the secondary salves read from that binlog using their own I/O threads.
Replication Configurations
Simple replication consisting of one master and one slave, which generally the most popular, the setup is very easy and consists of making a few
changes to the MySQL configuration file.
On the salve there were two threads SQL Thread and Apply Thread, I/O threads(Pulling down the logs) and SQL Thread (Applying logs)
                            Master Server (setup)
Slave Server (Setup)
changes to the configuration file
(simple master-slave)
## In the [mysqld] directive add the
following
server-id = 1
log-bin = mysql-bin
sync_binlog = 1
## now restart MySQL
## Now create a replication user,
replace the <host> with the hostname
of the slave
sql> create user
'<username>'@'<host>' identified by
'<password>';
sql> grant replication slave on *.*
to '<user>'@'<host>' identified by
'<password>';
Sql> FLUSH LOGS;
## In the [mysqld] directive add the following
server-id = 2
## now restart MySQL
## If the master server has data
## if the master has data you need to get the slave server identical, see backups and recovery on how to do this,
use the --master-data option to mysqldump it will automatically store a change master to statement at the end of the
export on import the slave information will already be set up. Once the servers are identical, you can startup the
slave
sql> start slave;
sql> show slave status;
=========================================================================================================
## both Slave_IO_Running and Slave_SQL_Running should show yes
## If the master server has no data,if your master server information was not stored in the backup or if you
configuring a slave of a master server with a empty data set you can use the change master to command
sql> change master to
sql> master_host='<hostname>',
sql> master_user='<username>',
sql> master_password='<password>',
sql> master_log_file='mysql-bin.000001',
sql> master_log_pos=98;
## once this has been done to can start the slave
sql> start slave;
sql> show slave status;
Now that you know how to setup a simple master, slave configuration, you can setup more complex configurations using the same as above
REPLICATION - INNODB
Tuesday, July 27, 2021
10:45 AM

---


single master with
multiple slaves
## this setup is the same as the master-slave above, you need to make sure that you change the server-id for each
slave
[mysqld]
server-id = X
master and relay slave
## this option the relay slave will have to have the configuration below in the [mysqld]
[mysqld]
server-id = X
log-bin = mysql-bin
log-slave-updates
master-master
## with a master-master configuration, the primary issue is that both servers could potentially be simultaneously
inserting a row into the same table with an auto-increment field, at this point the replication will break on one of the
servers because it can not insert a row with the same ID, you need to resolve this issue by using the below entries in
the
[mysqld] configuration only add the particular entry to that particular server, don't add them all in the same server
##only add to Server A.
auto_increment_increment = 10
auto_increment_offset = 1
## only add to Server B
auto_increment_increment = 10
auto_increment_offset = 2
## This will ensure that one server uses even numbers and the other server using odd numbers
circular replication
## This also known as multi-master replication, again you will need auto_increment settings and the relay slave setting
[mysqld]
server-id = X
log-bin = mysql-bin
log-slave-updates
## only add to Server A
auto_increment_increment = 10
auto_increment_offset = 1
## only add to Server B
auto_increment_increment = 10
auto_increment_offset = 2
## only add to Server B
auto_increment_increment = 10
auto_increment_offset = 3
## only add to Server D
auto_increment_increment = 10
auto_increment_offset = 4
One thing when creating complex configurations is the issues you get when part of the network goes down, you may get problems where one server cannot
write changes to another server, this means that servers can become out of sync with other servers, make sure that you test this situation and have
the documentation ready on how to recover from these problems.
There are times when the data set on the master and the slave differ this is known as data drift, this can occur if you are using non-deterministic
functions or allowing write access to a slave server, you can download the Maatkit tool kit which can help resolve these issues, the tools are all
written in Perl and can help in the following
Skip the bad logs and apply from the good log. Else the slave is simply hang (Make a note of the log position you need to recover it)
- 
uncover data drift problems
- 
actually resolve data drift issues
- 
synchronize tables
- 
In MySQL master & slave can be two different releases. You can perform rolling upgrade.
If you want to change the MASTER password in Master Node. Stop the slave node, Change the master password and restart your Slave.
No need to reset the slave. Slave has to reset if the logfile (name or position) is changing.
MySQL failover will not capable failover session.
You can skip GLOBAL TRANSACTION ID.
REPLICATION FILTERS:
UTILITIES FOR REPLICATION:
Mysqldbcopy - Copy database from source to target along with replication configuration.
Mysqldbcompare - compare two database differences to sync them.

---

![Image extracted from original PDF page 67](images/pdf-page-67-image-1.jpeg)

---

![Image extracted from original PDF page 67](images/pdf-page-67-image-2.jpeg)

---

![Image extracted from original PDF page 67](images/pdf-page-67-image-3.png)

---

![Image extracted from original PDF page 67](images/pdf-page-67-image-4.jpeg)
