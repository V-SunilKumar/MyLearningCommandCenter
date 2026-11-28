# Triggers, stored routines, cursors and events

> Source: `MySql_Notes.pdf`, pages 43, 44, 45, 46. These are source-derived notes; verify version-specific commands before using them in a current environment.


Stored Routines, Triggers, Cursors and Events
Stored routines, triggers and events enable different applications to use the same set of queries, developers build libraries of SQL code that is
stored and can be used by other developers and applications. There are four types of stored SQL
Triggers
- 
Stored Procedures
- 
Stored Functions
- 
Events
- 
A trigger is invoked automatically when an SQL statement changes rows on a specified table that has a trigger attached, an event is invoked
automatically at a predetermined time and can be a one time occurrence or a regular occurrence. A stored procedure is invoked manually with
the call statement, taking zero or more arguments and can pass back values through its output variables. A stored function is invoked manually by
directly using's its name, taking zero or more arguments and outputting a scalar value.
Here is a comparison of each
Triggers
Stored Procedures
Stored Functions
Events
Language
SQL
SQL
SQL
SQL
Created, changed and removed by
SQL statement
SQL statement
SQL statement
SQL statement
Invoked
automatically when a tables data is changed
manually via
CALL proc-name()
manually via
func_name()
automatically when scheduled event time arrives
Arguments
none
yes
yes
none
Output
none
one or more result sets
limited to one scalar value
none
Associated with
table
database
database
database
Unique namespace
database
database
database
database
Triggers
A trigger is a command invoked automatically when an SQL statement changes data in a associated table, it can be invoked on insert,
update and delete statements. It can also occur before the data is changed or after the data has changed. Views and temporary tables do not support
triggers. MySQL allows for a maximum of six triggers per table
before insert
- 
after insert
- 
before update
- 
after update
- 
before delete
- 
after delete
- 
Any other statement that changes tables data will not invoke the trigger, for example drop table or truncate will not invoke any triggers. Some SQL
statements do use a trigger command for example load data uses the insert statement and therefore will invoke a trigger, so double check the SQL
command to see if behind the scenes it uses a trigger invoking statement.
displaying
show triggers on table_name
show create trigger trigger_name
creating
create trigger trigger_name [before|after] [insert|update|delete] on tablename for each row [statement]
create trigger staff_update_date
before insert on staff
for each row
  set new.last_update = now();
## Multi statement trigger, first set the delimiter because you will use ; inside the trigger statement
sql> delimiter |
create trigger before_staff_insert
before insert on staff
for each row
begin
  insert into staff_creation_log (username, when_created) values (NEW.username, now());
  set new.last_update = now();
end
|
## define the user that will invoke the trigger
create trigger definer = [ user|current_user() ] staff_update_date before insert on staff for each row set new.last_update = now();
dropping
drop trigger trigger_name
drop trigger if exists trigger_name
changing
## Unfortunately there is no change command you have drop and recreate the trigger
By default a trigger is saved with the sql_mode of the user defining the trigger. This may lead to problem if the execution environment has a very
different sql_mode than the definition environment. If a trigger is not acting as expected, check the sql_mode of the trigger. You can use the show
create trigger and show triggers to display the sql_mode associated with a trigger, there is no way to set the sql_mode different from the defining
environment, to change the sql_mode you have to
drop the trigger
- 
set the desired sql_mode with set @@sql_mode={string}
- 
re-create the trigger
- 
reset the sql_mode back to what the client was originally running
- 
Triggers are also created using the character set and collation that have been set the in system
variables character_set_client and collation_connection. Again if you wish to change these you need to drop the trigger and recreate it as per
above.
By default the trigger is invoked as the user who defined the trigger, you can change this using the definer option see above for example.
Triggers are stored in the data dictionary in files named .TRG (maps triggers to tables) and .TRN (contains the trigger definition). The
information_schema has a table called triggers that supplies information on all triggers in the system.
Triggers are not replicated and there actions are not saved in the binary log in statement-based replication, so you must define them in both master
and slave servers. Triggers have a number of other limitations, triggers cannot
Stored Routines, Triggers, Cursors and Events
Wednesday, July 28, 2021
5:24 PM

---


be defined on a table in the mysql database
- 
use select without saving the results into variable_name
- 
be used in show commands
- 
be used in load data or load table commands
- 
be used in backup database command
- 
be used in restore command
- 
be used with dynamic SQL
- 
be used with prepare statement commands (prepare, execute, deallocate prepare)
- 
be used with statements that do commit or rollback (commit, rollback, start transaction, un/lock tables, truncate table, alter, create, drop,
rename)
- 
be used with flush statements
- 
be used in alter view
- 
be used with returns
- 
no support for DDL triggers
- 
no support for compound triggers
- 
no support for instead...of triggers
- 
no support for system triggers
- 
Stored Routines
A stored routine (procedure or function) allows a user to define a set of statements that they can call later in a query, they make repetitive tasks
involving many queries easier. The reasons why you would use a store routine are
Code Reuse - different applications can use the same stored routines, instead of using repetitive code
- 
Black Box queries - developers can call routines without having to know the code inside, they just need to know what goes in and what should
come out
- 
Security via API - auditing functionality and logging can be implemented inside the stored routine
- 
Security via ACL constraints - additional privileges can be given to the stored routine, allowing users access to tables and columns
- 
Stored routines are compiled the first time they are run, subsequent stored routine calls in the same connection are cached. However MySQL is
different from other databases as the stored routine is not compiled and stored (in native code), it is only compiled during your session and not
saved, thus if you connect multiple times each time the store routine will have to be compiled which is a performance impact.
create stored procedure
## see below for the options
create procedure procedure_name (IN name data_type , OUT name data_type , INOUT name data_type )
  [options]
  sql statement
## create a stored procedure
delimiter |
create procedure store_offerings (IN p_store_id tinyint unsigned, OUT p_count int unsigned)
  select count(*) into p_count from inventory where store_id = p_stored_id;
|
delimiter :
## invoke the procedure
call store_offerings(1,@store_1_offerings);
create stored function
## see below for the options
create function function_name (name data_type)
  returns type
  [options]
  sql statement
## create a stored function, this is no OUT in functions
delimiter |
create function get_store_id (f_staff_id tinyint unsigned)
  returns tinyint unsigned
    reads sql data
    begin
    declare f_store_id tinyint unsigned;
    select store_id into f_store_id from staff where staff_id=f_staff_id;
    return f_store_id;
    end
|
delimiter :
## invoke the procedure
select get_store_id(1);
change a stored routine
# you can only change the following: comment, sql usage, sql security
# if you need to change anything else you have to drop it and recreate it
alter procedure procedure_name options
alter procedure increment_counter comment "change comment" contains SQL;
display stored routine code
# the routines table contains other columns as well
select specific_name, routine_type, routine_definition from information_schema.routines;
There are a number of options that you can use with stored routines
store routine options
## The list of options are
sql security [definer|invoker]
comment 'comment string'
language sql
[not] deterministic
[contains sql | no sql | reads sql data | modifies sql data]
Stored Routine Options
sql security
The sql security comes with two options
definer - this is the default and when invoked the stored routine will run as the definer
- 
invoker - when invoked the stored routine will run as the invoker
- 
comment
this is self explanatory
language
the only option is SQL but one day MySQL may introduce language support
deterministic
means that the stored routine will allows produce the same output when give the same input, it is classed as non -deterministic if the same inputs do not produce the same output everytime.
SQL usage
the sql usage comes with a number of options, they are for informational purposes only and do not affect the routine in any w ay
modifies sql data - the stored routine may update data
- 
reads sql data - the stored routine does not contain sql that will update data
- 
contains sql - the stored routine does not read and write data
- 
no sql - stored routine has no sql statements in it
-

---


There are a number of flow control statements that you can use in your stored routines, I will only list the definition here and leave you to have a
play around
if
if condition then statement_list
[elseif condition then statement_list]
[else statement_list]
end if
case
case expr
when condition then statement_list
[else statement_list]
end case
while
[label:] while condition
  statement_list
end while [label]
repeat
[label:] repeat condition
  statement_list
end repeat [label]
loop
[label:] loop
  statement_list
end loop [label]
iterate
iterate label
leave
leave label
You can use recursive stored procedures but not recursive stored functions, the system parameter max_sp_recursion_depth limits the number of times a
procedure can be called recursively, the maximum value is 255.
Handlers
MySQL allows you to specify handlers that can trap conditions (basically they are event listeners), this allows you to handle known exceptions.
Using the declare syntax you can create a handler to specify what you want to do when a condition is met. You can have two types of
handlers continue or exit (there is a third called undo but it has not been implemented yet), for example a continue handler hears an event and
takes the prescribed action and continues the program execution with the next execution instruction.
You can use one of the following range of conditions
SQLWARNING - the SQL state of all warnings (sqlstate values starting with 1)
- 
NOT FOUND - the state when a cursor has reached the end of a data set (sqlstate values starting with 2)
- 
SQLEXCEPTION - any SQL state other than above (sqlstate values starting with 3)
- 
SQLSTATE - a specific state
- 
I also have some examples in the cursor section below, one point to make is that all declare conditions must occur before any declare handler.
handler examples
DECLARE [continue|exit|undo] handler for
  [sqlstate [value] value | sqlexception | sqlwarning | not found | error_code | condition ] statement block
## below is looking for a specific state, it is the same as the NOT FOUND, if the state event triggers
## a variable is set, generally this is used in cursors
DECLARE continue handler for sqlstate '02000' set loop_end = 1;
## here is a exit example looking for duplicate keys.
declare exit handler for duplicate statement
Cursors
Developers like to be able to go through a data set one by one and this is where cursors can help, it can be thought of as a position is a list, you
can use a cursor to iterate through each entry in a result set. Cursors can be used in triggers, stored procedures and stored functions, the steps
to using a cursor are the following
define the cursor - use the declare statement
- 
open the cursor - use the open statement
- 
retrieve value(s) from the cursor - use the fetch ... into statement
- 
close the cursor - use the close statement
- 
One point to make is that you must declare all variables before the cursor otherwise MySQL will complain, the SQL statement can be as complex as you
want to make it and you can have multiple cursors, the example below I try and make things as simple as possible to show you how a cursor works.
cursor example
## First create a test table and enter some values
create table test_cursor (id int);
insert into test_cursor values (1);
insert into test_cursor values (2);
insert into test_cursor values (3);
insert into test_cursor values (4);
insert into test_cursor values (5);
## Next create the procedure using a cursor, you can use a select statement to debug
delimiter |
create procedure test ()
begin
/* make sure all variables are declared before any cursors or handlers are declared */
/* you will get a warning if you don't */
DECLARE loop_end int default 0;
DECLARE output text default 'X';
DECLARE userid int;
/* make sure any cursors and handlers are declared after all variables have been declared */
DECLARE cur1 CURSOR FOR SELECT id from test_cursor;
DECLARE continue handler for sqlstate '02000' set loop_end = 1;
OPEN cur1;
REPEAT
  FETCH cur1 INTO userid;
  /* USED for DEBUGGING - select 'inside repeat loop' AS "Location"; */
  IF NOT loop_end THEN
    SET output = CONCAT(output, ", ", userid);
    /* USED for DEBUGGING - select 'inside IF statement' AS "Location"; */
  END IF;
UNTIL loop_end END REPEAT;
CLOSE cur1;
SELECT output;
end;
|
delimiter ;
## Invoke the procedure and see what we get, notice the default value is used
mysql> call test();
+------------------+
| output           |
+------------------+

---


| X, 1, 2, 3, 4, 5 |
+------------------+
1 row in set (0.00 sec)
Query OK, 0 rows affected, 1 warning (0.00 sec)
Events
An event is a set of SQL commands that can be scheduled to run once or at regular intervals, its very similar to the cron utility in Unix or the
Task scheduler in Windows. You can schedule database administrator tasks such as performing backups or logging events, however I do using the O/S's
scheduler.
Before you can use the scheduler you must turn it on, the system parameter event_scheuler must be set to ON
turn the scheduler on/off
set global event_scheduler = on;
set global event_scheduler = off;
show global variables like 'event_scheduler';
check the scheduler is running
select id, user, host, db, command, time, state, info from information_schema.processlist where user='event_scheduler'\G
Here are some example on how to create events
display events
show events;
show create event;
select * from information_schema.events where event_name = 'event_name';
create events
create event event_name on schedule [option] schedule do statement;
options: disable, comment
## example one, check to see if the scheduler is working as a log entry should be recorded
## every minute as per the event
create table event_scheduler_log (event_time datetime not null);
create event event_scheduler_test on schedule every 1 minute do
  insert into event_scheduler_log (event_time) values (now());
dropping events
drop event event_scheduler_test;
changing an event # you can change everything if you like, the example renames the event
alter event event_scheduler_test rename to event_scheduler_disabled;
By default events are enabled as soon as you create them, you can use the disable option to prevent this from happening. By default the events are
dropped after there last execution, you can stop this by using the on completion preserve option. All events are logged in the mysqld error log file
plus any errors.
Like triggers and stored routines events have a sql_mode that they run in and like triggers and stored routines you need to recreate them if you
wish to change this mode, you can obtain the sql_mode by using the show create event command, this is also the same with the character set and
collation.
There are a number of event limitations, the below SQL statements are not allowed in a create event statement
alter view
- 
lock/unlock tables
- 
load data/table
- 
backup database
- 
restore
- 
insert delayed
- 
Conclusion
I have only touched the above subjects lightly, you could write whole books on programming in SQL, I may come back to this section and update it for
time to time but for the time being if you want to see advanced SQL programming I will leave you to the MySQL documentation.
