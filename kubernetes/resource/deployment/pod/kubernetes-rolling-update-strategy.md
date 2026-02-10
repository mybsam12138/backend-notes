# Kubernetes Pod Update Strategy — RollingUpdate

## 1. What Is a Pod Update Strategy

In Kubernetes, a Deployment defines how Pods are created, updated, and replaced.
The update strategy controls how Pods change when the desired state changes.

Kubernetes is declarative:
- You declare the desired state
- Kubernetes reconciles current state to desired state

A rolling update only happens when Kubernetes detects a meaningful change.

---

## 2. RollingUpdate Strategy Overview

strategy:
  type: RollingUpdate

RollingUpdate updates Pods gradually:
- New Pods are created first
- Old Pods are terminated step by step
- The service stays available during the update

This is the default and recommended strategy for production services.

---

## 3. RollingUpdate Parameters Explained

Example:

strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0

### maxSurge
Maximum number of extra Pods allowed above the desired replica count during update.

Purpose:
- Allows new Pods to start before old Pods are terminated
- Improves availability

### maxUnavailable
Maximum number of Pods allowed to be unavailable during update.

Purpose:
- Guarantees service availability
- Zero downtime when set to 0

---

## 4. When RollingUpdate Executes

RollingUpdate is triggered only when spec.template changes.

If spec.template changes:
- New ReplicaSet is created
- RollingUpdate executes

If spec.template does not change:
- No rolling update
- No Pod restart
- No image pull

---

## 5. Changes That Trigger RollingUpdate

- Container image
- Environment variables
- Command or args
- Resource requests or limits
- Volume mounts
- Labels in spec.template.metadata.labels
- Annotations in spec.template.metadata.annotations

---

## 6. Changes That Do Not Trigger RollingUpdate

- Re-applying the same Deployment YAML
- Changes outside spec.template
- Pushing a new image with the same tag
- ConfigMap or Secret content changes without template reference

---

## 7. Image Update Scenarios

### Image Tag Change

image: myapp:1.0.1

Result:
- Pod template hash changes
- RollingUpdate executes
- New image is pulled

Recommended best practice.

---

### Same Image Tag (latest)

image: myapp:latest

Result:
- No detected change
- No rolling update
- No image pull

---

## 8. Forcing RollingUpdate Without Image Tag Change

### Using Annotations

spec:
  template:
    metadata:
      annotations:
        deployAt: 2026-02-10T12:00:00Z

This changes the Pod template and forces a rolling update.

---

### kubectl rollout restart

kubectl rollout restart deployment myapp

Internally adds a timestamp annotation and triggers RollingUpdate.

---

### Config Checksum Pattern

annotations:
  checksum/config: <hash>

Common in Helm and GitOps to trigger redeploy on config change.

---

## 9. Image Pull Behavior

Images are pulled only when Pods are created.

imagePullPolicy:
- IfNotPresent
- Always

Notes:
- Does not affect running Pods
- Pod recreation is required

---

## 10. Best Practices

- Use immutable image tags
- Avoid latest in production
- Use annotations for forced redeploys
- Use maxUnavailable: 0 for critical services

---

## 11. Key Takeaway

RollingUpdate is triggered by Pod template changes, not by kubectl apply or registry updates.
