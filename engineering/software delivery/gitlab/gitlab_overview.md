# GitLab Overview

## 1. Definition

GitLab is an all-in-one DevOps platform that enables teams to manage the
entire software development lifecycle, including code hosting,
collaboration, continuous integration (CI), and continuous deployment
(CD).

------------------------------------------------------------------------

## 2. Core Features

### 2.1 Source Code Management (Git)

-   Repository hosting using Git
-   Branching and merging
-   Version control
-   Collaboration through commits and branches

------------------------------------------------------------------------

### 2.2 Merge Requests (MR)

-   Code review before merging changes
-   Discussion and collaboration on code
-   Approval workflows

------------------------------------------------------------------------

### 2.3 CI/CD Pipelines

-   Automate build, test, and deployment processes
-   Defined using `.gitlab-ci.yml`
-   Supports multiple stages (build, test, deploy)

#### Example

``` yaml
stages:
  - build
  - test
  - deploy

build:
  script:
    - mvn clean package

deploy:
  script:
    - docker build -t app .
```

------------------------------------------------------------------------

### 2.4 Testing Integration

-   Run automated tests
-   Display test results in pipelines
-   Ensure code quality

------------------------------------------------------------------------

### 2.5 Deployment

-   Deploy applications to servers or cloud platforms
-   Integration with Docker and Kubernetes

------------------------------------------------------------------------

### 2.6 Issue Tracking

-   Manage tasks, bugs, and features
-   Basic project management capabilities

------------------------------------------------------------------------

## 3. Benefits

### 3.1 All-in-One Platform

GitLab combines multiple tools into one:

-   Code repository (like GitHub)
-   CI/CD (like Jenkins)
-   Issue tracking (like Jira)

------------------------------------------------------------------------

### 3.2 Integrated CI/CD

-   No need for external CI tools
-   Pipelines are built-in and easy to configure

------------------------------------------------------------------------

### 3.3 Self-Hosting Capability

-   Can be deployed on internal servers
-   Suitable for enterprise environments with security requirements

------------------------------------------------------------------------

## 4. Typical Workflow

    Developer pushes code
            ↓
    GitLab triggers pipeline
            ↓
    Build (e.g., Maven / npm)
            ↓
    Test (unit tests)
            ↓
    Deploy (Docker / server / Kubernetes)

------------------------------------------------------------------------

## 5. Comparison with Other Tools

  Tool      Purpose
  --------- --------------------
  GitLab    All-in-one DevOps
  GitHub    Code hosting
  Jenkins   CI/CD automation
  Jira      Project management

------------------------------------------------------------------------

## 6. Use Case Example

For a project with Vue frontend and Spring Boot backend:

1.  Developer pushes code to GitLab
2.  Pipeline runs:
    -   Build frontend (`npm build`)
    -   Build backend (`mvn package`)
    -   Build Docker image
3.  Deploy to server or Kubernetes

------------------------------------------------------------------------

## 7. Summary

GitLab is a comprehensive DevOps platform that integrates code
management, CI/CD pipelines, and collaboration tools, enabling teams to
efficiently develop, test, and deploy software.
