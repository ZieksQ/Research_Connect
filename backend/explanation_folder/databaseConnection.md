# Configure this in the database.py

### You will see 
```python
TESTING = False  # Used for unit testing
SQLDB = True     # If testing is True, decide if you want to switch to a sqlite(True) instead of memory 
IPV4 = False     # True if you need IPv4 compatibility, however if not set it to false as it is recommended by Supabase
TPOOLER = False  # If IPV4 is True, then decide if you need Transaction_Pooler(True) or Session_Pooler(False)

DATABASE_URL = set_up_db_url(TESTING=TESTING, SQLDB=SQLDB,
                             IPV4=IPV4, TPOOLER=TPOOLER)
```

### Behind the scenes this is just
```python
def set_up_db_url():
    if TESTING == True:
        if SQLDB:
            # This returns a sqlite databse file path
        else: 
            # This returns a sqlite in memory. this is used for unit/integration testing
    else:
        if IPV4 == True:
            if TPOOLER:
                # This returns a supabase transaction pooler connection
            else:
                # This returns a supabase session pooler connection
        else:
                # This returns a supabase direct connection
```

---

1. TESTING is where you want to use sqlite or not. True if you want, False will return a Direct Connection on supabse
2. SQLDB is always True for since you won't be unit testing anyway
3. IPV4, if your connection only accepts IPv4 then True, if not False cuz its reccomeneded by supbase since we are in development
4. TPOOLER, if you need transaction pooler. True for transaction pooler, False for Session Pooler
---

## 🧠Supabase Connections in the Philippines
> ## See databseConnectionExplanation.md if you want a longer explanation

- **Transaction Pooler (Port 6544)** → ✅ **Best choice for production.**
  - Works on both Wi-Fi and mobile data.
  - Avoids VPN issues.
  - Scales easily and survives NAT / ISP resets.

- **Session Pooler (Port 6543)** → ⚙️ Good for backend servers.
  - Keeps session state (temp tables, variables).
  - May drop on unstable mobile networks.

- **Direct Connection (Port 5432)** → ⚠️ Use only for migrations or local scripts.
  - Often blocked by mobile ISPs (Globe, Smart, DITO).
  - Needs VPN on some networks.

👉 **Summary:**  
If your teammate needed a VPN before, switching to **Transaction Pooler** fixed it because it uses a more reliable port and short-lived connections that work better on Philippine mobile data networks.
