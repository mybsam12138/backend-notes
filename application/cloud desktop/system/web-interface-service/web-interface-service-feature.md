# Web Interface Service – Features

## 1. Overview

The **Web Interface Service (WI)** is the frontend gateway of a Cloud Desktop System.  
It provides the user portal that allows users to access and manage their cloud desktops.

This service communicates with backend services such as:

- Authentication Service
- Desktop Management Service
- Desktop Communication Service

The Web Interface Service mainly focuses on **user interaction, request routing, and session handling**.

---

# 2. Core Features

## 2.1 User Login Portal

The Web Interface Service provides the login interface for users.

Users can authenticate using:

- Local accounts
- Active Directory
- LDAP
- Huawei Cloud IAM
- OAuth / Single Sign-On (SSO)

Typical features include:

- Login page
- Credential input
- Redirect to authentication service
- Session initialization after login

Example APIs:

POST /login  
POST /logout

---

## 2.2 Desktop List Display

After successful login, the Web Interface Service retrieves and displays the list of desktops available to the user.

Displayed information may include:

- Desktop name
- Desktop status (running / stopped)
- Assigned resources
- Operating system type
- Last login time

Example API:

GET /desktops

---

## 2.3 Desktop Launch Request

Users can launch their virtual desktops through the portal.

The Web Interface Service sends a request to the Desktop Management Service and Desktop Communication Service to establish a session.

Typical actions include:

- Launch desktop
- Resume existing session
- Connect to remote desktop

Example API:

POST /launchDesktop

---

## 2.4 Session Management

The Web Interface Service manages user sessions after login.

Responsibilities include:

- Maintaining login sessions
- Managing session timeout
- Validating authentication tokens
- Handling logout operations

Example APIs:

GET /session  
POST /logout

---

## 2.5 Request Routing

The Web Interface Service acts as a gateway that routes user requests to backend services.

Examples:

- Authentication requests → Authentication Service
- Desktop operations → Desktop Management Service
- Session connection → Desktop Communication Service

This separation ensures that frontend logic remains independent from backend business logic.

---

## 2.6 User Interface Rendering

The Web Interface Service provides the user interface for interacting with the system.

Typical UI pages include:

- Login page
- Desktop dashboard
- Desktop status page
- Connection page

The interface may be implemented using modern frontend frameworks such as:

- Vue
- React
- Angular

---

## 2.7 Error Handling and Notifications

The Web Interface Service provides user feedback for system events.

Examples include:

- Login failure messages
- Desktop connection errors
- Session timeout notifications
- System maintenance alerts

---

# 3. Interaction with Other Services

The Web Interface Service communicates with other microservices in the system.

Example interaction flow:

User opens portal  
↓  
Web Interface Service displays login page  
↓  
Authentication Service verifies identity  
↓  
Web Interface Service retrieves desktop list from Desktop Management Service  
↓  
User launches desktop  
↓  
Desktop Communication Service establishes connection

---

# 4. Summary

The **Web Interface Service** is the main entry point for users in a Cloud Desktop System.

Its main responsibilities include:

- providing the login portal
- displaying available desktops
- sending desktop launch requests
- managing user sessions
- routing requests to backend services
- rendering the user interface

This service acts as the bridge between users and the backend microservices of the cloud desktop platform.