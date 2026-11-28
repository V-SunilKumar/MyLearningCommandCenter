# MySQL configuration parameters

> Source: `MySql_Notes.pdf`, pages 3, 4, 5, 7, 8. These are source-derived notes; verify version-specific commands before using them in a current environment.


Database server and related tools
rpm -ivh mysql-community-server-8.0.26-1.el7.x86_64.rpm
- 
*
Install MySQL 8 Using YUM Packages
Go to the download page for MySQL Yum repository at https://dev.mysql.com/downloads/repo/yum/.
- 
Select and download the release package for your platform.
- 
rpm -Uvh mysql80-community-release-el7-3.noarch.rpm
- 
[root@mysql1 MySql_Software]# rpm -Uvh mysql80-community-release-el7-3.noarch.rpm
warning: mysql80-community-release-el7-3.noarch.rpm: Header V3 DSA/SHA1 Signature, key ID 5072e1f5: NOKEY
Preparing...                          ################################# [100%]
Updating / installing...
   1:mysql80-community-release-el7-3  ################################# [100%]
[root@mysql1 MySql_Software]# yum-config-manager --disable mysql80-community
Loaded plugins: langpacks
======================================================================================= repo: mysql80 -community
========================================================================================
[mysql80-community]
async = True
bandwidth = 0
base_persistdir = /var/lib/yum/repos/x86_64/7Server
baseurl = http://repo.mysql.com/yum/mysql-8.0-community/el/7/x86_64/
cache = 0
cachedir = /var/cache/yum/x86_64/7Server/mysql80-community
check_config_file_age = True
compare_providers_priority = 80
cost = 1000
deltarpm_metadata_percentage = 100
deltarpm_percentage =
enabled = False
enablegroups = True
exclude =
failovermethod = priority
ftp_disable_epsv = False
gpgcadir = /var/lib/yum/repos/x86_64/7Server/mysql80-community/gpgcadir
gpgcakey =
gpgcheck = True
gpgdir = /var/lib/yum/repos/x86_64/7Server/mysql80-community/gpgdir
gpgkey = file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
hdrdir = /var/cache/yum/x86_64/7Server/mysql80-community/headers
http_caching = all
includepkgs =
ip_resolve =
keepalive = True
keepcache = False
mddownloadpolicy = sqlite
mdpolicy = group:small
mediaid =
metadata_expire = 21600
metadata_expire_filter = read-only:present
metalink =
minrate = 0
mirrorlist =
mirrorlist_expire = 86400
name = MySQL 8.0 Community Server
old_base_cache_dir =
password =
persistdir = /var/lib/yum/repos/x86_64/7Server/mysql80-community
pkgdir = /var/cache/yum/x86_64/7Server/mysql80-community/packages
proxy = False
proxy_dict =
proxy_password =
proxy_username =
repo_gpgcheck = False
retries = 10
skip_if_unavailable = False
ssl_check_cert_permissions = True
sslcacert =
sslclientcert =
sslclientkey =
sslverify = True
throttle = 0
timeout = 30.0
ui_id = mysql80-community/x86_64
ui_repoid_vars = releasever,
   basearch
username =
-

---


[root@mysql1 MySql_Software]# yum-config-manager --enable mysql57-community
Loaded plugins: langpacks
======================================================================================= repo: mysql57 -community
========================================================================================
[mysql57-community]
async = True
bandwidth = 0
base_persistdir = /var/lib/yum/repos/x86_64/7Server
baseurl = http://repo.mysql.com/yum/mysql-5.7-community/el/7/x86_64/
cache = 0
cachedir = /var/cache/yum/x86_64/7Server/mysql57-community
check_config_file_age = True
compare_providers_priority = 80
cost = 1000
deltarpm_metadata_percentage = 100
deltarpm_percentage =
enabled = 1
enablegroups = True
exclude =
failovermethod = priority
ftp_disable_epsv = False
gpgcadir = /var/lib/yum/repos/x86_64/7Server/mysql57-community/gpgcadir
gpgcakey =
gpgcheck = True
gpgdir = /var/lib/yum/repos/x86_64/7Server/mysql57-community/gpgdir
gpgkey = file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
hdrdir = /var/cache/yum/x86_64/7Server/mysql57-community/headers
http_caching = all
includepkgs =
ip_resolve =
keepalive = True
keepcache = False
mddownloadpolicy = sqlite
mdpolicy = group:small
mediaid =
metadata_expire = 21600
metadata_expire_filter = read-only:present
metalink =
minrate = 0
mirrorlist =
mirrorlist_expire = 86400
name = MySQL 5.7 Community Server
old_base_cache_dir =
password =
persistdir = /var/lib/yum/repos/x86_64/7Server/mysql57-community
pkgdir = /var/cache/yum/x86_64/7Server/mysql57-community/packages
proxy = False
proxy_dict =
proxy_password =
proxy_username =
repo_gpgcheck = False
retries = 10
skip_if_unavailable = False
ssl_check_cert_permissions = True
sslcacert =
sslclientcert =
sslclientkey =
sslverify = True
throttle = 0
timeout = 30.0
ui_id = mysql57-community/x86_64
ui_repoid_vars = releasever,
   basearch
username =
[root@mysql1 MySql_Software]# yum repolist all | grep mysql
mysql-cluster-7.5-community/x86_64 MySQL Cluster 7.5 Community   disabled
mysql-cluster-7.5-community-source MySQL Cluster 7.5 Community - disabled
mysql-cluster-7.6-community/x86_64 MySQL Cluster 7.6 Community   disabled
mysql-cluster-7.6-community-source MySQL Cluster 7.6 Community - disabled
mysql-cluster-8.0-community/x86_64 MySQL Cluster 8.0 Community   disabled
mysql-cluster-8.0-community-source MySQL Cluster 8.0 Community - disabled
mysql-connectors-community/x86_64  MySQL Connectors Community    enabled:    212
mysql-connectors-community-source  MySQL Connectors Community -  disabled
mysql-tools-community/x86_64       MySQL Tools Community         enabled:    132
mysql-tools-community-source       MySQL Tools Community - Sourc disabled

---


mysql-tools-p[REDACTED]/x86_64         MySQL Tools Preview           disabled
mysql-tools-p[REDACTED]         MySQL Tools Preview - Source  disabled
mysql55-community/x86_64           MySQL 5.5 Community Server    disabled
mysql55-community-source           MySQL 5.5 Community Server -  disabled
mysql56-community/x86_64           MySQL 5.6 Community Server    disabled
mysql56-community-source           MySQL 5.6 Community Server -  disabled
mysql57-community/x86_64           MySQL 5.7 Community Server    enabled:    524
mysql57-community-source           MySQL 5.7 Community Server -  disabled
mysql80-community/x86_64           MySQL 8.0 Community Server    disabled
mysql80-community-source           MySQL 8.0 Community Server -  disabled
[root@mysql1 MySql_Software]#
root@mysql1 MySql_Software]#vi  /etc/yum.repos.d/mysql-community.repo
# Enable to use MySQL 5.7
[mysql57-community]
name=MySQL 5.7 Community Server
baseurl=http://repo.mysql.com/yum/mysql-5.7-community/el/7/$basearch/
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
[root@mysql1 MySql_Software]# yum repolist enabled | grep mysql
mysql-connectors-community/x86_64 MySQL Connectors Community                 212
mysql-tools-community/x86_64      MySQL Tools Community                      132
mysql57-community/x86_64          MySQL 5.7 Community Server                 524
Installing MySQL
Uninstall existing mysql binaries
- 
*
[root@mysql1 MySql_Software]# rpm -qa |grep mysql
mysql80-community-release-el7-3.noarch
qt-mysql-4.8.7-2.el7.x86_64
mysql-community-client-p[REDACTED]
akonadi-mysql-1.9.2-4.0.1.el7.x86_64
mysql-community-common-8.0.26-1.el7.x86_64
[root@mysql1 MySql_Software]# rpm -e mysql80-community-release-el7-3.noarch
warning: /etc/yum.repos.d/mysql-community.repo saved as /etc/yum.repos.d/mysql-community.repo.rpmsave
[root@mysql1 MySql_Software]# rpm -e mysql-community-client-p[REDACTED]
[root@mysql1 MySql_Software]# rpm -e mysql-community-common-8.0.26-1.el7.x86_64
[root@mysql1 MySql_Software]# rpm -qa |grep mysql
qt-mysql-4.8.7-2.el7.x86_64
akonadi-mysql-1.9.2-4.0.1.el7.x86_64
mysql80-community-release-el7-3.noarch
Install mysql using Yum
[root@mysql1 MySql_Software]# rpm -Uvh mysql80-community-release-el7-3.noarch.rpm
- 
[root@mysql1 MySql_Software]# yum install mysql-community-server
- 
Loaded plugins: langpacks, ulninfo
mysql-connectors-community                                                                                                                                                       | 2.6 kB  00:00:00
mysql-tools-community                                                                                                                                                            | 2.6 kB  00:00:00
mysql57-community                                                                                                                                                                | 2.6 kB  00:00:00
Resolving Dependencies
--> Running transaction check
---> Package mariadb-server.x86_64 1:5.5.56-2.el7 will be obsoleted
---> Package mysql-community-server.x86_64 0:5.7.35-1.el7 will be obsoleting
--> Processing Dependency: mysql-community-common(x86-64) = 5.7.35-1.el7 for package: mysql-community-server-5.7.35-1.el7.x86_64
--> Processing Dependency: mysql-community-client(x86-64) >= 5.7.9 for package: mysql-community-server-5.7.35-1.el7.x86_64
--> Running transaction check
---> Package mariadb.x86_64 1:5.5.56-2.el7 will be obsoleted
---> Package mysql-community-client.x86_64 0:5.7.35-1.el7 will be obsoleting
--> Processing Dependency: mysql-community-libs(x86-64) >= 5.7.9 for package: mysql-community-client-5.7.35-1.el7.x86_64
---> Package mysql-community-common.x86_64 0:5.7.35-1.el7 will be installed
--> Running transaction check
---> Package mariadb-libs.x86_64 1:5.5.56-2.el7 will be obsoleted
--> Processing Dependency: libmysqlclient.so.18()(64bit) for package: perl-DBD-MySQL-4.023-6.0.1.el7.x86_64
--> Processing Dependency: libmysqlclient.so.18()(64bit) for package: 1:qt-mysql-4.8.7-2.el7.x86_64
--> Processing Dependency: libmysqlclient.so.18()(64bit) for package: 2:postfix-2.10.1-6.0.1.el7.x86_64
--> Processing Dependency: libmysqlclient.so.18(libmysqlclient_18)(64bit) for package: perl-DBD-MySQL-4.023-6.0.1.el7.x86_64
--> Processing Dependency: libmysqlclient.so.18(libmysqlclient_18)(64bit) for package: 1:qt-mysql-4.8.7-2.el7.x86_64
--> Processing Dependency: libmysqlclient.so.18(libmysqlclient_18)(64bit) for package: 2:postfix-2.10.1-6.0.1.el7.x86_64
---> Package mysql-community-libs.x86_64 0:5.7.35-1.el7 will be obsoleting
--> Running transaction check
---> Package mysql-community-libs-compat.x86_64 0:5.7.35-1.el7 will be obsoleting
---> Package postfix.x86_64 2:2.10.1-6.0.1.el7 will be updated
---> Package postfix.x86_64 2:2.10.1-9.el7 will be an update
---> Package qt-mysql.x86_64 1:4.8.7-2.el7 will be updated
---> Package qt-mysql.x86_64 1:4.8.7-9.el7_9 will be an update
--> Processing Dependency: qt(x86-64) = 1:4.8.7-9.el7_9 for package: 1:qt-mysql-4.8.7-9.el7_9.x86_64
--> Running transaction check
---> Package qt.x86_64 1:4.8.7-2.el7 will be updated
--> Processing Dependency: qt(x86-64) = 1:4.8.7-2.el7 for package: 1:qt-x11-4.8.7-2.el7.x86_64
---> Package qt.x86_64 1:4.8.7-9.el7_9 will be an update
--> Running transaction check
---> Package qt-x11.x86_64 1:4.8.7-2.el7 will be updated
---> Package qt-x11.x86_64 1:4.8.7-9.el7_9 will be an update
--> Finished Dependency Resolution

---


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
