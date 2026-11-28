# Backup strategy and backup types

> Source: `MySql_Notes.pdf`, pages 60. These are source-derived notes; verify version-specific commands before using them in a current environment.


This is the most important task of an database administrator, you must protect your data at all costs, this means regular backups and regular
restores even to another system just to check the integrity of those backups. There is no point in putting yourself in a position where you are
holding your breathe when a restore is happening only to find out that the backup is corrupt, try if possible to perform regular restores if not
then at least you should be performing a disaster recovery test once per year. Not being able to restore could be a disaster for your company and
your job.
To check your backups you can use one or more of the below which I have used in the past
Use a reporting database if the customers don't need real time data and you have the money and time, Production data could be restored every
day to this system which is a very good test.
- 
Use a performance test server with Production data, ideal to test releases of your software against Production data which is generally has more
volume then a test system, restore perhaps once a week.
- 
At least perform a DR once per year to prove the backup solution is working, for example you may have forgotten to backup something not only
regarding the database but from the systems as well
- 
Backups and restoring
First lets start with a few terms associated with backups
logical backup
This type of backup is created by saving information that represents the logical database structures using SQL statements like create database, create
table and insert. This type of backup is ideal when you want to upgrade from one version of MySQL to another however it is a slower method of backing up.
physical backup
This type of backup is a backup of the actual database files or disk partitions, this type of backup can be very fast to backup and restore.
full backup
A full backup is a standalone backup containing everything in the database, this could then be restored on another server. A full backup can be either
logical or physical.
incremental backup
This type of backup only contains the data that has changed from the last backup. The advantage of this type of backup is that it is faster as there is
not some much data to backup, however the disadvantage is that it takes longer to recover.
consistent backup
This is a backup at an exact moment in time, generally you shutdown the database (or quiescent mode) then take the backup.
hot backup
This type of backup is taken when the database is running, during the backup both reads and writes are not blocked
warm backup
This type of backup is taken when the database is running, however reads are not blocked but writes are prohibited from making any modifications to the
database.
cold backup
Similar to a consistent backup as the database is shutdown before the backup begins
point-in-time restore
It is a restoration of a database to a specified date and time , some databases use a full backup and recovery logs to restore to that point-in-time,
others can only use the last full backup which means that data might have to be re-keyed into the system.
As well as obtaining a backup in your maintenance window you should also be aware on how long a restore will take thus to make sure that you meet
you SLA agreements during a DR or if you have to recovery a database due to corruption or user error.
How often you should take your backups, and this i am afraid depends, so company are happy for once a month backups other may take two backups per
day. The answer generally has to come from the business on what they are prepared to lose, amount of data lost or what has to be re-keyed into the
system again.
If you have a small company that say has to re-key in 20-50 invoices then that's no big deal, however if you have a trading company that many have
to re-key in 10's of thousands of entries/trades then that becomes a problem. You have to add the time it takes to restore the system plus the time
it takes to recover the system so that users are able to use it, it is this time that you give to the business to make there decision on what is a
acceptable time period that the business can be down for, the shorter the time the more money that will have to be thrown at the solution, if you
are talking about zero downtime then we would have to implement a high availability solution which could cost a lot of money, if you are happy with
1 days downtime then this should be enough to restore and recovery a database and to re-key in some entries to make the database consistent with the
companies paper work.
As you saw above there are a number of ways to backup a database, depending on the the available time to perform a backup will make you decide on
what method to use, if you have a short maintenance window with a large database then a incremental backup maybe the only option, but you have a
large maintenance window with a small database then you could perform a full backup, remember what ever option you use with have a impact on the
recovery time.
One point to make is that you backups should be taken off-site if held on tape or copied across to an other system in another location, if an
incident happened on the original system for example a fire you don't want to lose your backups as well, the storing of off-site data should be part
of you DR plan.
lets see how you can actually take backups one, there are a number of backup tools that MySQL can use, see the table below.
Backup tools for MySQL
Backup method
Storage engine
Impact
Backup speed
Recovery speed
Recovery granularity
mysqldump
ALL
WARM
MEDUIM
SLOWEST
MOST FLEXIBLE
mysqldump
INNODB
HOT
MEDUIM
SLOWEST
MOST FLEXIBLE
select into outfile
ALL
WARM
SLOW
SLOW
MOST FLEXIBLE
mk-p[REDACTED]
ALL
WARM
MEDUIM
MEDUIM
FLEXIBLE
ibbackup
INNODB
HOT
FAST
FAST
FLEXIBLE
ibbackup
ALL
WARM
FAST
FAST
FLEXIBLE
backup command in mysqld
ALL
HOT
FAST
FAST
FLEXIBLE
filesystem (copy files)
ALL
COLD
FASTEST
FASTEST
NOT FLEXIBLE
snapshot (using LVM, ZFS, VMWare)
ALL
ALMOST HOT
FAST
FAST
LEAST FLEXIBLE
mysqlhotcopy
MyISAM
MOSTLY COLD
FAST
FAST
FLEXIBLE
mysqlbackup
INNODB
xtrabackup/innobackupex
INNODB
The mysqldump program has been around a long time, it provides a logical backup of the entire database, individual databases, individual tables or
even subsets of data using the --where option, it is often called a data dump. The output is in ASCII format which means that you can open it
Backups and Recovery
Friday, July 23, 2021
8:34 PM
