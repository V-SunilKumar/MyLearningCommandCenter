# Partitioning types and examples

> Source: `MySql_Notes.pdf`, pages 64, 65. These are source-derived notes; verify version-specific commands before using them in a current environment.


Partitioning. It is depending on the engine. Partitioning is dividing up data in the database into distinct independent elements, partitioning
serves three main purposes
Data manageability
- 
Performance
- 
Availability
- 
Two different types of partitioning in MYSQL.
User Defined Partitioning
- 
Divide data evenly
- 
Limitations on Partitioning.
Foreign Key will not support for partitioning.
- 
Global Index will not support in partitioing.
- 
There are are two ways to partition database tables
Horizontal partitioning
different rows are stored in different tables, for example customers with ID's less than 100,000 are stored in customers1 table and customers with ID's greater are stored
in customers2 table, etc. In horizontal partitioning the table schemas are exactly the same (i.e.customer1 and customer2 tables have the same schema), as if the table was cut into parts
using a horizontal line.
Archiving older data is commonly used example of horizontal partitioning, another technique using horizontal partitioning is sharding which involves using separate servers to host similar
types of data, for example customer1 table would be held on server1 and customer2 table would be held on server2.
Horizontal partitioning is achieved manually using merge tables, as merge tables do not automatically assign data to different underlying tables. Internal partitioning assigns records to a
partition based on certain criteria.
Vertical partitioning
different fields are stored in different tables, for example customer names and email addresses might be stored in Customers and Addresses tables. Often normalization involves vertical
partitioning, which means splitting up otherwise normalized data. In vertical partitioning the tables are split up vertically which means that the schemas will be different but they contain
similar records. This type of partitioning is also know as row splitting because each row is being split up.
Different physical storage could be used as well, you could even store pictures and large documents on the file system instead of in the database.
another option is to split up data in dynamic and static data tables, a static data table could then use query cache to improve performance.
Partitioning Types
MySQL offers the following types of partitionings.
range partitioning
used for data that can be separated into ranges based on some criterion i.e. date, part number, ID's.
list partitioning
used for data that can be separated into lists based on some criterion i.e. city, territory.
hash partitioning
if data in a range partition is not evenly distributed (lots of data for one particular date) then performance decreases, hash partitioning uses hashing algorithms to assign a hash value to
each rows partitioning key and place it in the appropriate partition. Hopefully the data will be evenly distributed across the partitions.
key partitioning
An internal algorithm is used by mysqld to try and evenly distribute the data across the partitions, a field called the key column is used for the determination of data
Range and list partition can be subpartitioned using hash or key partitioning, this is known as composite partitioning. Each of the partitioning
algorithms utilizes a partition key in which partition the data is stored. This partition key is defined when creating the partition and must be an
integer. If the table has a primary key it must include all the fields in the partition key, if the table has no primary key but has a unique key
it must include all the fields in the partition key, however a table can use partitioning if it has no primary or unique key specified.
Lets see a few examples
range partitioning
## Creating a new partition table here we are partitioning on the store_id, creating 3 partitions notice the maxvalue as a
catch-all if an store_id is
greater than we specified
create table employees (
  emp_id int not null,
  f_name varchar(30) not null,
  l_name varchar(30) not null,
  store_id int not null
)
  partition by range (store_id) (
  partition p0 values less than (101),
  partition p1 values less than (201),
  partition p2 values less than (301),
  partition pfinal values less than maxvalue
);
## Alter a table to add partitioning
## lets say the table was already created , then we use the alter table command to add partitioning
alter table employees
  partition by range (store_id) (
  partition p0 values less than (101),
  partition p1 values less than (201),
  partition p2 values less than (301),
  partition pfinal values less than maxvalue
);
list partitioning
create table employee_by_region (
  emp_id int not null,
  f_name varchar(30) not null,
  l_name varchar(30) not null,
  store_id int not null
)
  partition by list (store_id) (
  partition north values in (1,2,3,4,5),
  partition east values in (6,7,8,9,10),
  partition south values in (11, 12, 13, 14, 15),
  partition east values in (16, 17, 18, 19, 20)
);
hash partitioning
## here we are creating 5 hash partitions
create table employee_by_region (
  emp_id int not null,
Partitioning
Monday, July 26, 2021
6:38 PM

---


f_name varchar(30) not null,
  l_name varchar(30) not null,
  store_id int not null
)
partition by hash (store_id)
partitions 5;
key partitioning
## here we are creating 5 key partitions
create table employee_by_region (
  emp_id int not null,
  f_name varchar(30) not null,
  l_name varchar(30) not null,
  store_id int not null
)
partition by key (store_id)
partitions 5;
composite partitioning
create table invoices (
  customer_id int not null,
  product_id int not null,
  amount decimal(8,2) not null,
  entry_date date not null default '2012-01-01',
  store_id int not null
)
partition by range (year(entry_date))
subpartition by hash (customer_id) (
partition p0 values less than (2010) (
  subpartition s0,
  subpartition s1,
  subpartition s2),
partition p1 values less than (2011) (
  subpartition s3,
  subpartition s4,
  subpartition s5))
);
There are a number of partition management commands
add partition
alter table employees_by_region add partition (
  partition england values in (1,2),
  partition scotland values in (3,4)
);
drop partition
alter table employees_by_region drop partition scotland;
coalesce partition
alter table employees_hash coalesce partition 4;
reorganize partition
alter table employees repair partition p0, p1;
analyze partition
alter table employees analyze partition 3;
check partition
alter table employees check partition 3;
optimize partition
alter table employees optimize partition p0, p1;
rebuild partition
alter table employees rebuild partition p0, p3;
Merge Tables
A merge table is a table structure with no data, which specifies a set of identical structured MyISAM tables. All tables must have exactly the same
indexes and fields in the same order, it also specifies where new data should be inserted but it does not have automatic data partitioning
Here is an example
merge table
## create three identical tables
create table employees_1 (
  emp_id int not null,
  f_name varchar(30) not null,
  l_name varchar(30) not null,
  store_id int not null
) engine=MyISAM;
create table employees_2 (
  emp_id int not null,
  f_name varchar(30) not null,
  l_name varchar(30) not null,
  store_id int not null
) engine=MyISAM;
create table employees_3 (
  emp_id int not null,
  f_name varchar(30) not null,
  l_name varchar(30) not null,
  store_id int not null
) engine=MyISAM;
## Now create the merge table
create table all_employees (
  emp_id int not null,
  f_name varchar(30) not null,
  l_name varchar(30) not null,
  store_id int not null
) engine=MyISAM union=(employees_1,employees_2,employees_3) insert_method last;
When you need to change a merge table you have two options, the first is to drop the merge table and recreate it with a new list of underlying
tables, the second is to use the alter table union=(table_one,table-two...) to change which tables are the underlying tables.
Merge tables offer the following advantages.
Increases in speed performance for very large data sets
- 
Easier maintenance of the underlying tables
-
