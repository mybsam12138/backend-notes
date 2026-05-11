# Software Development vs. Maintenance
> A comprehensive reference guide

---

## 1. Definitions

### Development
> Building **new capabilities** that do not yet exist in the system.

Development is any activity where the **output did not exist before**. It follows a full Software Development Life Cycle (SDLC) — from planning and requirements through design, coding, testing, and deployment. It typically requires a dedicated project team, a defined budget (often CapEx), and a structured delivery timeline.

### Maintenance
> Keeping an **existing system** healthy, stable, and current.

Maintenance is any activity performed **after a system is live**, aimed at sustaining, correcting, adapting, or improving it — without introducing fundamentally new business functionality. It is typically funded as operational expenditure (OpEx) and handled by sustaining or operations teams.

---

## 2. Types of Maintenance

| Type | Definition | Examples |
|---|---|---|
| **Corrective** | Fix what is broken | Bug fixes, crash patches, data corrections |
| **Adaptive** | Adapt to environmental changes | OS upgrades, 3rd-party API changes, compliance updates |
| **Perfective** | Improve existing functionality | Performance tuning, UX improvements, refactoring |
| **Preventive** | Prevent future problems | Automated testing, monitoring, alerting, code cleanup |

---

## 3. Activities by Category

### Development Activities
- Building new features or modules from scratch
- New system architecture and database design
- New API design and implementation
- Greenfield projects and new product versions
- Major platform rewrites or full system rebuilds
- Prototyping and proof-of-concept (POC) work
- Writing tests and QA **as part of delivering a new feature**
- Performance/load testing **before a new system goes live**

### Maintenance Activities

#### Corrective Maintenance
- Fixing bugs reported after go-live
- Patching system crashes or failures
- Correcting data integrity issues

#### Adaptive Maintenance
- Upgrading to a new OS or runtime version
- Adapting to 3rd-party API changes
- Meeting new regulatory or compliance requirements
- Migrating one module or component to a newer framework

#### Perfective Maintenance
- Refactoring existing code for readability
- Improving performance of existing features
- Enhancing existing UI/UX without adding new functionality

#### Preventive Maintenance
- Setting up CPU, memory, or disk alarms
- Monitoring API error rates and response times
- Centralized logging (e.g. ELK stack, CloudWatch)
- Building Grafana dashboards for an existing system
- Adding automated regression tests to a live system
- Automating previously manual test cases
- Setting up CI/CD pipelines for an existing system
- Security patching and vulnerability scanning
- Technical debt reduction

---

## 4. Grey Areas & How to Decide

Some activities are genuinely hard to classify. Use these questions:

| Question | Points to Development | Points to Maintenance |
|---|---|---|
| Does new business functionality get added? | Yes | No |
| Is this a full system rewrite? | Yes | No |
| Is the trigger technical obsolescence ? | No | Yes |
| Does it require a separate project team and budget? | Yes | No |
| Will users see significant new capabilities? | Yes | No |
| Is the scope large (weeks to months)? | Yes | No |

### Common Grey Area Examples

| Scenario | Classification | Reason |
|---|---|---|
| Full system rebuild on new tech stack | **Development** | New system, full SDLC, CapEx investment |
| Migrating one module to a new framework | **Adaptive Maintenance** | Partial, existing functionality unchanged |
| Upgrading a framework version | **Adaptive Maintenance** | Environmental change, no new functionality |
| Building a monitoring/alerting system | **Preventive Maintenance** | Protects existing system |
| Enterprise-wide observability platform (large scope) | **Development** | Large enough to be its own project |
| Adding Grafana dashboards to existing setup | **Preventive Maintenance** | Small scope, operational intent |
| Writing tests during a new feature build | **Development** | In-scope of the project delivery |
| Adding automated tests to a live legacy system | **Preventive Maintenance** | Protecting existing system post go-live |
| Centralized logging plugged into existing system | **Preventive Maintenance** | Operational visibility, no new business feature |
| Building a custom centralized log pipeline from scratch | **Development** | New system, significant scope and effort |

---

## 5. Key Differences at a Glance

| Dimension | Development | Maintenance |
|---|---|---|
| **Purpose** | Build something new | Keep existing system healthy |
| **Output** | New functionality or system | Improved stability, reliability, adaptability |
| **Trigger** | Business requirement | Operational need or environmental change |
| **SDLC** | Full cycle required | Partial cycle (scoped to the change) |
| **Team** | Project/delivery team | Ops, sustaining engineering, DevOps |
| **Budget type** | CapEx (Capital Expenditure) | OpEx (Operational Expenditure) |
| **Duration** | Weeks to months (project-based) | Ongoing, continuous |
| **Risk** | Higher (new, unknown) | Lower (known system) |
| **User impact** | New capabilities delivered | Stability and reliability preserved |

---

## 6. The Golden Rule

> **Ask: "Did this system already exist, and am I protecting or sustaining it?"**
>
> - **Yes** → Maintenance
> - **No, I am building something new** → Development

When scope is large enough to require its own budget, team, and project plan — treat it as **Development**, regardless of intent.

---

## 7. Quick Reference: Monitoring & Testing

Both monitoring and automated testing follow the same classification logic:

| Activity | Built during new project | Added to existing live system |
|---|---|---|
| Alarms (CPU, API errors) | Development | **Preventive Maintenance** |
| Centralized logging + Grafana | Development | **Preventive Maintenance** |
| Automated tests | Development | **Preventive Maintenance** |
| CI/CD pipeline | Development | **Preventive Maintenance** |

---

*Reference guide based on industry-standard software engineering practices.*
