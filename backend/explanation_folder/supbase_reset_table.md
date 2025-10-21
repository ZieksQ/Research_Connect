Punta kayo sa app.py tas makikita nyo to

```python
from App import run_app
from App.database import Base, engine

RESET = False
app = run_app()

if __name__ == "__main__":
    if RESET:
        Base.metadata.drop_all(engine)
    else:
        Base.metadata.create_all(engine)

    HOST = "0.0.0.0"            # Listen on all available network interfaces
    LOCAL_HOST = "127.0.0.1"    # Local host
    PORT = 5000
    print(f"Running on host: http://{LOCAL_HOST}:{PORT}")
    app.run(host=LOCAL_HOST, port=PORT, debug=True)
```

1. Gawin nyong ``` True ``` yung ``` RESET ``` then run nyo
2. Check nyo yung supabase, if walang laman na. close nyo yung flask
3. Then gawin nyong ``` False ``` yung  ``` RESET ``` then run again