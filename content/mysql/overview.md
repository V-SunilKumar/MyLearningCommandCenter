# MySQL & MariaDB Technical Handbook

This handbook is built from the supplied **MySql_Notes.pdf** (79 pages). It preserves the original notes, command examples, outputs and embedded images where extractable.

Use the left navigation to expand a subject and open its Markdown page. Each page is an individual `.md` file and can be edited in GitHub or github.dev.

## Content structure

The navigation follows the subjects in the original notebook and adds useful groupings for browsing. It does not claim that every command is current for every MySQL or MariaDB release. The notes include historical environments such as MySQL 5.7, MySQL 8.0 and Linux 7; check version compatibility before running commands.

## Public publishing and sanitization

The original PDF contained example credentials, password strings, hostnames and private lab IP addresses. These have been redacted or replaced in the generated Markdown. **Do not publish the original PDF** in this public repository. Review every converted page before making the repository public.


## Original notebook index

The supplied notebook's index lists these original subjects:

1. Installation of MySQL software — RPM and source-code installation
2. Database creation
3. MySQL parameters — online changes and persistence
4. Architecture — SQL statement parsing and storage engines
5. Binary log
6. User creation and management
7. Roles, privileges and grants
8. Partitioning
9. Backup and recovery — logical backups, physical backups and point-in-time recovery
10. Command-line monitoring
11. Replication — traditional master/slave, MySQL Shell, Group Replication, InnoDB Cluster monitoring and GTID transitions
12. Performance tuning
13. Migration considerations — replication consistency and query behaviour checks

The navigation divides some of these subjects into smaller domains to make the handbook easier to browse. Where the PDF index names a subject but does not provide a distinct detailed section, that gap is called out rather than filled with invented notes.
