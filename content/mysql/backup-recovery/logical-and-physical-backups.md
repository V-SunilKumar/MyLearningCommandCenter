# Logical and physical backups

> Source: `MySql_Notes.pdf`, pages 61. These are source-derived notes; verify version-specific commands before using them in a current environment.


in vi or notepad and change the contains if desired. Examples
mysqldump
## backup all databases
mysqldump --user=root --password --all-databases > backup_<date>_all.sql
## backup a specific database
mysqldump --user=root --password <database_name> > backup_<date>_<database_name>.sql
## backup multiple databases
mysqldump --user=root --password <database_name>,<database_name> > backup_<date>.sql
## backup a table from a database
mysqldump --user=root --password <database_name> <table_name> > backup_<date>_<database_name>_<table_name>.sql
## backup some specific data
mysqldump --user=root --password <database_name> <table_name> --where "last_name='VALLE' order by first_name > backup_<date>.sql
## dumping from one database to another
mysqldump --databases <database_name> | mysql -h <destination_host> <database_name>
restore a mysqldump
## all databases
mysql --user=root --password < backup.sql
## specific database
mysql --user=<user> --password <database_name> < backup_<dataabse_name>.sql
Mysqlbackup comees with entriprise editon. This is a physical hot backup tool.
Backup :
mysqlbackup -ubkpemc -p --backup-dir='/u01/mysql75/backup/140821' --backup-image='backup.img' backup-to-image
mysqlbackup -uinnodbcluster -p --backup-dir='/u01/mysql75/backup/140821' --backup-image='backup.img' backup-to-image
Restore:
mysqlbackup --backup-dir='/u01/mysql75/backup/140821_R/' --backup-image='backup.img' copy-back-and-apply-log
You can use the into outfile clause of the select statement to backup individual tables, the command used to load the dump created is load data
infile
select into outfile / load data infile
## dump of the accounts table
select * into outfile '/tmp/accounts.txt' from accounts;
## load the dump
load data infile '/tmp/accounts.txt' into table accounts;
The Maatkit parallel dump and restore toolkit can be downloaded from http://www.maatkit.org basically it's a wrapper around mysqldump which provides
the programs mk-p[REDACTED] and mk-p[REDACTED], what this means is that if you have a 16 core server and you are dumping 32 tables, the
script will start up 16 separate copies of mysqldump with each process dumping a separate table.
mk-p[REDACTED], mk-p[REDACTED]
## backup a database
mk-p[REDACTED] --basdir=/backups
## restore a database
mk-p[REDACTED] /backups
Snapshots for a filesystem depend on what operating system or software you are using, here are some links to my web pages regarding LVM, ZFS and
VMWare
LVM snapshotting
- 
ZFS snapshotting
- 
VMWare snapshots
- 
New in MySQL 5.6 is the online logical host backup, you can also use compression and encryption which is important when using sensitive data.
backup
backup database <database_name> to '<database_name>-backup.sql'
restore
restore from '<database_name>-backup.sql'
history
select * from backup_history where backup_id = 321\G
There currently is a number of limitations of this command
no backup of the internal mysql datadisk
- 
no native driver for InnoDB tables
- 
no native driver for Maria or Falcon
- 
no backup of partitions
- 
no incremental backups
- 
The mysqlhotcopy is a perl script written to provide a consistent backup of MyISAM and ARCHIVE tables, it does some limitations one of which when
run it uses the lock tables command to create read locks on the tables being backed up, this allows for a consistent backup. again there are a
number of options that you can use so have a look at the man page, here are a few examples
mysqlhotcopy
## backup a database
mysqlhotcopy <database_name> /backups
## backup multiple databases
mysqlhotcopy <database_name> accounts /backups
## backup a database to to another server
mysqlhotcopy --method=scp <database_name> \ username@backup.server:/backup
## use pattern match to backup databases and tables
mysqlhotcopy <database_name>./^employees/ /backup
Lastly ibbackup is a 3rd party software which allows you to perform non-blocking hot backups of InnoDB tables, it is entirely command-line driven
which means that it is ideal for scripts, here is a link to the web site http://www.innodb.com/doc/hot_backup/manual.html
