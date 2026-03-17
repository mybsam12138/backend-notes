# Network Security Matrix (Cloud Desktop Architecture)

## 1. Overview
This document defines the Network Security Matrix for the cloud desktop system.

## 2. Security Groups Definition
- sg-public: Internet-facing components
- sg-service: Application services
- sg-data: Data layer
- sg-management: Management layer

## 3. Network Security Matrix
Source | Destination | Port | Protocol | Purpose | Allowed
------ | ----------- | ---- | -------- | ------- | -------
Internet | sg-public | 443 | TCP | HTTPS access | YES
Internet | sg-public | 80 | TCP | HTTP redirect | OPTIONAL
sg-public | sg-service | 443 | TCP | Backend access | YES
sg-service | sg-service | ALL | TCP | Internal comm | YES
sg-service | sg-data | 6379 | TCP | Redis | YES
sg-service | sg-data | 3306 | TCP | MySQL | YES
sg-management | sg-service | 22/3389 | TCP | SSH/RDP | YES
sg-management | sg-data | 3306/6379 | TCP | Maintenance | YES
sg-data | sg-service | ANY | TCP | Reverse | NO
Internet | sg-service | ANY | TCP | Direct access | NO
Internet | sg-data | ANY | TCP | Direct access | NO

## 4. Design Principles
- Least privilege
- Layered security
- No direct data exposure
- Use SG referencing instead of IP
