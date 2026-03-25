# How to Enable HTTPS on Tomcat (Linux) — Summary

## 1. Prerequisites

- Linux server with Java (JDK 8+)
- Apache Tomcat installed (e.g., /opt/tomcat)
- A domain name pointing to your server (optional but recommended)
- Open port **443** (and/or 8443) in firewall/security group

---

## 2. Obtain a Certificate

### Option A: Let’s Encrypt (recommended for public sites)

Install Certbot and issue a certificate:

```bash
sudo apt update
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

Generated files (example):

```text
/etc/letsencrypt/live/yourdomain.com/
  ├── fullchain.pem
  └── privkey.pem
```

---

### Option B: Self-signed certificate (for testing)

```bash
keytool -genkeypair   -alias tomcat   -keyalg RSA   -keysize 2048   -keystore /opt/tomcat/conf/keystore.jks   -validity 3650
```

---

## 3. Convert Certificate to PKCS12 (for Tomcat)

Tomcat commonly uses **PKCS12** or **JKS**.

```bash
openssl pkcs12 -export   -in fullchain.pem   -inkey privkey.pem   -out /opt/tomcat/conf/keystore.p12   -name tomcat   -password pass:changeit
```

---

## 4. Configure Tomcat Connector

Edit:

```bash
/opt/tomcat/conf/server.xml
```

Add or modify HTTPS connector:

```xml
<Connector
    port="8443"
    protocol="org.apache.coyote.http11.Http11NioProtocol"
    maxThreads="200"
    SSLEnabled="true">

    <SSLHostConfig>
        <Certificate
            certificateKeystoreFile="conf/keystore.p12"
            certificateKeystorePassword="changeit"
            type="PKCS12" />
    </SSLHostConfig>
</Connector>
```

> For production, you can change port to **443** (may require root or setcap).

---

## 5. Restart Tomcat

```bash
cd /opt/tomcat/bin
./shutdown.sh
./startup.sh
```

---

## 6. Verify HTTPS

Open in browser:

```text
https://yourdomain.com:8443
```

Or test via curl:

```bash
curl -v https://yourdomain.com:8443
```

---

## 7. Optional: Redirect HTTP → HTTPS

Add to `web.xml` (global) or app-level:

```xml
<security-constraint>
  <web-resource-collection>
    <web-resource-name>SecureApp</web-resource-name>
    <url-pattern>/*</url-pattern>
  </web-resource-collection>
  <user-data-constraint>
    <transport-guarantee>CONFIDENTIAL</transport-guarantee>
  </user-data-constraint>
</security-constraint>
```

Or configure redirect in reverse proxy (Nginx) if used.

---

## 8. Notes / Best Practices

- Prefer **Let’s Encrypt** for valid browser trust
- Automate renewal:

```bash
sudo certbot renew --dry-run
```

- Keep private key secure (`privkey.pem`)
- Use strong TLS versions (TLS 1.2/1.3)
- Consider placing **Nginx/Apache** in front for TLS termination

---

## 9. One-line takeaway

> Enable HTTPS in Tomcat by obtaining a certificate, converting it to PKCS12/JKS, configuring the HTTPS connector in `server.xml`, and restarting the server.
