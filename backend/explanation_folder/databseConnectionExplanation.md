# 🧩 Supabase Connection Types & Network Behavior (Philippines Context)

This document explains the **difference between Supabase connection types** —  
**Direct Connection**, **Session Pooler**, and **Transaction Pooler** —  
and how they behave under different network conditions (Wi-Fi and mobile data in the Philippines).

---

## ⚙️ 1. Overview

Supabase provides three main PostgreSQL connection modes:

| Connection Type | Port | Description | Typical Use Case |
|------------------|------|-------------|------------------|
| **Direct Connection** | `5432` | Direct PostgreSQL access (no pooling). Each client maintains a persistent TCP session. | Local dev, migrations, or admin tasks |
| **Session Pooler** | `6543` | Connections are pooled by session. Allows temp tables and session vars. | Backend APIs or long-lived connections |
| **Transaction Pooler** | `6544` | Connections are pooled by transaction. Highly scalable and serverless-friendly. | Production / Cloud / Mobile access ✅ |

---

## 🌐 2. Behavior on Wi-Fi vs. Mobile Data (Philippines)

In the Philippines, ISPs and mobile carriers (PLDT, Converge, Globe, Smart, DITO) handle PostgreSQL ports differently.

| Connection Type | Wi-Fi (PLDT / Converge) | Mobile Data (Globe / Smart / DITO) | Notes |
|------------------|--------------------------|------------------------------------|--------|
| **Direct Connection** | ✅ Usually stable | ❌ Often blocked or dropped | Port `5432` may be filtered by mobile carriers |
| **Session Pooler** | ✅ Works fine | ⚠️ Can disconnect randomly | Still uses long TCP sessions |
| **Transaction Pooler** | ✅ Works reliably | ✅ Works best | Short-lived pooled connections survive NAT and ISP resets |

> **Recommendation:**  
> Always use **Transaction Pooler** for production and cross-network compatibility.

---

## 🧠 3. Why Transaction Pooler Is More Reliable

1. **Short-lived connections** → less affected by NAT or carrier resets.  
2. **Different ports (6544)** → less likely to be blocked than `5432`.  
3. **Automatic reconnection** → if a mobile connection drops, the pooler recovers.  
4. **Server-side pooling** → database connections stay warm even if the client disconnects.

> ✅ The Transaction Pooler is designed for **serverless**, **mobile**, and **unstable networks**.

---

## 🔧 4. Example Connection Strings

You can find these in your Supabase dashboard under **Project → Database → Connection Pooling**.

```bash
# Direct Connection
postgresql://USER:PASSWORD@db.<project>.supabase.co:5432/postgres

# Session Pooler
postgresql://USER:PASSWORD@pooler.<project>.supabase.co:6543/postgres

# Transaction Pooler (Recommended)
postgresql://USER:PASSWORD@pooler.<project>.supabase.co:6544/postgres
```