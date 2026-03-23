import os


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://artem@localhost:5432/biblioteka"
)

SECRET_KEY = os.getenv("SECRET_KEY", "biblioteka-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
