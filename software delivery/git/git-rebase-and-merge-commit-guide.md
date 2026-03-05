
# Git Rebase and Merge Commit Guide

## 1. What is `git rebase`

`git rebase` moves or **replays commits from one branch onto another base commit**.

Instead of merging two histories, it **rewrites your commits so they appear after the latest commit of the target branch**.

Example before rebase:

```
main
A --- B --- C --- D --- E

feature
      \
       f1 --- f2
```

Run:

```
git fetch origin
git rebase origin/main
```

Result:

```
A --- B --- C --- D --- E --- f1' --- f2'
```

Your commits are replayed (`f1'`, `f2'`).

---

# 2. When You Should Use `git rebase`

## 1️⃣ Updating a Feature Branch

If your feature branch is behind `main`.

```
git fetch origin
git rebase origin/main
```

Reason:
- keeps history **linear**
- avoids unnecessary merge commits

---

## 2️⃣ Cleaning Commit History

Before creating a Pull Request.

```
git rebase -i HEAD~N
```

Example:

```
pick f1 add login controller
squash f2 fix validation
```

Result:

```
Add login feature
```

---

## 3️⃣ Maintaining Linear History

Many teams require a clean history:

```
A --- B --- C --- D --- E --- feature commits
```

instead of multiple merges.

---

# 3. When You Should NOT Use Rebase

Do **NOT rebase shared branches**.

Example:

```
main
release
team-shared branches
```

Reason:
- rebase **rewrites commit history**
- collaborators may already depend on the old commits

Rule used by many teams:

> Rebase private branches, merge shared branches.

---

# 4. What is a Merge Commit

A **merge commit** is a commit created when Git merges two different histories.

It has **two (or more) parent commits**.

Example:

```
main
A --- B --- C --- D --- E
      \
       f1 --- f2
                \
                 M
```

Parent relationships:

```
M parent1 = E
M parent2 = f2
```

Merge commit `M` connects the two histories.

---

# 5. When Merge Commits Appear

Merge commits appear when using:

```
git merge branch-name
```

or

```
git pull
```

because `git pull` usually performs:

```
git fetch
git merge
```

Example:

```
git pull origin main
```

Result:

```
A --- B --- C --- D --- E
      \               \
       f1 --- f2 ------ M
```

---

# 6. Why Teams Often Avoid Merge Commits

Merge commits can make history messy.

Example history:

```
Merge branch main
Merge branch main
Merge branch main
```

Problems:

### 1️⃣ Harder to read history

```
git log
```

becomes cluttered.

---

### 2️⃣ Harder to trace features

Instead of:

```
Add login feature
Add payment service
Fix order bug
```

history may contain many merge commits.

---

### 3️⃣ Harder debugging

Commands like:

```
git bisect
git blame
```

work better with linear history.

---

# 7. Preferred Modern Workflow

Many teams use:

```
git fetch origin
git rebase origin/main
```

or configure:

```
git config --global pull.rebase true
```

This makes:

```
git pull
```

behave like:

```
fetch + rebase
```

---

# 8. Summary

## When to Use Rebase

- updating a feature branch
- cleaning commit history
- preparing a PR
- keeping linear history

---

## When Merge Commits Appear

- `git merge`
- `git pull` (default behavior)

---

## Why Avoid Merge Commits

- messy history
- harder debugging
- harder code review

---

## Key Rule

```
Rebase private branches
Merge shared branches
```
