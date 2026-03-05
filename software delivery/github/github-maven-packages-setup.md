
# GitHub Maven Packages – Complete Setup Flow

This document summarizes the **end-to-end process** of using **GitHub Packages as a Maven repository**, including publishing and consuming artifacts.

---

## 1. Use Cases

GitHub Maven Packages is suitable for:

- Internal frameworks or common libraries
- Spring Boot starters
- Company-level shared modules
- Replacing Nexus/Artifactory for small–medium teams

---

## 2. Prerequisites

### 2.1 GitHub Repository

- A GitHub repository (public or private)
- Maven coordinates usually follow:
  ```
  groupId    = com.github.<github-username-or-org>
  artifactId = <repository-name>
  ```

### 2.2 GitHub Personal Access Token (PAT)

Create a token at:

```
GitHub → Settings → Developer settings → Personal access tokens
```

Required scopes:

| Action   | Required Scope |
|--------|----------------|
| Publish | write:packages |
| Consume| read:packages  |
| Repo   | repo (private repos only) |

---

## 3. Configure Maven settings.xml

Edit `~/.m2/settings.xml`:

```xml
<settings>
  <servers>
    <server>
      <id>github</id>
      <username>YOUR_GITHUB_USERNAME</username>
      <password>YOUR_GITHUB_TOKEN</password>
    </server>
  </servers>
</settings>
```

⚠️ Never commit this file to Git.

---

## 4. Publishing a Maven Package

### 4.1 pom.xml Configuration

```xml
<distributionManagement>
  <repository>
    <id>github</id>
    <name>GitHub Packages</name>
    <url>https://maven.pkg.github.com/OWNER/REPOSITORY</url>
  </repository>
</distributionManagement>
```

Example:

```
https://maven.pkg.github.com/sam/example-framework
```

### 4.2 Maven Publish Command

```bash
mvn clean deploy
```

After success, the package will appear under:

```
GitHub → Repository → Packages
```

---

## 5. Consuming a GitHub Maven Package

### 5.1 Add Repository

```xml
<repositories>
  <repository>
    <id>github</id>
    <url>https://maven.pkg.github.com/OWNER/REPOSITORY</url>
  </repository>
</repositories>
```

### 5.2 Add Dependency

```xml
<dependency>
  <groupId>com.github.OWNER</groupId>
  <artifactId>REPOSITORY</artifactId>
  <version>1.0.0</version>
</dependency>
```

---

## 6. CI/CD (GitHub Actions Example)

```yaml
permissions:
  contents: read
  packages: write
```

```yaml
- name: Publish package
  run: mvn deploy
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 7. Common Pitfalls

| Issue | Cause |
|-----|------|
| 401 Unauthorized | Token scope missing |
| Dependency not found | Repo URL mismatch |
| settings.xml ignored | Wrong server id |
| Private repo access denied | Missing repo scope |

---

## 8. Best Practices

- Use **semantic versioning**
- Separate **framework repos** from business repos
- Use **GitHub Actions** for publishing
- Keep credentials out of source code

---

## 9. Comparison with Nexus

| Feature | GitHub Packages | Nexus |
|------|----------------|-------|
| Setup cost | Low | Medium |
| Permission model | GitHub-based | Custom |
| Maintenance | None | Required |
| Enterprise scale | Medium | High |

---

## 10. Summary

GitHub Maven Packages provides a **lightweight, GitHub-native** solution for Maven artifact hosting, ideal for internal libraries and modern CI/CD workflows.
