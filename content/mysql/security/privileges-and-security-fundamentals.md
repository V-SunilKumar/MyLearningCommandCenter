# Privileges and security fundamentals

> Source: `MySql_Notes.pdf`, pages 72, 73, 74. These are source-derived notes; verify version-specific commands before using them in a current environment.


MySQL uses Access Control List (ACL) to allow users privileges to access the database, the list will contain what access a user will be granted on an
object, the object could be global or tied to a specific database, event, routine or even field.
We will discuss the privilege and privilege levels as below.
Privilege
Allows
Global
DB
Table
Column
Routine
all
all privileges for the level
yes
yes
yes
no
no
all privileges
same as all
yes
yes
yes
no
no
alter
alter table
yes
yes
yes
no
no
alter routine
alter and drop stored routines
yes
yes
yes
no
no
create
create table
yes
yes
yes
no
yes
create routine
create stored routines
yes
yes
no
no
no
create temporary tables
create temporary tables
yes
yes
no
no
no
create user
create/drop/rename user, revoke all privileges
yes
no
no
no
no
create view
create view
yes
yes
yes
no
no
delete
delete
yes
yes
yes
no
no
drop
drop table
yes
yes
yes
no
no
event
event creation
yes
yes
no
no
no
execute
run stored routines
yes
yes
no
no
no
file
select ... into outfile,
load data infile
yes
no
no
no
no
index
create/drop index
yes
yes
yes
no
no
insert
insert
yes
yes
yes
no
no
lock tables
lock tables on all tables the user is allowed the select privilege
yes
yes
no
no
no
process
show processlist
yes
no
no
no
no
references
unused
yes
yes
yes
yes
no
reload
flush
yes
no
no
no
no
replication client
can determine master and slave hosts
yes
no
no
no
no
replication slave
reading binary log events
yes
no
no
no
no
select
select
yes
yes
yes
yes
no
show databases
shows all databases, including those that the user has no privileges for
yes
no
no
no
no
show view
show create view
yes
yes
yes
no
no
shutdown
mysqladmin shutdown
yes
no
no
no
no
super
change master, kill, purge master logs, set global, mysqladmin debug, one
connection even if there are already max_connections
yes
no
no
no
no
trigger
create/drop trigger
yes
yes
yes
no
no
update
update
yes
yes
yes
yes
no
usage
authentication only
yes
yes
yes
no
no
with grant option
grant for the privilege specified
yes
yes
yes
yes
yes
Here is a simple table that you can give to the type of user, this is only a guide, you can combine any of the roles if the user has a dual role.
User Role
Privilege
Application, read-only
select
Application, read/write
delete, execute, insert, select, update
Monitoring
usage
Replication monitoring
replication client
Replication slave
replication slave
Schema Administrator
alter, alter routine, create, create routine, create view, drop, event, execute, index, show databases, trigger
Developer
file
DBA
create user, event, file, lock tables, process, flush, replication client, show databases, shutdown, super, with grant option
Operating System Level
There are a number of parameters that you can set in the my.cnf file to make the database more secure from external users or crackers, you can do
things like binding the IP address, change the listening port, change the socket file location, here is a list of what you should be aware of
Option
Example usage
Description
bind-address
bind-address=192.0.2.50
binds the mysqld server to the specified IP address, only one IP address can be specified
enable-named-pipe
enable-named-pipe
enables connectivity to mysqld on windows via named pipes
port
port=3307
specifies the port that mysqld listens on
shared-memory
shared-memory
enables connectivity to mysqld on windows via shared memory, the client will connect using the protocol=memory option.
skip-name-resolve
skip-name-resolve
mysqld will not lookup DNS names, this is off by default.
skip-networking
skip-networking
mysqld will not listen on any port
socket
socket=/tmp/mysqld.sock
specifies the location of the mysqld socket.
Data Security
You cannot have a security breach on data that you do not store, so try to remove any old data that you do not need, also store sensitive information
in encrypted format, for example passwords should be store using one-way hash which means the algorithm for the one-way hash would have to be broken
before they can decrypt your information.
Security
Tuesday, July 27, 2021
10:14 PM

---


Data flow is one of the most important aspects of data security, very often there are a few places where data is checked and secured and after that
point the data is deemed to be trustworthy, below is an example of data flow
User enters text into a field on an HTML form and clicks a Submit button
1.
Javascript verifies the test to ensure it has only valid characters
2.
The text gets sent to the next page, which performs am SQL query using that text
3.
The above data flow shows only one way to limit the SQL injection, a malicious user could bypass the HTML form sending HTML POST or GET requests to
the page performing the SQL query, because the page performing the SQL assumes the data has already been validated, SQL injection can occur.
The malicious could replace parts of the SQL code with his own SQL that could reveal information that you don't want him to see, newer firewall's can
protect against this sort of thing but also make sure that your application does as well.
SQL injection
## The original SQL code
insert into customer (first_name, last_name) values ($first_name, $last_name);
## When the user fills in the form and submits the SQL becomes
insert into customer (first_name, last_name) values ('paul', 'valle');
## what if the malicious user types the following into the first field
valle', (select last_name from staff limit 1)); select concat(;
## the injected malicious SQL code would end up like
insert into customer (first_name, last_name) values ('paul', select last_name from staff limit 1)); select concat('','valle');
The other security point to make is that all sensitive data should be encrypted when set across a network, even if it an internal one, network
sniffers can be used to obtain packets where a malicious user could then examine the packets for any unencrypted data, which may contain passwords or
other sensitive information.
one way to encrypt data going across the wire is to setup a SSH tunnel, encrypting connectivity mysqld is not difficult to archive, encrypted
connectivity is managed on a per user basis, by default the connection is not encrypted.
setting up a encrypted connection
## First check that you have encrypted support, you should see have_openssl and have_ssl they may be set to disabled
show global variables like '%ssl';
## Then check that the grant tables can support setting encryption requirements for user
select column_name from information_schema.columns where table_schema='mysql' and table_name='user' and (column_name like 'ss%' or column_name like
'x509%');
## setup a public and private key, the public key is stored in a certificate file and the private key is stored in a key file. You do this at the
operating system level
shell> openssl req -nodes -new -out mysql-server.csr -days 3650 -keyout mysql-server.key
## at this point your certficate signing request must be signed off by a Certificate Authority (for example VeriSign), or you could use your own CA.
Once signed you will have a certificate file containing the public key.
## now setup the my.ini file to point to the new certficates
ssl-ca=/path/to/cacert.pem
ssl-cert=/path/to/mysql-server.csr
ssl-key=/path/to/mysql-server.key
## restart mysqld and see if the system variables are now set to yes
show global variables like '%ssl';
## at this point any user can create an encrypted connection if he/she has access to the same CA certificate file
shell> mysql -u <user> -p --ssl=/path/to/cacert.pem
## to check that the connection is encrypted, this field should not be blank.
show session status like 'ssl_cipher';
## you can force users to only connect securely, notice the require ssl at the end
grant seelct on <user>.* to read_secure@localhost require ssl;

---


Simulation
Sunday, July 25, 2021
5:58 PM
