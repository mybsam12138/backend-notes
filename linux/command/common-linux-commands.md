# Common Linux Commands with Example Output

## 1. pwd (Print Working Directory)

Shows the current directory.

``` bash
$ pwd
/home/sam/projects
```

------------------------------------------------------------------------

## 2. ls (List Files)

Lists files and directories.

``` bash
$ ls -l
drwxr-xr-x 2 sam sam 4096 Feb 10 10:00 docs
-rw-r--r-- 1 sam sam  512 Feb 10 09:50 README.md
```

------------------------------------------------------------------------

## 3. cd (Change Directory)

Changes the current directory.

``` bash
$ cd docs
$ pwd
/home/sam/projects/docs
```

------------------------------------------------------------------------

## 4. mkdir (Make Directory)

Creates a new directory.

``` bash
$ mkdir test-folder
```

------------------------------------------------------------------------

## 5. rm (Remove)

Deletes files or directories.

``` bash
$ rm file.txt
$ rm -r test-folder
```

------------------------------------------------------------------------

## 6. cp (Copy)

Copies files or directories.

``` bash
$ cp source.txt backup.txt
$ cp -r dir1 dir2
```

------------------------------------------------------------------------

## 7. mv (Move / Rename)

Moves or renames files.

``` bash
$ mv old.txt new.txt
```

------------------------------------------------------------------------

## 8. cat (Concatenate / View File)

Displays file content.

``` bash
$ cat README.md
This is a sample README file.
```

------------------------------------------------------------------------

## 9. grep (Search Text)

Searches for text in files.

``` bash
$ grep "error" app.log
[ERROR] Connection failed
```

------------------------------------------------------------------------

## 10. ps (Process Status)

Shows running processes.

``` bash
$ ps aux | head -3
USER   PID %CPU %MEM COMMAND
root     1  0.0  0.1 /sbin/init
sam   2345  1.2  2.3 java -jar app.jar
```

------------------------------------------------------------------------

## 11. top (Real-time Process Monitor)

``` bash
$ top
top - 10:32:01 up 2 days,  3:44,  1 user,  load average: 0.15, 0.20, 0.25
Tasks: 180 total,   1 running, 179 sleeping
%Cpu(s):  3.0 us,  1.0 sy, 96.0 id
MiB Mem :  7986 total,  4200 free,  1500 used,  2286 buff/cache
```

------------------------------------------------------------------------

## 12. df (Disk Free)

Shows disk usage.

``` bash
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   20G   28G  42% /
```

------------------------------------------------------------------------

## 13. du (Disk Usage)

Shows directory size.

``` bash
$ du -sh logs
120M    logs
```

------------------------------------------------------------------------

## 14. free (Memory Usage)

``` bash
$ free -m
              total   used   free  shared  buff/cache  available
Mem:           7986   1500   4200     100        2286       6000
```

------------------------------------------------------------------------

## 15. netstat / ss (Network Status)

``` bash
$ ss -lnt
State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
LISTEN  0       128     0.0.0.0:8080        0.0.0.0:*
```

------------------------------------------------------------------------

## 16. chmod (Change Permission)

``` bash
$ chmod 755 script.sh
```

------------------------------------------------------------------------

## 17. chown (Change Owner)

``` bash
$ chown sam:sam file.txt
```

------------------------------------------------------------------------

## 18. tar (Archive Files)

``` bash
$ tar -czvf archive.tar.gz folder/
```

------------------------------------------------------------------------

## 19. curl (HTTP Request)

``` bash
$ curl http://localhost:8080/health
{"status":"UP"}
```

------------------------------------------------------------------------

## 20. history (Command History)

``` bash
$ history | tail -3
  101  ls -l
  102  cd docs
  103  cat README.md
```

------------------------------------------------------------------------

# Notes

-   Use `man <command>` to view the manual page.
-   Use `--help` for quick usage information.
-   Combine commands with pipes `|` for powerful workflows.
