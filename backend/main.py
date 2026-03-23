from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import auth, users, books, reviews, comments, forum, favorites, reading_history, admin, bookmarks

app = FastAPI(
    title="БиблиоТэка API",
    description="API электронной библиотеки БиблиоТэка",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(books.router)
app.include_router(reviews.router)
app.include_router(comments.router)
app.include_router(forum.router)
app.include_router(favorites.router)
app.include_router(reading_history.router)
app.include_router(admin.router)
app.include_router(bookmarks.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "БиблиоТэка API"}
