# Why Use Multiple Subnets in One VPC

In cloud architecture, even when all resources are deployed inside a
single **VPC (Virtual Private Cloud)**, architects usually divide the
network into several **subnets**, such as:

-   Public Subnet
-   Management Subnet
-   Service Subnet
-   Data Subnet
-   Desktop Subnet

This design improves **security, traffic control, scalability, and
architecture clarity**.

------------------------------------------------------------------------

## 1. Security Isolation

Different layers of a system require different security levels.

Example:

  -------------------------------------------------------------------------
  Subnet       Typical Components                 Access Policy
  ------------ ---------------------------------- -------------------------
  Public       Load Balancer, Bastion Host        Accessible from Internet
  Subnet                                          

  Service      Application services               Only accessible
  Subnet                                          internally

  Data Subnet  Databases, Redis                   Only accessible from
                                                  service subnet

  Desktop      Cloud desktop VMs                  Controlled through
  Subnet                                          gateway

  Management   Monitoring, logging, admin tools   Admin-only access
  Subnet                                          
  -------------------------------------------------------------------------

This prevents sensitive resources such as **databases** from being
directly exposed to the internet.

------------------------------------------------------------------------

## 2. Traffic Control Between Subnets

Subnets allow architects to control **which parts of the system can
communicate**.

Example policy:

  Source           Destination      Allowed
  ---------------- ---------------- ---------
  Public Subnet    Service Subnet   Yes
  Public Subnet    Data Subnet      No
  Service Subnet   Data Subnet      Yes
  Desktop Subnet   Service Subnet   Yes
  Desktop Subnet   Data Subnet      No

This limits **lateral movement** if a machine becomes compromised.

------------------------------------------------------------------------

## 3. Clear Architecture Layering

Subnets usually represent **different architecture layers** of a system.

Example structure:

VPC\
├── Public Subnet (Load Balancer / Gateway)\
├── Management Subnet (Monitoring / Logging / Admin tools)\
├── Service Subnet (Backend services)\
├── Desktop Subnet (Virtual desktop VMs)\
└── Data Subnet (Database / Cache)

This separation makes the system easier to **design, operate, and
troubleshoot**.

------------------------------------------------------------------------

## 4. Routing Control

Each subnet can use different **route tables**.

Example:

  Subnet              Internet Access
  ------------------- -----------------
  Public Subnet       Yes
  Service Subnet      No
  Data Subnet         No
  Desktop Subnet      Limited
  Management Subnet   Restricted

This ensures only specific components can access the **internet or
external networks**.

------------------------------------------------------------------------

## 5. Fault and Risk Isolation

If one part of the system is compromised or misconfigured, subnet
isolation helps limit the impact.

Example:

-   A compromised desktop VM cannot directly access the database.
-   A public-facing server cannot reach internal management tools.

This reduces the risk of **large-scale security breaches**.

------------------------------------------------------------------------

## 6. IP Address Management

Subnets help organize IP allocation inside a VPC.

Example:

VPC CIDR: `10.0.0.0/16`

  Subnet              CIDR
  ------------------- -------------
  Public Subnet       10.0.1.0/24
  Management Subnet   10.0.2.0/24
  Service Subnet      10.0.3.0/24
  Desktop Subnet      10.0.4.0/22
  Data Subnet         10.0.8.0/24

Different layers can reserve different IP ranges depending on scale.

------------------------------------------------------------------------

# Summary

Even within a single VPC, multiple subnets are used to:

1.  Provide **security isolation**
2.  Control **network communication paths**
3.  Organize **system architecture layers**
4.  Apply different **routing policies**
5.  Improve **fault isolation**
6.  Manage **IP allocation efficiently**

Subnets turn a large flat network into a **structured and secure
architecture**.
