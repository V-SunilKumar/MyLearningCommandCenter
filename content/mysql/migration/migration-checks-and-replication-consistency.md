# Migration checks and replication consistency

> Source: `MySql_Notes.pdf`, pages 75–78. The notebook index also lists “Replication Consistency Before Migration” and “Verifying Query Behavior Before Migration”; the supplied PDF does not contain clearly separated full sections under those exact headings. The available pages primarily record replication troubleshooting and GTID-related checks.


On Slave :
Last_SQL_Error: Error executing row event: 'Table 'tester.DBA_TEAM' doesn't exist'
Replicate_Wild_Ignore_Table:
                   Last_Errno: 1146
                   Last_Error: Error executing row event: 'Table 'tester.DBA_TEAM' doesn't exist'
Solution :
The metada becomes invalid since we used case sensitive inserts in MASTER. So slave got errored out.
Note : Long Process work.
Master:
[root@mysql1 826]# mysqldump --all-databases > /u01/mysql75/backup/all_db_bkp.sql
[root@mysql1 826]# mysql
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| innodb             |
| mysql              |
| performance_schema |
| sakila             |
| sys                |
| tester             |
+--------------------+
mysql> drop database tester;
Query OK, 1 row affected (0.07 sec)
mysql> drop database innodb;
Query OK, 3 rows affected (0.08 sec)
mysql> drop database sakila;
Query OK, 23 rows affected (0.39 sec)
add in my.cnf and restart the services
vi my.cnf
lower_case_table_names=1
systemctl restart mysqld
systemctl status  mysqld
cat /var/log/mysqld.log
cd /u01/mysql75/data/
ll
rm -rf *
systemctl start mysqld
cat /var/log/mysqld.log |grep password
mysql -uroot -p[REDACTED]
alter user 'root'@'%' identified by '[REDACTED]';
Not take the Image Backup like RMAN backup in Oracle.
mysqlbackup --backup-dir='/u01/mysql75/backup/310721' --backup-image='backup.img' backup-to-image
# create a new directory 310721 for temporary hold the backup.
scp -r 310721/ 192.0.2.62:/u01/mysql75/backup/
Slave :
Here we are building complete SLAVE freshly
cat /var/log/mysqld.log | grep "Server upgrade"
[root@mysql2 meta]# service mysqld stop
cd /u01/mysql75/data/
rm -rf *
cd /u01/mysql75/binlog/
rm -rf binlog.*
Now restore the backup.
mysqlbackup --backup-dir='/u01/mysql75/backup/310721_restore/' --backup-image='backup.img' copy-back-and-apply-log
Note : create new backup directory 310721_restore to hold temp files.
Check the files in the datadir.
ll -ltr /u01/mysql75/data/
Errors - Resolutions
Saturday, July 31, 2021
8:45 PM

---


[root@mysql2 meta]# cat  vi /etc/my.cnf
[mysqld]
lower_case_table_names=1 <-- Change the lower case sensitive.
[root@mysql2 meta]# service mysqld start
Once Done create change master to start the slave replication. To identified binlog file and position check in the below files.
[root@mysql2 meta]# pwd
/u01/mysql75/backup/310721_restore/meta
[root@mysql2 meta]# ll
total 168
-rw-r----- 1 mysql mysql 109827 Jul 31 19:58 backup_content.xml
-rw-r----- 1 mysql mysql   5006 Jul 31 19:58 backup_create.xml
-rw-r----- 1 mysql mysql    726 Jul 31 19:58 backup_variables.txt <-- to identified binlog and position.
-rw-r----- 1 mysql mysql  29082 Jul 31 19:58 image_files.xml
-rw-r--r-- 1 mysql mysql  15412 Jul 31 19:58 MEB_2021-07-31.19-58-31_copy-back-and-apply-log.log
[root@mysql2 meta]# cat backup_variables.txt
binlog_position=binlog.000012:1262634
[root@mysql2 meta]# cat MEB_2021-07-31.19-58-31_copy-back-and-apply-log.log
210731 19:58:32 PCR1     INFO: Last MySQL binlog file position 0 1262634, file name binlog.000012
[root@mysql2 meta]# mysql
mysql> CHANGE MASTER TO  MASTER_HOST='192.0.2.61', MASTER_USER='replica', MASTER_PASSWORD='[REDACTED]',MASTER_LOG_FILE='binlog.000012',
MASTER_LOG_POS=1262634;
Query OK, 0 rows affected, 8 warnings (0.11 sec)
mysql> start slave;
Query OK, 0 rows affected, 1 warning (0.02 sec)
mysql> show slave status \G
*************************** 1. row ***************************
              Slave_IO_State: Connecting to source
                  Master_Host: 192.0.2.61
                  Master_User: replica
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: binlog.000012
          Read_Master_Log_Pos: 1262634
               Relay_Log_File: mysql2-relay-bin.000001
                Relay_Log_Pos: 4
        Relay_Master_Log_File: binlog.000012
             Slave_IO_Running: Connecting
            Slave_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 1262634
              Relay_Log_Space: 156
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: NULL
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 1130
               Last_IO_Error: error connecting to master 'replica@192.0.2.61:3306' - retry-time: 60 retries: 1 message: Host
'mysql-replica.example.local' is not allowed to connect to this MySQL server
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 0
                  Master_UUID:
             Master_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Replica has read all relay log; waiting for more updates
           Master_Retry_Count: 86400
                  Master_Bind:
      Last_IO_Error_Timestamp: 210731 20:22:39
     Last_SQL_Error_Timestamp:
               Master_SSL_Crl:
           Master_SSL_Crlpath:

---


Retrieved_Gtid_Set:
            Executed_Gtid_Set:
                Auto_Position: 0
         Replicate_Rewrite_DB:
                 Channel_Name:
           Master_TLS_Version:
       Master_public_key_path:
        Get_master_public_key: 0
            Network_Namespace:
1 row in set, 1 warning (0.01 sec)
mysql> exit
For the above Error, Since we restored the DB's from the backup, privileges for replica user not updated in the MASTER. Once we flush
privileges this worked.
[root@mysql2 meta]# mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 12
Server version: 8.0.26-commercial MySQL Enterprise Server - Commercial
Copyright (c) 2000, 2021, Oracle and/or its affiliates.
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql> show slave status \G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for source to send event
                  Master_Host: 192.0.2.61
                  Master_User: replica
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: binlog.000012
          Read_Master_Log_Pos: 1262801
               Relay_Log_File: mysql2-relay-bin.000002
                Relay_Log_Pos: 488
        Relay_Master_Log_File: binlog.000012
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 1262801
              Relay_Log_Space: 698
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 1
                  Master_UUID: 30d1133b-f1f2-11eb-a7a4-080027c394d7
             Master_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
     Slave_SQL_Running_State: Replica has read all relay log; waiting for more updates
           Master_Retry_Count: 86400
                  Master_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Master_SSL_Crl:
           Master_SSL_Crlpath:
           Retrieved_Gtid_Set:
            Executed_Gtid_Set:

---


Auto_Position: 0
         Replicate_Rewrite_DB:
                 Channel_Name:
           Master_TLS_Version:
       Master_public_key_path:
        Get_master_public_key: 0
            Network_Namespace:
1 row in set, 1 warning (0.01 sec)
mysql>
mysql>
mysql> exit
===========================================================================
mysql> select variable_name,variable_value from information_schema.GLOBAL_VARIABLES WHERE VARIABLE_NAME='port';
ERROR 3167 (HY000): The 'INFORMATION_SCHEMA.GLOBAL_VARIABLES' feature is disabled; see the documentation for 'show_compatibility_56'
mysql>
mysql> set @@global.show_compatibility_56=ON;
Query OK, 0 rows affected (0.00 sec)
mysql> select variable_name,variable_value from information_schema.GLOBAL_VARIABLES WHERE VARIABLE_NAME='port';
+---------------+----------------+
| variable_name | variable_value |
+---------------+----------------+
| PORT          | 3306           |
+---------------+----------------+
1 row in set, 1 warning (0.00 sec)
===========================================================================
ERROR: MYSQLSH 51314: This function is not available through a session to a standalone instance (metadata exists, instance belongs to that metadata, but GR is not active)
