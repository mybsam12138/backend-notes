# Cloud Desktop System – Microservice Split Overview

This document summarizes a simplified microservice architecture for a Cloud Desktop System (such as Huawei Cloud Desktop).  
The architecture focuses on four core services:

- Web Interface Service
- Authentication Service
- Desktop Management Service
- Desktop Communication Service

These services work together to provide desktop access, authentication, and remote desktop sessions.

---

# 1. Overall Architecture

A simplified architecture of the cloud desktop platform:

User  
↓  
Web Interface Service (WI)  
↓  
Authentication Service  
↓  
Desktop Management Service  
↓  
Desktop Communication Service  
↓  
Virtual Desktop (VM)

Each service is responsible for a specific domain of functionality.

---

# 2. Web Interface Service (WI)

## Purpose

The Web Interface Service acts as the entry point for users.  
It provides the web portal or frontend interface used to interact with the cloud desktop platform.

## Responsibilities

- User login interface
- Redirect to authentication service
- Display available desktops
- Desktop launch requests
- Session management
- API gateway for frontend requests

## Typical APIs

POST /login  
GET /desktops  
POST /launchDesktop  
POST /logout

## Example Flow

User opens portal →  
User clicks login →  
Redirect to authentication service →  
After login → display desktop list.

---

# 3. Authentication Service

## Purpose

The Authentication Service verifies user identity and integrates with enterprise identity providers such as:

- Local user accounts stored in the system database
- Active Directory
- LDAP
- Huawei Cloud IAM
- OAuth / SSO providers
- MFA

## Responsibilities

- User authentication
- Token generation
- Identity verification
- SSO integration
- Session validation

## Example Authentication Flow

User enters credentials →  
Web portal sends request to authentication service →  
Authentication service verifies credentials (or OAuth provider) →  
Returns access token.

## Typical APIs

POST /authenticate  
POST /token  
GET /userinfo  
POST /logout

---

# 4. Desktop Management Service

## Purpose

The Desktop Management Service manages the lifecycle of virtual desktops.

It controls desktop creation, assignment, and resource allocation.

## Responsibilities

- Create virtual desktops
- Delete desktops
- Assign desktops to users
- Manage desktop pools
- Manage desktop images
- Query desktop status

## Example Functions

- Create desktop from template
- Assign desktop to user
- Start or stop desktop
- List user desktops

## Typical APIs

POST /desktop/create  
DELETE /desktop/{id}  
GET /desktop/list  
POST /desktop/start  
POST /desktop/stop

---

# 5. Desktop Communication Service

## Purpose

The Desktop Communication Service handles real-time communication between users and their virtual desktops.

It acts as the gateway that connects users to remote desktop sessions.

## Responsibilities

- Establish remote desktop sessions
- Route user connections to virtual machines
- Manage session communication
- Handle remote display protocols

## Supported Protocols

Typical protocols include:

- RDP (Remote Desktop Protocol)
- HDP (Huawei Desktop Protocol)
- PCoIP
- WebSocket tunnels

## Example Flow

User launches desktop →  
Web portal calls desktop management service →  
Desktop communication service establishes session →  
User connects to VM.

## Typical APIs

POST /session/create  
GET /session/{id}  
POST /session/terminate

---

# 6. Example End-to-End Login and Desktop Launch Flow

1. User opens the cloud desktop portal.
2. Web Interface Service displays login page.
3. User authenticates through Authentication Service.
4. Authentication Service returns a token.
5. Web Interface Service requests desktop list from Desktop Management Service.
6. User selects a desktop.
7. Desktop Management Service verifies desktop availability.
8. Desktop Communication Service creates a session.
9. User connects to the virtual desktop.

---

# 7. Summary

A simplified cloud desktop platform can be divided into four main microservices:

| Service | Responsibility |
|------|------|
| Web Interface Service | User portal and frontend interaction |
| Authentication Service | Identity verification and login |
| Desktop Management Service | Desktop lifecycle management |
| Desktop Communication Service | Remote desktop session connection |

This microservice architecture separates authentication, management, and communication responsibilities, making the system easier to scale, maintain, and extend.