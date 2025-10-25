from dotenv import load_dotenv
from pathlib import Path
import os

env_path = Path(__file__).resolve().parent.parent / ".env"      # Gets the absolute file path of the .env file
load_dotenv(dotenv_path=env_path)

# Getting the secrets from the .env file to sep up flask
FLASK_SECRET_KEY =          os.environ.get("FLASK_SECRET_KEY", "123456789")
JWT_SECRET_KEY =            os.environ.get("JWT_SECRET_KEY", "987654321")
SQLITE =                    os.environ.get("SQLITEDB", "name.db") 

# SPBS
SPBS_PASSWORD =             os.environ.get("SPBS_PASSWORD", "larenredandy")
SPBS_PORT =                 os.environ.get("SPBS_PORT")
SPBS_DATABASE =             os.environ.get("SPBS_DATABASE")

# SPBS Session pooler
SPBSV4_HOST =               os.environ.get("SPBSV4_HOST")
SPBSV4_USER =               os.environ.get("SPBSV4_USER")

# SPBS Transaction pooler
SPBS_TP_PORT =              os.environ.get("SPBS_TP_PORT")

# SPBS Direct Connectioe
SPBSDR_HOST =               os.environ.get("SPBSDR_HOST")
SPBSDR_USER =               os.environ.get("SPBSDR_USER")

# SPBS Project Key
SPBS_PROJECT_URL =          os.environ.get("SPBS_PROJECT_URL")
SPBS_SERVICE_ROLE_KEY =     os.environ.get("SPBS_SERVICE_ROLE_KEY")

# For Google Oauth
GOOGLE_CLIENT_ID =          os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET =      os.environ.get("GOOGLE_CLIENT_SECRET")
GOOGLE_APP_PSSW =           os.environ.get("GOOGLE_APP_PSSW", "abcd efgh ijkl mnop")