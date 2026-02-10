# Weaknesses and Risks of Kubernetes RollingUpdate

## Overview

RollingUpdate is the default and most commonly used Deployment strategy in Kubernetes.
While it enables zero-downtime deployments, it introduces several architectural and operational risks.
These risks must be addressed at application and system design level.

This document summarizes the key weaknesses of RollingUpdate and why they matter.

---

## 1. Multiple Versions Coexist

### Description
During a rolling update, old and new versions of Pods run at the same time.

### Risks
- Different Pods may behave differently
- Requests may hit different versions unpredictably
- Bugs may appear only during deployment

### Impact
- Hard-to-reproduce issues
- Increased complexity in debugging

---

## 2. Backward Compatibility Is Mandatory

### Description
Old and new versions must be mutually compatible.

### Risks
- Breaking API changes cause runtime failures
- Removed or renamed fields break deserialization
- Enum changes cause logic errors

### Impact
- Production incidents during rollout
- Forced rollback or emergency fixes

---

## 3. Database Schema Change Constraints

### Description
Database schema must support both versions simultaneously.

### Risks
- Dropping columns breaks old Pods
- NOT NULL constraints fail old writes
- Type changes cause runtime SQL errors

### Impact
- Deployment blocked by database coupling
- Increased migration complexity

---

## 4. Configuration Inconsistency

### Description
ConfigMaps and Secrets may be updated independently of Pods.

### Risks
- Old Pods reading new config
- New Pods reading old config
- Incompatible config formats

### Impact
- Undefined behavior
- Runtime crashes during deployment

---

## 5. Cache and Session Incompatibility

### Description
Shared caches are used across versions.

### Risks
- Serialization format changes
- Key structure changes
- TTL logic mismatch

### Impact
- Data corruption
- Session loss
- Authentication failures

---

## 6. Background Jobs and Consumers

### Description
Multiple versions may process background tasks simultaneously.

### Risks
- Duplicate processing
- Different logic applied to same message
- Incompatible message formats

### Impact
- Data inconsistency
- Broken workflows

---

## 7. Non-Atomic Deployment

### Description
RollingUpdate is not an atomic operation.

### Risks
- Partial rollout states
- Traffic split across versions
- Hard to reason about system state

### Impact
- Complex failure scenarios
- Longer recovery time

---

## 8. Graceful Shutdown Dependency

### Description
RollingUpdate relies on proper shutdown handling.

### Risks
- Requests dropped on Pod termination
- In-flight transactions aborted
- Resource leaks

### Impact
- User-facing errors
- Data inconsistency

---

## 9. Observability Complexity

### Description
Logs, metrics, and traces span multiple versions.

### Risks
- Mixed-version logs
- Metrics aggregation hides version-specific issues
- Traces cross incompatible versions

### Impact
- Difficult debugging
- Slower incident resolution

---

## 10. Not Suitable for Breaking Changes

### Description
RollingUpdate assumes compatibility by design.

### Risks
- Protocol changes break communication
- State coordination fails
- Distributed locks become unsafe

### Impact
- RollingUpdate becomes unsafe
- Alternative strategies required

---

## 11. Operational Complexity Increases Over Time

### Description
As systems grow, compatibility requirements accumulate.

### Risks
- Longer deprecation cycles
- More feature flags
- Higher cognitive load

### Impact
- Slower development
- Increased maintenance cost

---

## Final Takeaway

RollingUpdate shifts complexity from infrastructure to application design.

RollingUpdate is safe only when the system is explicitly designed for version coexistence.
