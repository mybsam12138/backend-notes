# Linux Permission Model Summary

## 1. Overview

Linux uses a permission model to control access to files and
directories.\
Each file has:

-   An owner (user)
-   A group
-   Permissions for:
    -   Owner
    -   Group
    -   Others

This model ensures secure multi-user access control.

------------------------------------------------------------------------

## 2. File Structure Example

Example output from `ls -l`:

    -rw-r--r-- 1 sam dev 1024 Jun 10 10:00 test.txt

Breakdown:

-   `-` → File type
-   `rw-r--r--` → Permissions
-   `sam` → Owner
-   `dev` → Group

------------------------------------------------------------------------

## 3. File Types

First character indicates type:

  Symbol   Meaning
  -------- ------------------
  `-`      Regular file
  `d`      Directory
  `l`      Symbolic link
  `c`      Character device
  `b`      Block device

------------------------------------------------------------------------

## 4. Permission Structure

Permissions are divided into three groups:

    Owner   Group   Other
    rw-     r--     r--

Each group has three permissions:

  Symbol   Meaning
  -------- ---------
  r        Read
  w        Write
  x        Execute

------------------------------------------------------------------------

## 5. Permission Meaning

### For Regular Files

  Permission   Meaning
  ------------ --------------------
  r            Read file contents
  w            Modify file
  x            Execute file

### For Directories

  Permission   Meaning
  ------------ -------------------------
  r            List directory contents
  w            Create/delete files
  x            Enter directory (`cd`)

------------------------------------------------------------------------

## 6. Permission Evaluation Logic

Linux checks permissions in this order:

1.  If user is the owner → use Owner permissions
2.  Else if user belongs to the file's group → use Group permissions
3.  Else → use Other permissions

Important:

-   Linux does NOT combine permissions.
-   Only one category is used.

Root user bypasses permission checks.

------------------------------------------------------------------------

## 7. Numeric (Octal) Representation

Each permission has a numeric value:

  Permission   Value
  ------------ -------
  r            4
  w            2
  x            1

Examples:

-   `rwx` = 7
-   `rw-` = 6
-   `r--` = 4

Example:

    chmod 755 file

Becomes:

    rwxr-xr-x

------------------------------------------------------------------------

## 8. Changing Ownership and Permissions

Change permission:

    chmod 644 file

Change owner:

    chown user file

Change group:

    chgrp group file

------------------------------------------------------------------------

## 9. Directory Traversal Requirement

To access a file:

-   User must have execute (`x`) permission on all parent directories.

Even if file has read permission, lack of directory execute permission
blocks access.

------------------------------------------------------------------------

## 10. Special Permission Bits (Advanced)

Special bits include:

-   setuid (s)
-   setgid (s)
-   sticky bit (t)

Example:

    drwxrwxrwt

Sticky bit prevents users from deleting files owned by others in shared
directories like `/tmp`.

------------------------------------------------------------------------

## 11. Key Takeaways

-   Linux permissions are based on Owner, Group, and Other.
-   Only one category applies during access evaluation.
-   Permissions differ for files and directories.
-   Numeric chmod representation simplifies permission setting.
-   Directory execute permission is required for traversal.
-   Root bypasses permission restrictions.

The Linux permission model is simple, consistent, and fundamental to
system security.
