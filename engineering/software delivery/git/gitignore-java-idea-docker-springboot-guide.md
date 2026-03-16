# Gitignore Grammar & Common Usage (Java + IntelliJ IDEA + Docker + Spring Boot)

------------------------------------------------------------------------

## 1. .gitignore Grammar Overview

`.gitignore` is pattern-based and line-oriented. Each line represents a
rule.

### 1.1 Basic Rules

  Pattern      Meaning
  ------------ -----------------------
  `*.log`      Ignore all .log files
  `target/`    Ignore directory
  `build/`     Ignore directory
  `file.txt`   Ignore specific file

------------------------------------------------------------------------

### 1.2 Comments

Lines starting with `#` are comments.

    # Ignore logs
    *.log

------------------------------------------------------------------------

### 1.3 Wildcards

  Symbol    Meaning
  --------- -------------------------------------
  `*`       Matches any characters except `/`
  `**`      Matches any directories recursively
  `?`       Matches single character
  `[abc]`   Match one character in set

Examples:

    *.log
    logs/**/*.log
    config-?.yml

------------------------------------------------------------------------

### 1.4 Negation (Exception Rule)

Use `!` to re-include a file.

    *.log
    !important.log

Order matters: later rules override earlier ones.

------------------------------------------------------------------------

### 1.5 Directory vs File

-   `folder/` → ignore folder only
-   `/folder` → ignore only at root
-   `folder` → ignore both file and folder named folder

------------------------------------------------------------------------

### 1.6 Root Anchoring

-   `/target/` → only root target folder
-   `target/` → any target folder

------------------------------------------------------------------------

## 2. Most Common .gitignore for Java + IDEA + Docker + Spring Boot

Below is a production-ready example.

------------------------------------------------------------------------

### 2.1 Java / Maven / Gradle

    # Compiled class files
    *.class

    # Maven
    target/
    pom.xml.tag
    pom.xml.releaseBackup
    pom.xml.versionsBackup
    pom.xml.next

    # Gradle
    .gradle/
    build/

------------------------------------------------------------------------

### 2.2 IntelliJ IDEA

    # IntelliJ
    .idea/
    *.iml
    out/

Never commit:

-   workspace.xml
-   local history
-   IDE cache

------------------------------------------------------------------------

### 2.3 Spring Boot

    # Logs
    *.log
    logs/

    # Spring Boot dev config
    application-local.yml
    application-dev.yml
    application-*.local.yml

    # Temporary files
    *.tmp

Recommended practice:

Commit: - application.yml - application-prod.yml (if safe)

Ignore: - local/dev secrets

------------------------------------------------------------------------

### 2.4 Environment & Secrets

    .env
    .env.*
    *.key
    *.pem
    *.p12
    secrets/

Never commit credentials, certificates, API keys.

------------------------------------------------------------------------

### 2.5 Docker

    # Docker overrides
    docker-compose.override.yml

    # Build artifacts
    target/
    build/

    # Docker env
    .env

Important:

Do NOT ignore: - Dockerfile - docker-compose.yml

------------------------------------------------------------------------

### 2.6 OS Files

    # macOS
    .DS_Store

    # Windows
    Thumbs.db

------------------------------------------------------------------------

## 3. Recommended Full Template

    ############################
    # Java / Maven / Gradle
    ############################
    *.class
    target/
    .gradle/
    build/

    ############################
    # IntelliJ IDEA
    ############################
    .idea/
    *.iml
    out/

    ############################
    # Spring Boot
    ############################
    *.log
    logs/
    application-local.yml
    application-dev.yml
    application-*.local.yml

    ############################
    # Environment & Secrets
    ############################
    .env
    .env.*
    *.key
    *.pem
    *.p12
    secrets/

    ############################
    # Docker
    ############################
    docker-compose.override.yml

    ############################
    # OS Files
    ############################
    .DS_Store
    Thumbs.db

------------------------------------------------------------------------

## 4. Key Design Principles

1.  Never commit build artifacts
2.  Never commit secrets
3.  Never commit IDE-specific cache
4.  Always commit reproducible configuration
5.  Keep environment separation clean

------------------------------------------------------------------------

## 5. Advanced Tips

-   Use global gitignore:

```{=html}
<!-- -->
```
    git config --global core.excludesfile ~/.gitignore_global

-   Debug ignored files:

```{=html}
<!-- -->
```
    git check-ignore -v filename

-   If already tracked:

```{=html}
<!-- -->
```
    git rm -r --cached target/

------------------------------------------------------------------------

# End
