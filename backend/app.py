from App import run_app

app = run_app()

if __name__ == "__main__":
    HOST = "127.0.0.1"
    PORT = 5000
    print(f"Running on host: http://{HOST}:{PORT}")
    app.run(host=HOST, port=PORT, debug=True)