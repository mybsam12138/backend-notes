# Understanding Maven settings.xml  
*Focus on mirrors, repositories, and real-world usage*

In Maven, `settings.xml` controls **how and where Maven downloads artifacts**, and **how it authenticates** to repositories.  
It does **not** define project dependencies — that is the job of `pom.xml`.

This document focuses on the most confusing and important parts:
- `mirror`
- `repository`
- their relationship with `pom.xml`

---

## What Is settings.xml?

> **`settings.xml` is a user / environment–level configuration file for Maven.**

Typical locations:

- **User-level (recommended)**  
  ```
  ~/.m2/settings.xml
  ```

- **Global (rarely modified)**  
  ```
  $MAVEN_HOME/conf/settings.xml
  ```

### Key rule

> `settings.xml` affects **HOW Maven downloads artifacts**,  
> `pom.xml` affects **WHAT artifacts the project needs**.

---

## What Problem settings.xml Solves

Without `settings.xml`, Maven:
- Uses Maven Central by default
- Uses anonymous access
- Has no mirrors
- Has no private credentials

With `settings.xml`, you can:
- Speed up downloads (mirrors)
- Use private repositories
- Add authentication
- Control corporate / China network access

---

## Repositories (repository)

### What is a repository?

> A **repository** is a place where Maven artifacts are stored.

Examples:
- Maven Central
- Nexus
- Artifactory
- GitHub Packages

### Repository definition (example)

```xml
<repositories>
    <repository>
        <id>central</id>
        <url>https://repo.maven.apache.org/maven2</url>
        <releases>
            <enabled>true</enabled>
        </releases>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
    </repository>
</repositories>
```

### Where repositories can be defined

| Location | Purpose |
|--------|--------|
| pom.xml | Project-specific repositories |
| settings.xml | Environment-wide repositories |

### Important note

> Maven Central is already built-in.  
> You usually **do NOT need to declare it explicitly**.

---

## Mirrors (mirror)

### What is a mirror?

> A **mirror** is a redirector — it tells Maven:  
> “Whenever you try to access repository X, go to Y instead.”

Mirrors **do not add new repositories** — they **override existing ones**.

---

### Mirror example (very common)

```xml
<mirrors>
    <mirror>
        <id>aliyun-mirror</id>
        <mirrorOf>central</mirrorOf>
        <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
</mirrors>
```

Meaning:
- Maven tries to access `central`
- Maven is redirected to Aliyun mirror
- `pom.xml` does not change

---

## mirrorOf Explained (IMPORTANT)

| mirrorOf value | Meaning |
|--------------|--------|
| central | Only Maven Central |
| * | All repositories |
| external:* | All non-local repositories |
| repo1,repo2 | Only specified repositories |
| !central | Everything except central |

### Example: mirror EVERYTHING (dangerous but common)

```xml
<mirrorOf>*</mirrorOf>
```

⚠️ This overrides **ALL repositories**, including:
- central
- custom repos
- plugin repos

Use carefully.

---

## Mirror vs Repository (THIS IS THE KEY)

### Repository

- Declares **where artifacts exist**
- Can be defined in `pom.xml`
- Does NOT redirect

### Mirror

- Redirects requests
- Defined ONLY in `settings.xml`
- Overrides repository URLs silently

### Mental model

```
pom.xml  →  repository (logical)
             ↓
settings.xml → mirror (physical)
```

---

## Priority Rules (VERY IMPORTANT)

Maven resolves repositories in this order:

1️⃣ `settings.xml` mirror  
2️⃣ Repository defined in `settings.xml`  
3️⃣ Repository defined in `pom.xml`  
4️⃣ Maven Central (default)

### Key takeaway

> **Mirror always wins.**  
> `pom.xml` cannot override a mirror.

---

## Common Confusion Explained

### “I defined a repository in pom.xml, why is Maven still using another URL?”

Because:
- A mirror in `settings.xml` is redirecting it

This is expected behavior.

---

### “Can pom.xml override settings.xml?”

❌ No.

> `settings.xml` is higher priority than `pom.xml`.

This is by design (environment control).

---

## Plugins Repositories

Plugins use a **separate repository type**:

```xml
<pluginRepositories>
    <pluginRepository>
        <id>central</id>
        <url>https://repo.maven.apache.org/maven2</url>
    </pluginRepository>
</pluginRepositories>
```

Mirrors also affect plugin repositories.

---

## Authentication (servers)

Credentials are **never placed in pom.xml**.

```xml
<servers>
    <server>
        <id>github</id>
        <username>USERNAME</username>
        <password>TOKEN</password>
    </server>
</servers>
```

`id` must match:
- repository id
- or distributionManagement id

---

## Real-World Recommended Setup

### Typical personal / small team setup

```xml
<mirrors>
    <mirror>
        <id>mirror</id>
        <mirrorOf>central</mirrorOf>
        <url>https://repo.maven.apache.org/maven2</url>
    </mirror>
</mirrors>
```

### China network setup

```xml
<mirror>
    <id>aliyun</id>
    <mirrorOf>central</mirrorOf>
    <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

### Enterprise setup

- Mirror → company Nexus
- Repository → internal artifacts
- Credentials → settings.xml

---

## What settings.xml Should NOT Do

❌ Define project dependencies  
❌ Contain business logic  
❌ Be committed to Git  
❌ Be shared with passwords

---

## Final Key Takeaways

- `settings.xml` controls **environment**
- `pom.xml` controls **project**
- `mirror` overrides `repository`
- `mirror` ALWAYS wins
- `settings.xml` is NOT portable — each machine can differ

---

> **Once you understand mirrors, Maven stops feeling “magical” and becomes predictable.**
