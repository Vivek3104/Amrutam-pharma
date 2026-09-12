# Security Checklist & STRIDE Threat Model
## Amrutam Telemedicine Platform

---

## 1. Data Classification Schema

| Level | Classification | Examples | Storage & Encryption Standard |
|---|---|---|---|
| **L4** | **Restricted (PHI / PII)** | Diagnosis, Prescriptions, Phone, DOB, Medical History | Field-level **AES-256-GCM** encryption at rest, TLS 1.3 in transit |
| **L3** | **Confidential** | User Passwords, MFA Secrets, JWT Tokens, Payment Tokens | Hashed with **bcrypt** (cost 12), TOTP secrets encrypted |
| **L2** | **Internal** | Audit Logs, Consultation Status, Doctor Fees | Database encrypted at rest via AWS KMS |
| **L1** | **Public** | Doctor Specialties, Ratings, Public Bios | Cached in Redis, public CDN |

---

## 2. OWASP Top 10 Mitigation Matrix

| OWASP Risk | Vulnerability | Amrutam Technical Mitigation |
|---|---|---|
| **A01: Broken Access Control** | Unauthorized access to patient PHI | JWT authentication + RBAC middleware (`PATIENT`, `DOCTOR`, `ADMIN`). Row-level ownership check. |
| **A02: Cryptographic Failures** | Plaintext exposure of health records | AES-256-GCM field encryption for PHI. SHA-256 HMAC digital signatures on prescriptions. |
| **A03: Injection** | SQL Injection or Command Injection | Parameterized SQL queries via `pg` driver; input validation using `Zod` schemas. |
| **A04: Insecure Design** | Double-booking or race conditions | Redlock distributed locks + DB optimistic concurrency locking + HTTP Idempotency. |
| **A05: Security Misconfiguration** | Exposed headers or debug ports | `helmet` security headers, strict CORS policy, non-root Docker container, environment variables. |
| **A07: Identification & Auth Failures** | Password brute force / Session hijack | `bcrypt` (12 rounds), MFA (TOTP with Google Authenticator), sliding window rate limiting. |
| **A08: Software & Data Integrity** | Prescription tampering | Digital signature verification (`verifyDigitalSignature`) on every prescription retrieval. |
| **A09: Logging & Monitoring Failures** | Unnoticed security breaches | Immutable `audit_logs` table tracking user ID, IP, action, resource, timestamp, payload hash. |

---

## 3. STRIDE Threat Model Analysis

| Threat | Risk Description | Countermeasure / Security Controls |
|---|---|---|
| **Spoofing** | Attacker impersonates a Doctor to issue fake prescriptions | JWT validation + TOTP MFA enforcement for prescription issuance endpoints. |
| **Tampering** | Altering prescription details in DB | HMAC-SHA256 digital signature attached to prescription upon creation; verified on read. |
| **Repudiation** | Doctor denies issuing a prescription or Patient denies booking | Immutable append-only `audit_logs` capturing user ID, IP, user-agent, and SHA-256 payload hash. |
| **Information Disclosure** | Leakage of Patient phone/DOB/diagnosis via DB dump | AES-256-GCM envelope field encryption; decryption keys isolated in KMS / environment. |
| **Denial of Service** | DDoS on booking endpoints during peak sale | Sliding-window Redis rate-limiter (`RATE_LIMIT_MAX_REQUESTS`), AWS WAF rate rules. |
| **Elevation of Privilege** | Patient attempts admin analytics API | Role-Based Access Control (`authorizeRoles('ADMIN')`) checked on every request. |

---

## 4. Key Rotation & Encryption Lifecycle

1. **Master Key Management**: AWS KMS / HashiCorp Vault stores the 256-bit Master Encryption Key (MEK).
2. **Key Rotation Schedule**: Environment encryption key rotated every 90 days.
3. **Data Re-encryption**: Re-encryption background job decrypts records using Key $V_{n-1}$ and re-encrypts with Key $V_n$.

---

## 5. RBAC Permission Matrix

| Endpoint / Feature | PATIENT | DOCTOR | ADMIN |
|---|:---:|:---:|:---:|
| `POST /api/v1/auth/register` | Public | Public | Public |
| `POST /api/v1/doctors/slots` | ❌ | ✅ | ❌ |
| `POST /api/v1/bookings` | ✅ | ❌ | ❌ |
| `PATCH /api/v1/consultations/:id/status` | ✅ | ✅ | ❌ |
| `POST /api/v1/prescriptions` | ❌ | ✅ | ❌ |
| `GET /api/v1/prescriptions/consultation/:id` | ✅ (Own) | ✅ (Own) | ❌ |
| `GET /api/v1/analytics/overview` | ❌ | ❌ | ✅ |
| `GET /api/v1/audit/logs` | ❌ | ❌ | ✅ |
