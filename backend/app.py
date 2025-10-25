from App import run_app
from App.database import Base, engine

RESET = False
app = run_app()
if __name__ == "__main__":
    if RESET:
        Base.metadata.drop_all(engine)
    else:
        Base.metadata.create_all(engine)

    HOST = "0.0.0.0"            # Listen on all available network interfaces
    LOCAL_HOST = "127.0.0.1"    # Local host
    PORT = 5000
    print(f"Running on host: http://{LOCAL_HOST}:{PORT}")
    app.run(host=HOST, port=PORT, debug=True)