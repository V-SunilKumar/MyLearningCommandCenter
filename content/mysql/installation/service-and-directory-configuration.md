# Service and directory configuration

> Source: `MySql_Notes.pdf`, pages 7, 8, 9. These are source-derived notes; verify version-specific commands before using them in a current environment.


Dependency Installed:
  mysql-community-common.x86_64 0:5.7.35-1.el7
Dependency Updated:
  postfix.x86_64 2:2.10.1-9.el7                     qt.x86_64 1:4.8.7-9.el7_9                     qt-mysql.x86_64 1:4.8.7-9.el7_9                     qt-x11.x86_64 1:4.8.7-9.el7_9
Replaced:
  mariadb.x86_64 1:5.5.56-2.el7                                 mariadb-libs.x86_64 1:5.5.56-2.el7                                 mariadb-server.x86_64 1:5.5.56-2.el7
Complete!
[root@mysql1 MySql_Software]#
Check the rpm installed
*
[root@mysql1 MySql_Software]# rpm -qa | grep mysql
mysql-community-libs-compat-5.7.35-1.el7.x86_64
akonadi-mysql-1.9.2-4.0.1.el7.x86_64
mysql80-community-release-el7-3.noarch
mysql-community-server-5.7.35-1.el7.x86_64
mysql-community-common-5.7.35-1.el7.x86_64
qt-mysql-4.8.7-9.el7_9.x86_64
mysql-community-libs-5.7.35-1.el7.x86_64
mysql-community-client-5.7.35-1.el7.x86_64
Create Directory structure.
[root@mysql1 /]# mkdir -p /u01/mysql75/data
[root@mysql1 mysql75]# chmod 777 /u01
[root@mysql1 mysql75]# chmod 777 /u01/mysql75/
[root@mysql1 u01]# chown -R mysql: mysql75/
[root@mysql1 u01]# ll
drwxrwxrwx. 3 mysql mysql 18 Jul 29 07:27 mysql75
[root@mysql1 mysql75]# cd /u01/mysql75/
[root@mysql1 mysql75]# ll
drwxr-xr-x. 2 mysql mysql 6 Jul 29 07:27 data
[root@mysql1 u01]#
[root@mysql1 data]# su - mysql
[mysql@mysql1 ~]$ cd /u01/mysql75/data
[mysql@mysql1 data]$ touch 1
[mysql@mysql1 data]$ ll
-rw-rw-r--. 1 mysql mysql 0 Jul 29 07:38 1
[mysql@mysql1 data]$ rm 1
*
[root@mysql2 mysql75]# cat /etc/my.cnf
MySQL will default datadir location: /var/lib/mysql.
[mysqld]
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
[client]
user=root
password=[REDACTED]
Change MySQL Binary Log File Location To Another Directory
service mysqld stop
mv /var/lib/mysql/mysql-bin.* /new/directory/path
# vim /etc/my.cnf
......
.........
log-bin=/u01/mysql75/binlog/binlog
service mysqld start
Start MySQL service
[root@mysql1 MySql_Software]# systemctl status mysqld
●mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: inactive (dead)
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
[root@mysql1 MySql_Software]# systemctl start mysqld
[root@mysql1 MySql_Software]# systemctl status mysqld
●mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2021-07-29 07:06:21 +08; 3s ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 6127 ExecStart=/usr/sbin/mysqld --daemonize --p[REDACTED]=/var/run/mysqld/mysqld.pid $MYSQLD_OPTS (code=exited, status=0/SUCCESS)
  Process: 6072 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
Main PID: 6132 (mysqld)
   CGroup: /system.slice/mysqld.service
             6132 /usr/sbin/mysqld --daemonize --p[REDACTED]=/var/run/mysqld/mysqld.pid

---


Jul 29 07:06:12 mysql-primary.example.local systemd[1]: Starting MySQL Server...
Jul 29 07:06:21 mysql-primary.example.local systemd[1]: Started MySQL Server.
[root@mysql1 MySql_Software]#
grep 'temporary password' /var/log/mysqld.log
[root@mysql1 MySql_Software]# cat /var/log/mysqld.log | grep password
2021-07-28T23:06:16.263573Z 1 [Note] A temporary password is generated for root@localhost: [REDACTED]
- 
Login to MySQL using temporary password & Change the root@localhost password
[root@mysql1 MySql_Software]# mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.7.35
Copyright (c) 2000, 2021, Oracle and/or its affiliates.
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql> alter user root@lcalhost identified by '[REDACTED]';
ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.
mysql>
mysql> SHOW VARIABLES LIKE 'validate_password%';
ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.
mysql> alter user root@localhost identified by '[REDACTED]';
Query OK, 0 rows affected (0.00 sec)
mysql> flush privileges;
Query OK, 0 rows affected (0.06 sec)
mysql> show variables like 'validate_pass%';
+--------------------------------------+--------+
| Variable_name                        | Value  |
+--------------------------------------+--------+
| validate_password_check_user_name    | OFF    |
| validate_password_dictionary_file    |        |
| validate_password_length             | 8      |
| validate_password_mixed_case_count   | 1      |
| validate_password_number_count       | 1      |
| validate_password_policy             | MEDIUM |
| validate_password_special_char_count | 1      |
+--------------------------------------+--------+
7 rows in set (0.03 sec)
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.01 sec)
mysql> show databases \G;
*************************** 1. row ***************************
Database: information_schema
*************************** 2. row ***************************
Database: mysql
*************************** 3. row ***************************
Database: performance_schema
*************************** 4. row ***************************
Database: sys
4 rows in set (0.00 sec)
- 
List MySQL config files
cat /etc/my.cnf
*
Uninstall Mysql software.
Step 1: Uninstall MySQL Packages
# yum remove mysql mysql-server
- 
Step 2: Romove MySQL Directory
Next, you need to remove MySQL data directory from system which by default exists at /var/lib/mysql.
- 
- 
*

---


If you didn’t find this, It may be changed to some other place, which you can find in my.cnf file with variable datadir.
Delete the /var/lib/mysql directory from system but we prefer to rename it to keep a backup of existing files.
# mv /var/lib/mysql /var/lib/mysql_bkup
Step 3: Install MySQL Packages Again
After removing MySQL completely, install it again using yum package manager, It will re create mysql directory under /var/lib /.
# yum install mysql mysql-server
- 
Install mysql using Yum - Commercial Edition
[root@mysql3 826]# pwd
/soft/MySql_Software/826
[root@mysql3 826]# ll
total 2259992
-rwxrwx---. 1 root vboxsf  25466480 Jul  1 20:42 mysql-commercial-backup-8.0.26-1.1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf  47859352 Jul  1 20:42 mysql-commercial-client-8.0.26-1.1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf   4705520 Jul  1 20:42 mysql-commercial-client-p[REDACTED]
-rwxrwx---. 1 root vboxsf    643432 Jul  1 20:42 mysql-commercial-common-8.0.26-1.1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf   6816468 Jul  1 20:42 mysql-commercial-devel-8.0.26-1.1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf  23645668 Jul  1 20:43 mysql-commercial-embedded-compat-8.0.26-1.1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf   4253996 Jul  1 20:43 mysql-commercial-libs-8.0.26-1.1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf   1273960 Jul  1 20:43 mysql-commercial-libs-compat-8.0.26-1.1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf 486056336 Jul  1 20:44 mysql-commercial-server-8.0.26-1.1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf 264710388 Jul  1 20:46 mysql-commercial-test-8.0.26-1.1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf  30999700 Jul  1 20:53 mysql-router-commercial-8.0.26-1.1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf  34501768 Jun 11 14:32 mysql-shell-commercial-8.0.26-1.1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf 210602768 Jun 11 14:33 mysql-shell-commercial-debuginfo-8.0.26-1.1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf 896515161 Jul 31 17:45 p33129928_580_Linux-x86-64_8_26.zip
-rwxrwx---. 1 root vboxsf     12644 Jul 16 10:07 README.txt
-rwxrwx---. 1 root vboxsf  31002355 Jul 31 17:48 Router_p33130049_800_Linux-x86-64.zip
-rwxrwx---. 1 root vboxsf 245117662 Jul 31 18:14 Shell_p33133347_800_Linux-x86-64.zip
drwxrwx---. 1 root vboxsf      4096 Jul 31 18:48 tmp
[root@mysql3 826]#
ERRORS WHILE STARTING THE MYSQLD:
[root@mysql1 data]# systemctl start mysqld
Job for mysqld.service failed because the control process exited with error code. See "systemctl status mysqld.service" and "journalctl -xe" for details.
[root@mysql1 data]# systemctl start mysql
Failed to start mysql.service: Unit not found.
[root@mysql1 data]# systemctl status mysqld.service
●mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: failed (Result: start-limit) since Thu 2021-07-29 07:49:51 +08; 2min 37s ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 7661 ExecStart=/usr/sbin/mysqld --daemonize --p[REDACTED]=/var/run/mysqld/mysqld.pid $MYSQLD_OPTS (code=exited, status=1/FAILURE)
  Process: 7629 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
Main PID: 6132 (code=exited, status=0/SUCCESS)
Jul 29 07:49:51 mysql-primary.example.local systemd[1]: Failed to start MySQL Server.
Jul 29 07:49:51 mysql-primary.example.local systemd[1]: Unit mysqld.service entered failed state.
Jul 29 07:49:51 mysql-primary.example.local systemd[1]: mysqld.service failed.
Jul 29 07:49:51 mysql-primary.example.local systemd[1]: mysqld.service holdoff time over, scheduling restart.
Jul 29 07:49:51 mysql-primary.example.local systemd[1]: start request repeated too quickly for mysqld.service
Jul 29 07:49:51 mysql-primary.example.local systemd[1]: Failed to start MySQL Server.
Jul 29 07:49:51 mysql-primary.example.local systemd[1]: Unit mysqld.service entered failed state.
Jul 29 07:49:51 mysql-primary.example.local systemd[1]: mysqld.service failed.
[root@mysql1 data]#
Solution:
[root@mysql1 data]# journalctl -xe
-- Unit mysqld.service has failed.
--
-- The result is failed.
Jul 29 07:57:14 mysql-primary.example.local systemd[1]: Unit mysqld.service entered failed state.
Jul 29 07:57:14 mysql-primary.example.local systemd[1]: mysqld.service failed.
Jul 29 07:57:14 mysql-primary.example.local setroubleshoot[8085]: SELinux is preventing /usr/sbin/mysqld from write access on the directory data. For complete SELinux messages run: sealert -l 9c033603-866b
Jul 29 07:57:14 mysql-primary.example.local python[8085]: SELinux is preventing /usr/sbin/mysqld from write access on the directory data.

                                                     *****  Plugin catchall_labels (83.8 confidence) suggests   *******************

                                                     If you want to allow mysqld to have write access on the data directory
                                                     Then you need to change the label on data
                                                     Do
                                                     # semanage fcontext -a -t FILE_TYPE 'data'
                                                     where FILE_TYPE is one of the following: faillog_t, krb5_host_rcache_t, mysqld_db_t, mysqld_log_t, mysqld_tmp_t, mysqld_var_run_t, tmp_t, var_lib_t
                                                     Then execute:
                                                     restorecon -v 'data'


                                                     *****  Plugin catchall (17.1 confidence) suggests   **************************

                                                     If you believe that mysqld should be allowed write access on the data directory by default.
