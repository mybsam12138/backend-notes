# Understanding the Maven Lifecycle
*A practical guide: validate → compile → test → package → verify → install → deploy*

When working with Java projects (especially Spring Boot applications), Maven is more than a dependency manager — it is a **build lifecycle engine**.

Understanding the Maven lifecycle helps you:
- Know **what really happens** when you run a Maven command
- Avoid packaging and deployment mistakes
- Clearly separate **development**, **verification**, and **distribution**

This article explains the **default Maven lifecycle** in a practical, engineering-oriented way.

---

## What Is a Maven Lifecycle?

> **A Maven lifecycle is a fixed sequence of build phases that Maven executes in order.**

The default lifecycle looks like this:

```
validate
↓
compile
↓
test
↓
package
↓
verify
↓
install
↓
deploy
```

### Golden Rule

> **Running a later phase automatically runs all earlier phases.**

For example:
- `mvn package` runs `validate → compile → test → package`
- `mvn install` runs everything up to `install`

---

## Phase-by-Phase Explanation

### 1. validate

**Purpose**
- Check whether the project is **correct and ready to build**

**What it does**
- Verifies `pom.xml` structure
- Ensures required fields exist (`groupId`, `artifactId`, `version`)
- Resolves parent POM and dependencies

**What it does NOT do**
- No compilation
- No tests
- No artifacts

**Typical usage**
```bash
mvn validate
```

---

### 2. compile

**Purpose**
- Compile main source code

**What it does**
- Compiles `src/main/java`
- Outputs `.class` files to `target/classes`

**What it does NOT do**
- No tests
- No JAR packaging

```bash
mvn compile
```

---

### 3. test

**Purpose**
- Run unit tests

**What it does**
- Runs tests under `src/test/java`
- Uses `maven-surefire-plugin` by default

**Behavior**
- Fails build if any unit test fails

```bash
mvn test
```

---

### 4. package

**Purpose**
- Create a distributable artifact

**What it does**
- Packages compiled code into:
  - `jar` (default)
  - `war` (web apps)
- For Spring Boot:
  - Creates an **executable fat JAR**
  - Includes all dependencies

**This is the most commonly used phase**

```bash
mvn package
mvn clean package -DskipTests
```

Output:
```
target/your-app-version.jar
```

---

### 5. verify

**Purpose**
- Verify that the packaged artifact is valid and meets quality requirements

**Important concept**
> Maven itself does very little here — **plugins do the real work**.

**Common tasks bound to verify**
- Integration tests (Failsafe plugin)
- Code coverage checks (JaCoCo)
- Static analysis (Checkstyle, PMD, SpotBugs)

**Why it exists**
- Prevents bad artifacts from being installed or deployed

```bash
mvn verify
```

---

### 6. install

**Purpose**
- Make the artifact available locally

**What it does**
- Copies the artifact into the local Maven repository:
```
~/.m2/repository
```

**When to use**
- Multi-module projects
- Local library development

```bash
mvn install
```

---

### 7. deploy

**Purpose**
- Publish the artifact to a remote repository

**What it does**
- Uploads artifacts to:
  - Nexus
  - Artifactory
  - GitHub Packages

**Typical usage**
- CI/CD pipelines
- Release workflows

```bash
mvn deploy
```

---

## Summary Table

| Phase    | Purpose                         | Produces Artifact |
|---------|---------------------------------|------------------|
| validate | Check project structure         | No               |
| compile | Compile source code             | No               |
| test    | Run unit tests                  | No               |
| package | Build JAR / WAR                 | Yes              |
| verify  | Validate artifact quality       | No               |
| install | Install to local repository     | Yes              |
| deploy  | Publish to remote repository    | Yes              |

---

## Key Takeaway

> **Maven lifecycles enforce discipline.**  
> Each phase has a single responsibility, and together they form a reliable build pipeline.

Understanding this lifecycle makes debugging, Docker packaging, and CI/CD far easier and more predictable.
