"""
Скрипт инициализации базы данных.
Создает базу 'biblioteka', все таблицы и заполняет начальными данными из mock.ts.

Запуск:
    python -m backend.init_db
"""
import sys
from datetime import datetime, timedelta

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

from backend.config import DATABASE_URL
from backend.database import engine, Base, SessionLocal
from backend.models import (
    User, Book, BookTag, Review, Comment,
    ForumTopic, ForumMessage, ReadingHistory, Favorite,
)
from backend.services.auth_service import get_password_hash


def create_database():
    """Create the database if it doesn't exist."""
    # Connect to the default 'postgres' database to create our DB
    base_url = DATABASE_URL.rsplit("/", 1)[0] + "/postgres"
    tmp_engine = create_engine(base_url, isolation_level="AUTOCOMMIT")
    db_name = DATABASE_URL.rsplit("/", 1)[1]

    with tmp_engine.connect() as conn:
        result = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :name"),
            {"name": db_name},
        )
        if not result.fetchone():
            conn.execute(text(f'CREATE DATABASE "{db_name}"'))
            print(f"✅ База данных '{db_name}' создана")
        else:
            print(f"ℹ️  База данных '{db_name}' уже существует")

    tmp_engine.dispose()


def create_tables():
    """Create all tables."""
    Base.metadata.create_all(bind=engine)
    print("✅ Все таблицы созданы")


def seed_data():
    """Fill database with initial data from mock.ts."""
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(User).count() > 0:
            print("ℹ️  Данные уже существуют, пропускаем заполнение")
            return

        print("📦 Заполняем базу начальными данными...")

        # ── Users ──────────────────────────────────────────────
        admin = User(
            username="Администратор",
            email="admin@biblioteka.ru",
            hashed_password=get_password_hash("admin123"),
            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop",
            banner="https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&h=400&auto=format&fit=crop",
            about="Администратор электронной библиотеки БиблиоТэка",
            role="admin",
        )
        db.add(admin)

        users_data = [
            {
                "username": "Иван Петров",
                "email": "ivan@example.com",
                "password": "user123",
                "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop",
            },
            {
                "username": "Анна Смирнова",
                "email": "anna@example.com",
                "password": "user123",
                "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop",
            },
            {
                "username": "Дмитрий Козлов",
                "email": "dmitry@example.com",
                "password": "user123",
                "avatar": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&auto=format&fit=crop",
            },
            {
                "username": "Елена Волкова",
                "email": "elena@example.com",
                "password": "user123",
                "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop",
            },
            {
                "username": "Александр Новиков",
                "email": "alexander@example.com",
                "password": "user123",
                "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&auto=format&fit=crop",
            },
        ]
        user_objects = []
        for u in users_data:
            user = User(
                username=u["username"],
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                avatar=u["avatar"],
                about=f"Пользователь библиотеки БиблиоТэка",
            )
            db.add(user)
            user_objects.append(user)

        db.flush()  # Get IDs
        print(f"  👤 Создано {len(user_objects) + 1} пользователей (admin + {len(user_objects)} читателей)")

        # ── Books ──────────────────────────────────────────────
        books_data = [
            {
                "title": "Тайны древнего кода",
                "author": "Алексей Иванов",
                "description": "В мире, где информация стала ценнее золота, один хакер находит код, способный изменить реальность.",
                "cover": "https://cdn.litres.ru/pub/c/cover_415/16953689.webp",
                "genre": "Фантастика",
                "year": 2024,
                "is_free": True,
                "rating": 4.8,
                "reviews_count": 3,
                "tags": ["Киберпанк", "Детектив"],
                "content": "Глава 1: Начало\n\nВ мире, где информация стала ценнее золота, один хакер находит код, способный изменить реальность. Его имя — Кирилл, и он работал в тени уже больше десяти лет.\n\nГлава 2: Находка\n\nОднажды ночью, просматривая зашифрованные данные с сервера, Кирилл наткнулся на последовательность символов, которая не поддавалась обычному дешифрованию. Это был код, написанный на языке, которого не существовало ни в одной базе данных мира.\n\nГлава 3: Тайна\n\nКод оказался ключом к древнему знанию, утерянному тысячи лет назад. Каждая строка открывала новый уровень понимания реальности, словно кто-то оставил послание из глубины веков.\n\n(Продолжение следует...)",
            },
            {
                "title": "Ветер перемен",
                "author": "Мария Петрова",
                "description": "История о поиске себя в стремительно меняющемся мире постмодерна.",
                "cover": "https://cdn.litres.ru/pub/c/cover_415/69538882.jpg",
                "genre": "Проза",
                "year": 2023,
                "is_free": False,
                "rating": 4.5,
                "reviews_count": 1,
                "tags": ["Романтика", "Драма"],
                "content": "Глава 1: Утро\n\nСвет пробивался сквозь тяжелые шторы. Лиза открыла глаза и поняла, что сегодня всё изменится.\n\n(Продолжение следует...)",
            },
            {
                "title": "Забытые миры",
                "author": "Дмитрий Соколов",
                "description": "Древние боги пробуждаются, и только один человек может остановить грядущий хаос.",
                "cover": "https://vse-svobodny.com/wp-content/uploads/2025/12/%D0%9D%D0%B5%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D1%8B%D0%B9-%D0%BC%D0%B8%D1%80-scaled.jpg",
                "genre": "Фэнтези",
                "year": 2025,
                "is_free": True,
                "rating": 4.9,
                "reviews_count": 1,
                "tags": ["Эпическое фэнтези"],
                "content": "Глава 1: Пророчество\n\nВ древних свитках говорилось о дне, когда небо расколется надвое и забытые боги вернутся в мир смертных.\n\n(Продолжение следует...)",
            },
            {
                "title": "Алгоритмы жизни",
                "author": "Елена Кузнецова",
                "description": "Как наш мозг принимает решения и можно ли запрограммировать счастье?",
                "cover": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxtYYpvlDXC1mMaMDTJOTHqEZBzGOEKQN9yw&s",
                "genre": "Образование",
                "year": 2024,
                "is_free": False,
                "rating": 4.2,
                "reviews_count": 0,
                "tags": ["Научпоп", "Психология"],
                "content": "Введение\n\nКаждый день наш мозг принимает тысячи решений. Большинство из них мы даже не замечаем.\n\n(Продолжение следует...)",
            },
            {
                "title": "Тени прошлого",
                "author": "Виктор Смирнов",
                "description": "Старый заброшенный дом хранит тайны, о которых лучше было бы забыть.",
                "cover": "https://cdn.azbooka.ru/cv/w1100/c417988a-a1e5-4cdf-accb-c5c1dc63f65d.jpg",
                "genre": "Детектив",
                "year": 2022,
                "is_free": True,
                "rating": 4.7,
                "reviews_count": 0,
                "tags": ["Триллер", "Мистика"],
                "content": "Пролог\n\nДом стоял на окраине города уже больше пятидесяти лет. Его окна были заколочены, а дверь — заперта на три замка.\n\n(Продолжение следует...)",
            },
        ]

        book_objects = []
        for b_data in books_data:
            tags = b_data.pop("tags")
            content = b_data.pop("content")
            book = Book(**b_data, content=content)
            db.add(book)
            db.flush()
            for tag_name in tags:
                db.add(BookTag(book_id=book.id, tag=tag_name))
            book_objects.append(book)

        print(f"  📚 Создано {len(book_objects)} книг")

        # ── Reviews ────────────────────────────────────────────
        reviews_data = [
            {"book_idx": 0, "user_idx": 0, "rating": 5, "text": "Потрясающая книга! Сюжет держит в напряжении до последней страницы. Автор мастерски создал атмосферу киберпанка.", "likes": 24, "dislikes": 1},
            {"book_idx": 0, "user_idx": 1, "rating": 4, "text": "Хорошая книга, но концовка показалась немного предсказуемой. В целом рекомендую!", "likes": 12, "dislikes": 3},
            {"book_idx": 0, "user_idx": 2, "rating": 5, "text": "Лучшее, что я читал за последний год! Обязательно буду следить за новыми работами автора.", "likes": 35, "dislikes": 0},
            {"book_idx": 1, "user_idx": 3, "rating": 4, "text": "Красивая история о поиске себя. Местами немного затянуто, но финал того стоит.", "likes": 18, "dislikes": 2},
            {"book_idx": 2, "user_idx": 4, "rating": 5, "text": "Эпическое фэнтези в лучших традициях жанра! Мир проработан до мельчайших деталей.", "likes": 42, "dislikes": 1},
        ]

        for r_data in reviews_data:
            review = Review(
                book_id=book_objects[r_data["book_idx"]].id,
                user_id=user_objects[r_data["user_idx"]].id,
                rating=r_data["rating"],
                text=r_data["text"],
                likes=r_data["likes"],
                dislikes=r_data["dislikes"],
                created_at=datetime.utcnow() - timedelta(days=5 - r_data["book_idx"]),
            )
            db.add(review)

        print(f"  ⭐ Создано {len(reviews_data)} отзывов")

        # ── Comments ───────────────────────────────────────────
        comment = Comment(
            book_id=book_objects[0].id,
            user_id=user_objects[2].id,
            content="Книга просто потрясающая! Не мог оторваться до самого утра. Особенно понравилась развязка в 14 главе.",
            likes=24,
            dislikes=2,
        )
        db.add(comment)
        print("  💬 Создан 1 комментарий")

        # ── Forum ──────────────────────────────────────────────
        topic1 = ForumTopic(
            title="Обсуждение концовки «Тайны древнего кода»",
            author_id=user_objects[2].id,
            is_pinned=True,
            tag="Теории",
        )
        db.add(topic1)
        db.flush()

        msg1 = ForumMessage(
            topic_id=topic1.id,
            author_id=user_objects[2].id,
            content="Кто что думает о финальном твисте в Тайны древнего кода? Мне кажется, автор оставил слишком много вопросов для сиквела, или я что-то упустил в 12 главе?",
            likes=24,
            dislikes=1,
        )
        db.add(msg1)

        msg2 = ForumMessage(
            topic_id=topic1.id,
            author_id=user_objects[1].id,
            content='Я согласна, финал открытый. Но если перечитать момент с письмом в начале книги, то многие детали становятся понятнее. Это классический прием "ненадежного рассказчика".',
            likes=12,
            dislikes=0,
        )
        db.add(msg2)

        # Additional forum topics
        for i in range(5):
            topic = ForumTopic(
                title=f"Тема форума #{i + 2}",
                author_id=user_objects[i % len(user_objects)].id,
                is_locked=(i == 1),
                tag="Обсуждение",
                last_activity=datetime.utcnow() - timedelta(hours=i * 2),
            )
            db.add(topic)
            db.flush()
            msg = ForumMessage(
                topic_id=topic.id,
                author_id=user_objects[i % len(user_objects)].id,
                content=f"Первое сообщение в теме #{i + 2}. Давайте обсудим!",
            )
            db.add(msg)

        print("  📋 Создано 6 тем форума с сообщениями")

        # ── Reading History (for admin user) ───────────────────
        for i, book in enumerate(book_objects[:3]):
            rh = ReadingHistory(
                user_id=admin.id,
                book_id=book.id,
                progress_percent=65 - i * 20,
                current_page=100 - i * 30,
                last_read_at=datetime.utcnow() - timedelta(days=i),
            )
            db.add(rh)

        # ── Favorites (for admin user) ─────────────────────────
        for book in book_objects[:3]:
            db.add(Favorite(user_id=admin.id, book_id=book.id))

        print("  📖 Создана история чтения и избранное для админа")

        db.commit()
        print("✅ Все начальные данные загружены!")
        print()
        print("🔑 Учётные данные:")
        print("   Админ:       admin@biblioteka.ru / admin123")
        print("   Пользователь: ivan@example.com / user123")

    except Exception as e:
        db.rollback()
        print(f"❌ Ошибка при заполнении данных: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("🚀 Инициализация базы данных БиблиоТэка")
    print("=" * 50)
    create_database()
    create_tables()
    seed_data()
    print("=" * 50)
    print("✅ Готово!")
