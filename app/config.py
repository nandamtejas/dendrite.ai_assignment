import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY")

DB_URI = os.environ.get("DB_URI")

STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")

STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY")

STRIPE_PRICE_API_KEY = os.environ.get("STRIPE_PRICE_API_KEY")

ACCESS_CONTROL_ALLOW_ORIGIN = "*"