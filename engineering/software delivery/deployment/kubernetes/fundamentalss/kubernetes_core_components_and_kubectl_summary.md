# Kubernetes Core Components and kubectl — Practical Summary

This document summarizes the **core Kubernetes components**, their responsibilities, and clarifies the relationship between **kubectl** and the **API Server**.

---

## 1. High-level architecture

Kubernetes is an **API-driven distributed system**.

- One logical **control plane** manages the cluster
- Multiple **worker nodes** run workloads
- **All interactions go through the API Server**

There is no direct communication between clients and nodes.

---

## 2. Control Plane components

The control plane is responsible for **cluster state and decision making**.

### kube-apiserver

- Central entry point of the cluster
- Exposes the Kubernetes REST API
- Responsibilities:
  - Authentication and authorization (RBAC)
  - Request validation and admission control
  - Reading/writing cluster state to etcd

> Every component communicates with Kubernetes **via the API Server**.

---

### etcd

- Distributed key-value store
- Stores **desired state** and **actual state**
- Single source of truth for the cluster

No other component accesses etcd directly except the API Server.

---

### kube-scheduler

- Watches for Pods without assigned nodes
- Selects the best node based on:
  - resource availability
  - constraints and affinity rules
- Writes the binding result back to the API Server

---

### kube-controller-manager

- Runs multiple controllers
- Each controller reconciles:
  > desired state == actual state

Examples:
- Deployment controller
- ReplicaSet controller
- Node controller

Controllers continuously watch the API Server.

---

## 3. Worker Node components

Worker nodes execute workloads assigned by the control plane.

### kubelet

- Runs on every node
- Watches the API Server for assigned Pods
- Responsibilities:
  - Creates and manages containers
  - Reports Pod and node status

kubelet **never talks directly to etcd**.

---

### Container Runtime

- Runs containers for Pods
- Examples:
  - containerd
  - CRI-O

kubelet communicates with the runtime via the CRI (Container Runtime Interface).

---

### kube-proxy

- Implements Service networking
- Uses:
  - iptables or
  - IPVS
- Performs L3/L4 traffic forwarding and load balancing

---

## 4. kubectl explained

### What kubectl is

- Command-line client for Kubernetes
- Installed on:
  - developer laptops
  - CI/CD servers
  - bastion or admin hosts

kubectl is **not part of the cluster**.

---

### What kubectl does

- Converts user commands into HTTP requests
- Sends requests to the API Server over HTTPS
- Displays responses to the user

kubectl performs **no scheduling, no execution, no state management**.

---

## 5. Request flow example

Command:
```bash
kubectl apply -f pod.yaml
```

Actual flow:

1. kubectl sends an HTTPS request to the API Server
2. API Server validates and stores the object in etcd
3. Controllers detect state changes
4. Scheduler selects a node
5. kubelet creates the Pod on the node

kubectl finishes after step 1.

---

## 6. Key rules to remember

- kubectl talks **only** to the API Server
- Nodes never accept direct user commands
- All components observe and act via API Server state

---

## 7. One-sentence takeaway

> **kubectl is just a client installed anywhere; the API Server is the central brain that every Kubernetes component and user must talk to.**

---

End of document.

