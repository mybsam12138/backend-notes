# Git: Completely Deleting a File (Object) from Local & Remote (Single Branch)

## 🎯 Goal
Remove a file (e.g. `.m4a`, binary) **completely**:
- from all commits
- from local repo
- from remote repo
- only affecting one branch (e.g. `main`)

---

# ✅ 1. Rewrite History (Remove File from All Commits)

```bash
git filter-repo --path path/to/file.m4a --invert-paths
```

### What it does:
- Removes the file from **all commits**
- Rewrites commit history (new commit hashes)

---

# ✅ 2. Force Push (Update Remote Branch Only)

```bash
git push --force origin main
```

### What it does:
- Replaces remote `main` branch with your local rewritten history
- Other branches are NOT affected

---

# ⚠️ 3. Local Cleanup (Permanent Deletion)

```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### What it does:
- Removes references to old commits (reflog)
- Deletes unreachable objects (including your file)
- Frees disk space locally

---

# 🌐 4. Remote Cleanup (Important Reality)

After force push:

✔ File removed from visible history  
✔ Old objects become unreachable  
❌ NOT deleted immediately  

### Remote behavior:
- Garbage Collection (GC) runs automatically  
- Cleanup time:
  - usually hours to days  
  - sometimes longer (depends on platform & repo size)

---

# 🧠 Final Flow

```
filter-repo → remove from history
push --force → update remote branch
reflog expire → remove local references
git gc → physical delete locally
remote GC → eventual deletion on server
```

---

# ⚠️ Important Notes

## 1. Reflog
- Exists ONLY locally
- Not present on remote

## 2. Unreachable Objects
- Exist both locally and remotely (temporarily)
- Deleted by:
  - local: `git gc`
  - remote: automatic GC

## 3. Team Impact
After force push:

```bash
git fetch --all
git reset --hard origin/main
```

---

# 🚀 Binary File Impact (Performance)

## ❓ If NOT deleted (kept in history)

### Effects:

✔ Repo size increases significantly  
✔ Clone becomes slower  
✔ Storage usage increases  
❌ Push speed: usually NOT affected  

---

## 🧠 Why push is NOT affected

Git push behavior:

✔ Only sends missing objects  
✔ Ignores unreachable objects  
✔ Uses content-based deduplication  

---

## 📊 Performance Impact Summary

| Operation | Impact |
|----------|--------|
| push     | ❌ minimal |
| fetch    | ❌ minimal |
| clone    | ⚠️ can be slower |
| storage  | ❌ increases |

---

# 🎯 Best Practice

✔ Never store large binary files in Git  
✔ Use object storage (S3 / MinIO) instead  
✔ Keep Git for code only  

---

# 🧾 Final Summary

To fully delete a file:

1. git filter-repo  
2. git push --force origin <branch>  
3. git reflog expire  
4. git gc  

Result:
✔ Removed from all commits  
✔ Removed locally  
✔ Removed from remote history  
✔ Remote cleans up later  

Binary files:
✔ affect storage & clone speed  
❌ do NOT significantly affect push speed  
