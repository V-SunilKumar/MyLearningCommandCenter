# Views and view options

> Source: `MySql_Notes.pdf`, pages 39, 40. These are source-derived notes; verify version-specific commands before using them in a current environment.


Views are tools that assist in denormalizing data such as for analysis without change the underlying system, they also allow for simplicity,
abstraction, added security and easier schema migration, however they do not improve performance. Views can be used to
Restrict access to a subset of rows
- 
Simplify queries
- 
Simulate check constraints
- 
display views
select * from information_schema.views where table_name ='view_name';
show tables;
show create table view_name;
show create view view_name;
create
create
[or replace]
[algorithm = [undefined|merge|temptable]]
[definer = user | current_user]
[sql security [definer | invoker]]
view viewname as
[ select statement]
[with cascade|local] check option]
## example one
create view staff_name as select first_name, last_name from employees;
## example two
create or replace staff_name as select concat(first_name, ' ' , last_name) as full_name from employees;
## example three, using sql security
create
definer=vallep@localhost
sql security definer
view staff_name AS
  select first_name, last_name from employees;
## example using the temptable algorithm
create
algorithm = temptable
view staff_name AS
  select first_name, last_name from employees;
alter
alter
[algorithm = [undefined|merge|temptable]]
[definer = user | current_user]
[sql security [definer | invoker]]
view viewname as
[ select statement]
[with cascade|local] check option]
drop
drop view staff_name
There a a few limitations regarding views
have a derived table (subquery in the from clause)
- 
access user variables, system variables, local variables, stored variables or prepared statement parameters
- 
refer to a temporary table
- 
refer to a table that does not exist, although it is possible to drop the table after creating a view
- 
be careful when using order by if the view already has an order by, strange results may occur.
- 
Views are generally used to allow access to columns on a tables that the user may not have permissions on table, MySQL has ad ded an sql
security extension to view data that he/she may not have access too. You have two choices
SQL SECURITY INVOKER - use the permissions of the invoker
- 
SQL SECURITY DEFINER - use the permissions of the definer who created the view (default)
- 
I have an example in the above table on how to use sql security.
By default the results of the query are not cached, however it change be changed using the system parameter query_cache,
MySQL has an extension to the standard SQL to help with performance, the algorithm clause specifies which algorithm MySQL will process the view,
the merge algorithm option processes a query on a view by merging the query with the view definition. The temptable option is specified the view is
processed and the output is stored in a temporary table, then the temporary table is used in the query. By default the algorithm is set to
undefined, which means that MySQL will choose which is most efficient, however merge is more preferred than temptable, however locks on a base
table are released when temporary table is generated, which could lead to better performance overall because there is less time spent waiting for
locks to be released.
Mysql does not offer materialized views, a sort of snapshot of a table, it also does not not offer check constraints however, you can simulate them
using the with check option in a view definition. Here is an example
simulated check option
create or replace
  algorith = undefined
  definer=vallep@localhost
  sql security definer
  view staff_email_view AS
    select first_name, last_name, email from staff where email like '%@datadisk%.co.uk'
  with check option;
## test the check option
update staff_email_view set email'paul.valle' where first_name='Paul' and last_name='Valle';
Here is a summary of examples using all of the options available to views, I have used a simple select statement to keep thin gs as simple as
possible, notice what the table in information_schema.views is and how the options affect the columns
view options
## a simple create view statement
create view view_pkey as
select fname, lname from pkey;
## using the definer option
create definer=app_user@localhost
view definer_view_test_pkey as
select fname, lname from pkey;
## using the algorithm option with merge
create
algorithm = merge
view merge_test_pkey_view as
select fname, lname from pkey;
## using the algorithm option with temptable
Views
Wednesday, July 28, 2021
5:19 PM

---


create
algorithm = temptable
view temptable_test_pkey_view as
select fname, lname from pkey;
## using the check option
create
view check_option_test_pkey_view as
select fname, lname from pkey
with check option;
mysql> select table_schema, table_name, check_option, is_updatable, definer, security_type from information_schema.views;
+--------------+-----------------------------+--------------+--------------+------------------+---------------+
| table_schema | table_name                  | check_option | is_updatable | definer          | security_type |
+--------------+-----------------------------+--------------+--------------+------------------+---------------+
| datadisk     | check_option_test_pkey_view | CASCADED     | YES          | root@localhost   | DEFINER       |
| datadisk     | definer_view_test_pkey      | NONE         | YES          | app_user@localhost | DEFINER       |
| datadisk     | merge_test_pkey_view        | NONE         | YES          | root@localhost   | DEFINER       |
| datadisk     | temptable_test_pkey_view    | NONE         | NO           | root@localhost   | DEFINER       |
| datadisk     | view_pkey                   | NONE         | YES          | root@localhost   | DEFINER       |
+--------------+-----------------------------+--------------+--------------+------------------+---------------+
5 rows in set (0.01 sec)
Views are updatable which means that you can use DML (update, insert and updates) on a view, however there are some restricti ons, views will not be
updatable if the definition contains
aggregations such as count, sum, min,max
- 
group by or group by .... having
- 
select distinct
- 
union all or union
- 
joins that do not have a one-to-one relationship
- 
select statement contains a subquery
- 
if the algorithm is type temptable
- 
view field names must be unique
- 
the view must be defined with all the fields in the base table(s) that have no default values
- 
view with calculated fields
- 
There are two ways to change a view using the create or replace using the alter view both of which have been mentioned above. MySQL treat views the
same way as a table which means they are written to a binary log file and thus can be replicated, the system parameters replicate-do-
table and replicate-ignore-table options are applied to views and tables in both statement and row based replication, I discuss in detail about
replication in replication section.
