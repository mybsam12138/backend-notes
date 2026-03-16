# Bastion Host (Jump Server)

## 1. Overview

A **Bastion Host** (also called a **Jump Server**) is a **special
gateway server used to securely access machines inside a private
network**.

Instead of allowing administrators to connect directly to internal
servers, all access must first pass through the bastion host.

This design improves **security, auditing, and access control**.

Example concept:

Administrator Laptop\
│\
│ SSH / RDP\
▼\
Bastion Host\
│\
│ Internal Network Access\
▼\
App Server \| Database \| VM Instances

------------------------------------------------------------------------

# 2. Purpose of Bastion Host

The bastion host acts as a **security gateway** between external users
and internal infrastructure.

Main goals:

-   Reduce attack surface
-   Centralize administrative access
-   Record and audit operations
-   Enforce security policies

Without bastion:

Internet → App Server\
Internet → Database\
Internet → VM

With bastion:

Internet\
│\
▼\
Bastion Host\
│\
▼\
Private Servers

Only the bastion is exposed to the outside network.

------------------------------------------------------------------------

# 3. Typical Deployment Architecture

### Example Network Architecture

Internet\
│\
Firewall / Security Group\
│\
Public Network\
│\
Bastion Host\
│\
│ Internal Access\
▼\
Private Network\
├── Application Servers\
├── Database Servers\
└── Virtual Machines

------------------------------------------------------------------------

# 4. Core Features of Bastion Systems

## 4.1 Controlled Access

Administrators must connect to bastion first.

Example:

ssh admin@bastion.company.com

Then access internal servers.

ssh app-server-01

------------------------------------------------------------------------

## 4.2 Authentication

Bastion hosts usually support:

-   Password authentication
-   SSH key authentication
-   Multi-factor authentication (MFA)
-   LDAP / Active Directory integration
-   SSO login

------------------------------------------------------------------------

## 4.3 Permission Management

Access can be restricted by role.

Example:

  User Role    Allowed Servers
  ------------ ------------------
  Developer    Dev servers
  DBA          Database servers
  Operations   All servers

------------------------------------------------------------------------

## 4.4 Operation Auditing

Bastion hosts record administrator activity for security compliance.

Audit information may include:

-   Login records
-   Executed commands
-   Session logs
-   Full session video replay

This helps detect:

-   Misconfiguration
-   Security incidents
-   Unauthorized actions

------------------------------------------------------------------------

# 5. Bastion vs Jump Server

These two terms refer to the same concept.

  Term           Meaning
  -------------- ----------------------------
  Bastion Host   Security architecture term
  Jump Server    Operational access term

Both describe a **gateway used to access internal systems**.

------------------------------------------------------------------------

# 6. Common Bastion Tools

Examples of bastion systems:

  Tool                   Type
  ---------------------- --------------------------------
  JumpServer             Open-source bastion system
  Teleport               Modern bastion access platform
  AWS Session Manager    Managed bastion alternative
  Huawei Cloud Bastion   Cloud-managed bastion service

------------------------------------------------------------------------

# 7. Security Best Practices

When deploying a bastion host:

1.  Only expose bastion to the internet.
2.  Place all internal systems in private networks.
3.  Enforce MFA authentication.
4.  Record all administrative operations.
5.  Restrict user permissions based on roles.
6.  Regularly update and patch the bastion server.

------------------------------------------------------------------------

# 8. Summary

A **Bastion Host** is a **secure gateway for administrative access to
internal systems**.

Key characteristics:

-   Centralized access point
-   Improves network security
-   Enables auditing and monitoring
-   Protects internal infrastructure from direct exposure

In modern infrastructure architecture, bastion hosts are widely used in:

-   Cloud environments
-   Enterprise data centers
-   DevOps operations
-   Secure remote administration
