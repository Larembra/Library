from pydantic import BaseModel


class StatsOut(BaseModel):
    total_books: int
    total_users: int
    total_comments: int
    total_readings: int
