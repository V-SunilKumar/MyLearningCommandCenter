# Installation troubleshooting and SELinux

> Source: `MySql_Notes.pdf`, pages 9, 10. These are source-derived notes; verify version-specific commands before using them in a current environment.


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

---


Then you should report this as a bug.
                                                     You can generate a local policy module to allow this access.
                                                     Do
                                                     allow this access for now by executing:
                                                     # ausearch -c 'mysqld' --raw | audit2allow -M my-mysqld
                                                     # semodule -i my-mysqld.pp

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
                                                     Then you should report this as a bug.
                                                     You can generate a local policy module to allow this access.
                                                     Do
                                                     allow this access for now by executing:
                                                     # ausearch -c 'mysqld' --raw | audit2allow -M my-mysqld
                                                     # semodule -i my-mysqld.pp
Disable Firewall / selinux
  [root@mysql1 data]# service iptables stop
Redirecting to /bin/systemctl stop iptables.service
Failed to stop iptables.service: Unit iptables.service not loaded.
[root@mysql1 data]# chkconfig iptables off
error reading information on service iptables: No such file or directory
[root@mysql1 data]# cat /etc/selinux/config
[root@mysql3 ~]# service firewalld stop
[root@mysql3 ~]# service firewalld status
[root@mysql3 ~]# systemctl disable firewalld
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=disabled
# SELINUXTYPE= can take one of three two values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processes are protected.
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted
[root@mysql2 mysql75]# telnet 192.0.2.62 3306
Trying 192.0.2.62...
Connected to 192.0.2.62.
Escape character is '^]'.
THost 'mysql2-p[REDACTED]' is not allowed to connect to this MySQL serverConnection closed by foreign host.
[mysql@mysql2 ~]$ mysql -ureplica -h192.0.2.61 -p
Enter password:
ERROR 2003 (HY000): Can't connect to MySQL server on '192.0.2.61' (113)
[mysql@mysql2 ~]$ telnet 192.0.2.61 3306
Trying 192.0.2.61...
telnet: connect to address 192.0.2.61: No route to host
[mysql@mysql2 ~]$
[mysql@mysql1 ~]$ netstat -na |grep 3306
tcp        0      0 192.0.2.61:3306       0.0.0.0:*               LISTEN
[root@mysql2 mysql75]# netstat -na |grep 3306
tcp        0      0 192.0.2.62:3306       0.0.0.0:*               LISTEN
[root@mysql2 mysql75]#
