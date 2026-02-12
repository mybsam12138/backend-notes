# Kubernetes Service Type: NodePort

## 1. What is NodePort?

NodePort is a Kubernetes Service type that exposes a Service on a static
port on each Node's IP address. It allows external traffic to access
Pods by connecting to:

    NodeIP:NodePort

Kubernetes automatically allocates a port (default range: 30000--32767)
on every node.

------------------------------------------------------------------------

## 2. How NodePort Works

Traffic flow:

    Internet
       ↓
    NodeIP:NodePort
       ↓
    kube-proxy (iptables/IPVS)
       ↓
    Service
       ↓
    Pod

-   Every node listens on the assigned NodePort.
-   kube-proxy forwards traffic to backend Pods.
-   Pods can run on any node in the cluster.

------------------------------------------------------------------------

## 3. When to Use NodePort

NodePort is suitable for:

-   Small environments
-   Development or testing
-   Internal systems
-   On-prem clusters without cloud integration
-   When using an external load balancer manually

------------------------------------------------------------------------

## 4. Advantages

-   Simple to configure
-   No cloud dependency
-   Works in any Kubernetes cluster
-   Useful building block for external load balancers

------------------------------------------------------------------------

## 5. Limitations

-   No built-in health checking
-   No automatic failover
-   No public IP unless node has one
-   Not ideal for large-scale production systems
-   Exposes high ports (less flexible than standard 80/443)

------------------------------------------------------------------------

## 6. Production Pattern

Common production usage:

    Internet
       ↓
    External Load Balancer
       ↓
    NodeIP:NodePort
       ↓
    Service → Pod

NodePort is often used internally by:

-   Service type LoadBalancer
-   Ingress Controller exposure

------------------------------------------------------------------------

## 7. Key Configuration Example

``` yaml
apiVersion: v1
kind: Service
metadata:
  name: demo-service
spec:
  type: NodePort
  selector:
    app: demo
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30080
```

------------------------------------------------------------------------

## 8. Key Takeaways

-   NodePort opens the same port on all nodes.
-   kube-proxy handles packet forwarding.
-   It is a Layer 4 exposure method.
-   It is simple but not a full-featured load balancer.
