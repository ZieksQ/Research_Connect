from App import run_app
from App.db import Base, engine

app = run_app()

if __name__ == "__main__":
    Base.metadata.create_all(engine)
    HOST = "127.0.0.1"
    PORT = 5000
    print(f"Running on host: http://{HOST}:{PORT}")
    app.run(host=HOST, port=PORT, debug=True)