
# Git: Methods to Combine Multiple Commits into One

This document summarizes **three common methods** to merge several commits into one commit in Git.

Methods covered:

1. `git rebase -i` (interactive rebase with squash)
2. `git reset --soft`
3. Squash merge (`git merge --squash`)

It also explains **why `git rebase -i` is the most commonly used method**.

---

# 1. Method 1 — `git rebase -i` (Interactive Rebase + Squash)

This is the **most common and flexible method** used by developers.

It allows you to:

- choose specific commits
- reorder commits
- squash commits
- edit commit messages

## Example history

```
A --- B --- C --- D --- E
```

We want to combine **C, D, E** into one commit.

## Command

```
git rebase -i HEAD~3
```

Git opens an editor:

```
pick C add login controller
pick D add login service
pick E fix validation
```

Modify it:

```
pick C add login controller
squash D add login service
squash E fix validation
```

Save and exit.

Git will ask for the final commit message.

Example:

```
Add login feature
```

## Result

```
A --- B --- F
```

Where:

```
F = C + D + E
```

## Example `git log` output

Before:

```
commit e3 (HEAD)
fix validation

commit d2
add login service

commit c1
add login controller
```

After:

```
commit f1 (HEAD)
Add login feature
```

---

# 2. Method 2 — `git reset --soft`

This is a **quick method to combine the last N commits**.

However, it is less flexible because it only works with **recent commits**.

## Example history

```
A --- B --- C --- D --- E
```

We want to combine **C, D, E**.

## Command

```
git reset --soft HEAD~3
git commit
```

Explanation:

```
HEAD~3  → move branch pointer back 3 commits
--soft  → keep changes staged
commit  → create new combined commit
```

## Result

```
A --- B --- F
```

## Example `git log` output

Before:

```
commit e3
fix validation

commit d2
add login service

commit c1
add login controller
```

After:

```
commit f1
Add login feature
```

## Limitations

- cannot choose arbitrary commits
- only works with **latest commits**
- cannot reorder commits

---

# 3. Method 3 — Squash Merge

This method combines **all commits from a branch into one commit when merging**.

It is commonly used in **GitHub / GitLab PR workflows**.

## Example branch

```
main
 │
 └── feature/login
        c1
        c2
        c3
```

## Command

```
git merge --squash feature/login
git commit
```

## Result

```
main
 │
 └── Add login feature
```

Feature commits:

```
c1
c2
c3
```

are combined into **one commit**.

## Example `git log` output

Before:

```
c1 add controller
c2 add service
c3 fix validation
```

After merge:

```
commit f1
Add login feature
```

---

# Comparison of the Three Methods

| Method | Flexibility | Typical Usage |
|------|------|------|
| `git rebase -i` | Very high | Clean commit history |
| `git reset --soft` | Low | Quick local cleanup |
| `merge --squash` | Medium | PR merge workflow |

---

# Why `git rebase -i` Is the Most Common

`git rebase -i` is widely used because it provides **full control over commit history**.

Advantages:

1. **Selective squashing**  
   You can squash specific commits.

2. **Reordering commits**  
   Useful when commits were created in the wrong order.

3. **Editing commit messages**

4. **Dropping commits**

5. **Editing commit content**

Example interactive commands:

```
pick   keep commit
reword change commit message
edit   modify commit
squash combine commits
fixup  combine commits and discard message
drop   remove commit
```

This flexibility makes `git rebase -i` the **standard tool for cleaning commit history before pushing or creating a PR**.

---

# Summary

Three ways to combine commits:

```
1. git rebase -i HEAD~N
2. git reset --soft HEAD~N
3. git merge --squash branch
```

Most developers prefer:

```
git rebase -i
```

because it allows **precise control of commit history**.

