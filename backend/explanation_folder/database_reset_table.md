Punta kayo sa app.py tas makikita nyo to

```python
from App import run_app
from App.database import Base, engine
from time import sleep

RESET = False
app = run_app()
if __name__ == "__main__":
    if RESET:
        Base.metadata.drop_all(engine)
        sleep(5.0)
        Base.metadata.create_all(engine)
    else:
        Base.metadata.create_all(engine)

    HOST = "0.0.0.0"            # Listen on all available network interfaces
    LOCAL_HOST = "127.0.0.1"    # Local host
    PORT = 5000
    print(f"Running on host: http://{HOST}:{PORT}")
    app.run(host=HOST, port=PORT, debug=True)
```

<br></br>

#### Resets the whole table in the databse. if you run this just wait 5-10 seconcs since if i dont put a break within those if causes problems
```python
RESET = True
```

<br></br>

#### runs normally
```python
RESET = False
```