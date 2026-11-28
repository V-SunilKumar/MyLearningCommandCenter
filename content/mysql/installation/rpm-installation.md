# RPM package installation

> Source: `MySql_Notes.pdf`, pages 2, 3, 4, 5, 6, 7. These are source-derived notes; verify version-specific commands before using them in a current environment.


Install MySQL 8 on Linux 7 Using RPM Packages
Download RPM Packages
https://dev.mysql.com/downloads/mysql/
*
https://dev.mysql.com/downloads/file/?id=501382
*
- 
Disable SELINIX and firewall
[root@mysql2 mysql75]# vi /etc/selinux/config
[root@mysql1 sysconfig]# service ipchains stop
[root@mysql1 sysconfig]# service iptables stop
[root@mysql1 sysconfig]# chkconfig ipchains off
[root@mysql1 sysconfig]# chkconfig iptables off
[root@mysql1 ~]# systemctl stop firewalld
[root@mysql1 ~]# systemctl disable firewalld
[root@mysql1 ~]# systemctl status  firewalld
- 
systemctl stop firewalld; systemctl disable firewalld; systemctl status  firewalld
Ping Test to all VM's
ping 192.0.2.61
ping 192.0.2.62
ping 192.0.2.63
ping 192.0.2.64
ping mysql-primary.example.local
ping mysql-replica.example.local
ping mysql-node3.example.local
ping mysql-node4.example.local
ping mysql1
ping mysql2
ping mysql3
ping mysql4
- 
Create mysql user and group
groupadd mysql
*
useradd -u 2001 -g mysql -d /home/mysql -s /bin/bash mysql
*
usermod -a -G vboxsf mysql
*
passwd mysql
[REDACTED]
*
- 
Untar RPM Packages
su -
*
cd /soft/MySql_Software
*
tar -xvf MySql_CE-8.0.26-1.el7.x86_64.rpm-bundle.tar
*
- 
[root@mysql1 MySql_Software]# tar -xvf MySql_CE-8.0.26-1.el7.x86_64.rpm-bundle.tar
mysql-community-client-8.0.26-1.el7.x86_64.rpm
mysql-community-client-p[REDACTED]
mysql-community-common-8.0.26-1.el7.x86_64.rpm
mysql-community-devel-8.0.26-1.el7.x86_64.rpm
mysql-community-embedded-compat-8.0.26-1.el7.x86_64.rpm
mysql-community-libs-8.0.26-1.el7.x86_64.rpm
mysql-community-libs-compat-8.0.26-1.el7.x86_64.rpm
mysql-community-server-8.0.26-1.el7.x86_64.rpm
mysql-community-test-8.0.26-1.el7.x86_64.rpm
Check the files ownership to mysql group & user.
*
[root@mysql1 MySql_Software]# ls -ltra
total 2099872
-rwxrwx---. 1 root vboxsf  47836256 Jul  2 02:48 mysql-community-client-8.0.26-1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf   4694644 Jul  2 02:48 mysql-community-client-p[REDACTED]
-rwxrwx---. 1 root vboxsf    634632 Jul  2 02:48 mysql-community-common-8.0.26-1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf   6806272 Jul  2 02:49 mysql-community-devel-8.0.26-1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf  23638156 Jul  2 02:49 mysql-community-embedded-compat-8.0.26-1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf   4243808 Jul  2 02:49 mysql-community-libs-8.0.26-1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf   1264168 Jul  2 02:49 mysql-community-libs-compat-8.0.26-1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf 454689776 Jul  2 02:50 mysql-community-server-8.0.26-1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf 264457624 Jul  2 02:53 mysql-community-test-8.0.26-1.el7.x86_64.rpm
-rwxrwx---. 1 root vboxsf 312845162 Jul 20 11:56 mysql-5.6.27-linux-glibc2.5-x86_64.tar.gz
-rwxrwx---. 1 root vboxsf 220835840 Jul 20 11:58 MySQL-5.6.29-1.el6.x86_64.rpm-bundle.tar
-rwxrwx---. 1 root vboxsf 808273920 Jul 29 02:29 MySql_CE-8.0.26-1.el7.x86_64.rpm-bundle.tar
Install MySQL 8 Using RPM Packages
Common files for server and client libraries
rpm -ivh mysql-community-common-8.0.26-1.el7.x86_64.rpm
- 
rpm -evh mysql-community-common-8.0.26-1.el7.x86_64.rpm
- 
*
MySQL client applications plugins
rpm -ivh mysql-community-client-p[REDACTED]
- 
rpm -evh mysql-community-client-p[REDACTED]
- 
- 
*
Shared libraries for MySQL database client applications
rpm -ivh mysql-community-libs-8.0.26-1.el7.x86_64.rpm
- 
*
Shared compatibility libraries for previous MySQL installations
rpm -ivh mysql-community-libs-compat-8.0.26-1.el7.x86_64.rpm
- 
*
MySQL client applications and tools
rpm -ivh mysql-community-client-8.0.26-1.el7.x86_64.rpm
- 
*
- 
Installation
Tuesday, July 20, 2021
12:06 PM

---


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


Dependencies Resolved
============================================================================================================================= ===========================================================================
Package                                                    Arch                                  Version                                        Repository                                        Size
============================================================================================================================= ===========================================================================
Installing:
mysql-community-client                                     x86_64                                5.7.35-1.el7                                   mysql57-community                                 25 M
     replacing  mariadb.x86_64 1:5.5.56-2.el7
mysql-community-libs                                       x86_64                                5.7.35 -1.el7                                   mysql57-community                                2.4 M
     replacing  mariadb-libs.x86_64 1:5.5.56-2.el7
mysql-community-libs-compat                                x86_64                                5.7.35-1.el7                                   mysql57-community                                1.2 M
     replacing  mariadb-libs.x86_64 1:5.5.56-2.el7
mysql-community-server                                     x86_64                                5.7.35-1.el7                                   mysql57-community                                174 M
     replacing  mariadb-server.x86_64 1:5.5.56-2.el7
Installing for dependencies:
mysql-community-common                                     x86_64                                5.7.35 -1.el7                                   mysql57-community                                310 k
Updating for dependencies:
postfix                                                    x86_64                                2:2.10.1-9.el7                                 ol7_latest                                       2.4 M
qt                                                         x86_64                                1:4.8.7 -9.el7_9                                ol7_latest                                       4.6 M
qt-mysql                                                   x86_64                                1:4.8.7 -9.el7_9                                ol7_latest                                        31 k
qt-x11                                                     x86_64                                1:4.8.7 -9.el7_9                                ol7_latest                                        13 M
Transaction Summary
============================================================================================================================= ===========================================================================
Install  4 Packages (+1 Dependent package)
Upgrade             ( 4 Dependent packages)
Total download size: 223 M
Is this ok [y/d/N]: y
Downloading packages:
No Presto metadata available for ol7_latest
warning: /var/cache/yum/x86_64/7Server/mysql57-community/packages/mysql-community-common-5.7.35-1.el7.x86_64.rpm: Header V3 DSA/SHA256 Signature, key ID 5072e1f5: NOKEY
Public key for mysql-community-common-5.7.35-1.el7.x86_64.rpm is not installed
(1/9): mysql-community-common-5.7.35-1.el7.x86_64.rpm                                                                                                                            | 310 kB  00:00:00
(2/9): mysql-community-libs-5.7.35-1.el7.x86_64.rpm                                                                                                                              | 2.4 MB  00:00:00
(3/9): mysql-community-libs-compat-5.7.35-1.el7.x86_64.rpm                                                                                                                       | 1.2 MB  00:00:00
(4/9): mysql-community-client-5.7.35-1.el7.x86_64.rpm                                                                                                                            |  25 MB  00:00:00
(5/9): mysql-community-server-5.7.35-1.el7.x86_64.rpm                                                                                                                            | 174 MB  00:00:03
warning: /var/cache/yum/x86_64/7Server/ol7_latest/packages/postfix-2.10.1-9.el7.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID ec551f03: NOKEY=============-      ] 580 kB/s | 204 MB  00:00:32 ETA
Public key for postfix-2.10.1-9.el7.x86_64.rpm is not installed
(6/9): postfix-2.10.1-9.el7.x86_64.rpm                                                                                                                                           | 2.4 MB  00:00:24
(7/9): qt-4.8.7-9.el7_9.x86_64.rpm                                                                                                                                               | 4.6 MB  00:00:24
(8/9): qt-mysql-4.8.7-9.el7_9.x86_64.rpm                                                                                                                                         |  31 kB  00:00:01
(9/9): qt-x11-4.8.7-9.el7_9.x86_64.rpm                                                                                                                                           |  13 MB  00:00:01
----------------------------------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------
Total                                                                                                                                                                   8.2 MB/s | 223 MB  00:00:27
Retrieving key from file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Importing GPG key 0x5072E1F5:
Userid     : "MySQL Release Engineering <mysql-build@oss.oracle.com>"
Fingerprint: a4a9 4068 76fc bd3c 4567 70c8 8c71 8d3b 5072 e1f5
Package    : mysql80-community-release-el7-3.noarch (installed)
From       : /etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Is this ok [y/N]: y
Retrieving key from file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
Importing GPG key 0xEC551F03:
Userid     : "Oracle OSS group (Open Source Software group) <build@oss.oracle.com>"
Fingerprint: 4214 4123 fecf c55b 9086 313d 72f9 7b74 ec55 1f03
Package    : 7:oraclelinux-release-7.5-1.0.3.el7.x86_64 (@anaconda/7.5)
From       : /etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
Is this ok [y/N]: y
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
Warning: RPMDB altered outside of yum.
  Installing : mysql-community-common-5.7.35-1.el7.x86_64                                                                                                                                          1/16
  Installing : mysql-community-libs-5.7.35-1.el7.x86_64                                                                                                                                            2/16
  Installing : mysql-community-libs-compat-5.7.35-1.el7.x86_64                                                                                                                                     3/16
  Updating   : 1:qt-4.8.7-9.el7_9.x86_64                                                                                                                                                           4/16
  Installing : mysql-community-client-5.7.35-1.el7.x86_64                                                                                                                                          5/16
  Installing : mysql-community-server-5.7.35-1.el7.x86_64                                                                                                                                          6/16
  Updating   : 1:qt-x11-4.8.7-9.el7_9.x86_64                                                                                                                                                       7/16
  Updating   : 1:qt-mysql-4.8.7-9.el7_9.x86_64                                                                                                                                                     8/16
  Updating   : 2:postfix-2.10.1-9.el7.x86_64                                                                                                                                                       9/16
  Cleanup    : 1:qt-mysql-4.8.7-2.el7.x86_64                                                                                                                                                      10/16
  Erasing    : 1:mariadb-server-5.5.56-2.el7.x86_64                                                                                                                                               11/16
  Erasing    : 1:mariadb-5.5.56-2.el7.x86_64                                                                                                                                                      12/16
  Cleanup    : 2:postfix-2.10.1-6.0.1.el7.x86_64                                                                                                                                                  13/16
  Cleanup    : 1:qt-x11-4.8.7-2.el7.x86_64                                                                                                                                                        14/16
  Cleanup    : 1:qt-4.8.7-2.el7.x86_64                                                                                                                                                            15/16
  Erasing    : 1:mariadb-libs-5.5.56-2.el7.x86_64                                                                                                                                                 16/16
  Verifying  : mysql-community-server-5.7.35-1.el7.x86_64                                                                                                                                          1/16
  Verifying  : mysql-community-client-5.7.35-1.el7.x86_64                                                                                                                                          2/16
  Verifying  : 1:qt-x11-4.8.7-9.el7_9.x86_64                                                                                                                                                       3/16
  Verifying  : 1:qt-4.8.7-9.el7_9.x86_64                                                                                                                                                           4/16
  Verifying  : mysql-community-libs-5.7.35-1.el7.x86_64                                                                                                                                            5/16
  Verifying  : mysql-community-common-5.7.35-1.el7.x86_64                                                                                                                                          6/16
  Verifying  : 2:postfix-2.10.1-9.el7.x86_64                                                                                                                                                       7/16
  Verifying  : mysql-community-libs-compat-5.7.35-1.el7.x86_64                                                                                                                                     8/16
  Verifying  : 1:qt-mysql-4.8.7-9.el7_9.x86_64                                                                                                                                                     9/16
  Verifying  : 1:mariadb-libs-5.5.56-2.el7.x86_64                                                                                                                                                 10/16
  Verifying  : 1:qt-mysql-4.8.7-2.el7.x86_64                                                                                                                                                      11/16
  Verifying  : 1:qt-4.8.7-2.el7.x86_64                                                                                                                                                            12/16
  Verifying  : 1:mariadb-server-5.5.56-2.el7.x86_64                                                                                                                                               13/16
  Verifying  : 2:postfix-2.10.1-6.0.1.el7.x86_64                                                                                                                                                  14/16
  Verifying  : 1:qt-x11-4.8.7-2.el7.x86_64                                                                                                                                                        15/16
  Verifying  : 1:mariadb-5.5.56-2.el7.x86_64                                                                                                                                                      16/16
Installed:
  mysql-community-client.x86_64 0:5.7.35-1.el7     mysql-community-libs.x86_64 0:5.7.35-1.el7     mysql-community-libs-compat.x86_64 0:5.7.35-1.el7     mysql-community-server.x86_64 0:5.7.35-1.el7

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
