
# Git Internal Objects: Commit, Tree, Blob

This document summarizes the three core Git object types and explains how Git uses them to efficiently store repository data.

---

# 1. Overview of Git Object Model

Git stores repository data as **objects** in the `.git/objects` directory.

The three main object types are:

| Object | Purpose |
|------|------|
| blob | stores file content |
| tree | stores directory structure |
| commit | stores snapshot metadata |

Relationship:

commit → tree → blob  
              ↓  
            tree (subdirectory)

A commit points to a tree, and trees point to blobs (files) or other trees (folders).

---

# 2. Blob Object

A **blob** stores the **complete content of a file**.

Important characteristics:

- Stores raw file content only
- Does NOT store file name
- Does NOT store change history
- Content is immutable

Example file:

hello.txt  
Hello World

Blob content:

Hello World

Git calculates a **SHA hash** from the content.

If two files contain identical content, they share the **same blob object**.

---

# 3. Tree Object

A **tree** represents a **directory structure**.

A tree contains entries that reference:

- blobs (files)
- other trees (subdirectories)

Example repository structure:

project  
├── README.md  
└── src  
    └── app.js  

Tree structure:

tree(root)  
├ README.md → blob1  
└ src → tree2  
      └ app.js → blob2  

Each tree entry stores:

| Field | Description |
|------|------|
| file mode | permissions |
| object type | blob or tree |
| object hash | SHA hash |
| file name | file name |

Example tree entry:

100644 blob a1b2c3 README.md  
040000 tree d4e5f6 src

---

# 4. Commit Object

A **commit** represents a **snapshot of the repository**.

It stores metadata and a pointer to a tree.

Example commit object:

tree a1b2c3  
parent d4e5f6  
author Sam <sam@example.com>  
committer Sam <sam@example.com>  

Update README

Fields in a commit:

| Field | Purpose |
|------|------|
| tree | snapshot of project |
| parent | previous commit |
| author | who wrote the change |
| committer | who committed |
| message | commit message |

---

# 5. Example Commit Graph

Suppose a file changes between commits.

Commit A:

hello.txt  
Hello

Commit B:

hello.txt  
Hello World

Git stores:

blob1 = "Hello"  
blob2 = "Hello World"  

treeA → blob1  
treeB → blob2  

commitA → treeA  
commitB → treeB  

Git does NOT store line-by-line changes.  
Diffs are calculated dynamically when needed.

---

# 6. How Git Saves Storage Space

Git's design saves space through several mechanisms.

## 6.1 Content Addressing

Git objects are identified by SHA hash.

If two files have identical content:

file1.txt  
file2.txt  

Git stores **only one blob object**.

Both files reference the same blob.

---

## 6.2 Snapshot Reuse

If a file does not change between commits:

commitA → blob1  
commitB → blob1  

No new blob is created.

Git simply reuses the existing object.

---

## 6.3 Tree Reuse

If a directory structure does not change, Git reuses the same tree object.

If only one file changes, Git only creates new objects for the changed part.

---

## 6.4 Object Compression

Git compresses objects using **zlib compression**.

Objects inside `.git/objects` are compressed automatically.

---

## 6.5 Packfiles

Git can pack many objects into a **packfile**.

Packfiles allow Git to:

- compress objects
- store deltas between objects
- reduce disk usage

This is why large repositories remain relatively small.

---

# 7. Summary

Git stores repository data using three object types:

| Object | Stores |
|------|------|
| blob | file content |
| tree | directory structure |
| commit | snapshot metadata |

Relationships:

commit → tree → blob

Key properties:

- commits reference trees
- trees reference blobs
- objects are stored once
- identical content shares the same object
- Git computes diffs dynamically

This architecture allows Git to store full project history efficiently while avoiding unnecessary duplication.
