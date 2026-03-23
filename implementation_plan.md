# Backend + БД для электронной библиотеки «БиблиоТэка»

## Описание

Создание backend-сервера на FastAPI и базы данных PostgreSQL для существующего React-фронтенда электронной библиотеки. Бекенд заменит текущие mock-данные ([src/app/data/mock.ts](file:///Users/artem/WebstormProjects/Library/src/app/data/mock.ts)) реальными API-вызовами. Без Docker — все запускается локально.

## User Review Required

> [!IMPORTANT]
> Для работы необходим **локально установленный PostgreSQL**. Бэкенд создаст базу автоматически через скрипт инициализации. Убедитесь что PostgreSQL запущен и доступен по `localhost:5432`.

> [!WARNING]
> Необходимо определиться с **учётными данными PostgreSQL** (user/password). По умолчанию план использует `postgres:postgres`. Если у вас другие — укажите.

---

## Proposed Changes

### Структура проекта (итоговая)

```
Library/
├── backend/
│   ├── __init__.py
│   ├── main.py                  # FastAPI entrypoint
│   ├── config.py                # Настройки (DB URL, JWT secret)
│   ├── database.py              # SQLAlchemy engine + SessionLocal
│   ├── dependencies.py          # Общие зависимости (get_db, get_current_user)
│   ├── models/                  # SQLAlchemy модели
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── book.py
│   │   ├── review.py
│   │   ├── comment.py
│   │   ├── forum.py
│   │   ├── favorite.py
│   │   └── reading_history.py
│   ├── schemas/                 # Pydantic схемы
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── book.py
│   │   ├── review.py
│   │   ├── comment.py
│   │   ├── forum.py
│   │   └── stats.py
│   ├── routers/                 # API-роутеры
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── books.py
│   │   ├── reviews.py
│   │   ├── comments.py
│   │   ├── forum.py
│   │   ├── favorites.py
│   │   ├── reading_history.py
│   │   └── admin.py
│   ├── services/                # Бизнес-логика
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   └── admin_service.py
│   ├── init_db.py               # Инициализация БД + seed data
│   └── requirements.txt
├── src/                         # Существующий фронтенд (будет модифицирован)
│   └── app/
│       ├── api/                 # [NEW] API-клиент
│       │   ├── client.ts
│       │   ├── authApi.ts
│       │   ├── booksApi.ts
│       │   ├── reviewsApi.ts
│       │   ├── commentsApi.ts
│       │   ├── forumApi.ts
│       │   ├── usersApi.ts
│       │   └── adminApi.ts
│       ├── context/
│       │   └── AuthContext.tsx   # [MODIFY] JWT-based auth
│       ├── pages/               # [MODIFY] Замена mock → API fetch
│       └── data/mock.ts         # Останется как fallback/типы
└── vite.config.ts               # [MODIFY] Добавить proxy
```

---

### 1. Схема базы данных

```mermaid
erDiagram
    users {
        int id PK
        varchar username
        varchar email UK
        varchar hashed_password
        varchar avatar
        varchar banner
        text about
        varchar role "reader | admin"
        boolean is_active
        int violation_count
        timestamp created_at
    }
    books {
        int id PK
        varchar title
        varchar author
        text description
        varchar cover
        varchar genre
        int year
        boolean is_free
        float rating
        int reviews_count
        timestamp created_at
    }
    book_tags {
        int id PK
        int book_id FK
        varchar tag
    }
    reviews {
        int id PK
        int book_id FK
        int user_id FK
        int rating
        text text
        int likes
        int dislikes
        timestamp created_at
    }
    review_reactions {
        int id PK
        int review_id FK
        int user_id FK
        varchar reaction_type "like | dislike"
    }
    comments {
        int id PK
        int book_id FK
        int user_id FK
        int parent_id FK "nullable, для вложенных ответов"
        text content
        int likes
        int dislikes
        timestamp created_at
    }
    comment_reactions {
        int id PK
        int comment_id FK
        int user_id FK
        varchar reaction_type "like | dislike"
    }
    forum_topics {
        int id PK
        varchar title
        int author_id FK
        boolean is_pinned
        boolean is_locked
        varchar tag
        timestamp created_at
        timestamp last_activity
    }
    forum_messages {
        int id PK
        int topic_id FK
        int author_id FK
        text content
        int likes
        int dislikes
        int parent_id FK "nullable"
        timestamp created_at
    }
    forum_message_reactions {
        int id PK
        int message_id FK
        int user_id FK
        varchar reaction_type "like | dislike"
    }
    favorites {
        int id PK
        int user_id FK
        int book_id FK
        timestamp created_at
    }
    reading_history {
        int id PK
        int user_id FK
        int book_id FK
        int progress_percent
        int current_page
        timestamp last_read_at
    }

    users ||--o{ reviews : writes
    users ||--o{ comments : writes
    users ||--o{ forum_topics : creates
    users ||--o{ forum_messages : writes
    users ||--o{ favorites : has
    users ||--o{ reading_history : tracks
    books ||--o{ book_tags : has
    books ||--o{ reviews : has
    books ||--o{ comments : has
    reviews ||--o{ review_reactions : has
    comments ||--o{ comment_reactions : has
    comments ||--o{ comments : "replies to"
    forum_topics ||--o{ forum_messages : contains
    forum_messages ||--o{ forum_message_reactions : has
```

---

### 2. Backend — Компонент за компонентом

#### [NEW] [requirements.txt](file:///Users/artem/WebstormProjects/Library/backend/requirements.txt)
Зависимости: `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `psycopg2-binary`, `python-jose[cryptography]`, `passlib[bcrypt]`, `python-multipart`, `pydantic[email-validator]`.

#### [NEW] [config.py](file:///Users/artem/WebstormProjects/Library/backend/config.py)
Настройки из переменных окружения или defaults:
- `DATABASE_URL = postgresql://postgres:postgres@localhost:5432/biblioteka`
- `SECRET_KEY`, `ALGORITHM = HS256`, `ACCESS_TOKEN_EXPIRE_MINUTES = 1440`

#### [NEW] [database.py](file:///Users/artem/WebstormProjects/Library/backend/database.py)
SQLAlchemy engine, SessionLocal factory, Base class.

#### [NEW] [models/](file:///Users/artem/WebstormProjects/Library/backend/models/)
SQLAlchemy declarative models для всех таблиц из ER-диаграммы выше. Relationships между таблицами.

#### [NEW] [schemas/](file:///Users/artem/WebstormProjects/Library/backend/schemas/)
Pydantic BaseModel классы для request/response валидации.

#### [NEW] [dependencies.py](file:///Users/artem/WebstormProjects/Library/backend/dependencies.py)
- `get_db()` — yield DB session
- `get_current_user()` — decode JWT token from Authorization header
- `get_current_admin()` — проверка роли admin
- `get_optional_user()` — возвращает user или None (для гостей)

---

### 3. API-эндпоинты (роутеры)

#### [NEW] [routers/auth.py](file:///Users/artem/WebstormProjects/Library/backend/routers/auth.py)
| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| POST | `/api/auth/register` | Регистрация (email, username, password) | Гость |
| POST | `/api/auth/login` | Логин → JWT token | Гость |
| GET | `/api/auth/me` | Данные текущего пользователя | User |

#### [NEW] [routers/users.py](file:///Users/artem/WebstormProjects/Library/backend/routers/users.py)
| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/users/me` | Профиль | User |
| PUT | `/api/users/me` | Обновить профиль (name, email, about) | User |
| PUT | `/api/users/me/password` | Сменить пароль | User |
| PUT | `/api/users/me/avatar` | Загрузить аватар | User |
| PUT | `/api/users/me/banner` | Загрузить баннер | User |

#### [NEW] [routers/books.py](file:///Users/artem/WebstormProjects/Library/backend/routers/books.py)
| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/books` | Каталог (search, genre, sort, page) | Все |
| GET | `/api/books/{id}` | Детали книги | Все |
| POST | `/api/books` | Добавить книгу | Admin |
| PUT | `/api/books/{id}` | Изменить описание | Admin |
| DELETE | `/api/books/{id}` | Удалить книгу | Admin |
| GET | `/api/books/{id}/content` | Текст книги (для Reader) | User |

#### [NEW] [routers/reviews.py](file:///Users/artem/WebstormProjects/Library/backend/routers/reviews.py)
| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/books/{id}/reviews` | Список отзывов | Все |
| POST | `/api/books/{id}/reviews` | Написать отзыв | User |
| DELETE | `/api/reviews/{id}` | Удалить отзыв | Admin / Author |
| POST | `/api/reviews/{id}/react` | Лайк/дизлайк | User |

#### [NEW] [routers/comments.py](file:///Users/artem/WebstormProjects/Library/backend/routers/comments.py)
| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/books/{id}/comments` | Комментарии книги | Все |
| POST | `/api/books/{id}/comments` | Оставить комментарий | User |
| DELETE | `/api/comments/{id}` | Удалить комментарий | Admin / Author |
| POST | `/api/comments/{id}/react` | Лайк/дизлайк | User |

#### [NEW] [routers/forum.py](file:///Users/artem/WebstormProjects/Library/backend/routers/forum.py)
| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/forum/topics` | Список тем (пагинация) | Все |
| GET | `/api/forum/topics/{id}` | Тема с сообщениями | Все |
| POST | `/api/forum/topics` | Создать тему | User / Admin |
| DELETE | `/api/forum/topics/{id}` | Удалить тему | Admin |
| PUT | `/api/forum/topics/{id}/pin` | Закрепить/открепить | Admin |
| POST | `/api/forum/topics/{id}/messages` | Написать сообщение | User |
| DELETE | `/api/forum/messages/{id}` | Удалить сообщение | Admin / Author |
| POST | `/api/forum/messages/{id}/react` | Лайк/дизлайк | User |

#### [NEW] [routers/favorites.py](file:///Users/artem/WebstormProjects/Library/backend/routers/favorites.py)
| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/favorites` | Избранные книги | User |
| POST | `/api/favorites/{book_id}` | Добавить в избранное | User |
| DELETE | `/api/favorites/{book_id}` | Убрать из избранного | User |

#### [NEW] [routers/reading_history.py](file:///Users/artem/WebstormProjects/Library/backend/routers/reading_history.py)
| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/reading-history` | История прочтений | User |
| PUT | `/api/reading-history/{book_id}` | Обновить прогресс | User |

#### [NEW] [routers/admin.py](file:///Users/artem/WebstormProjects/Library/backend/routers/admin.py)
| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/admin/stats` | Общая статистика | Admin |
| GET | `/api/admin/users` | Список пользователей | Admin |
| POST | `/api/admin/users` | Зарегистрировать вручную | Admin |
| PUT | `/api/admin/users/{id}/block` | Заблокировать | Admin |
| PUT | `/api/admin/users/{id}/unblock` | Разблокировать | Admin |

---

### 4. Инициализация БД

#### [NEW] [init_db.py](file:///Users/artem/WebstormProjects/Library/backend/init_db.py)
Скрипт который:
1. Создаёт базу `biblioteka` в PostgreSQL (если не существует)
2. Создаёт все таблицы через `Base.metadata.create_all()`
3. Заполняет начальными данными из [mock.ts](file:///Users/artem/WebstormProjects/Library/src/app/data/mock.ts):
   - 5 книг с тегами
   - 5 отзывов
   - Admin-пользователь (admin@biblioteka.ru / admin123)
   - 3 тестовых пользователя
   - 2 темы на форуме с сообщениями

---

### 5. Интеграция фронтенда

#### [NEW] [src/app/api/client.ts](file:///Users/artem/WebstormProjects/Library/src/app/api/client.ts)
Axios instance с:
- `baseURL: '/api'`
- Interceptor для JWT token из localStorage
- Interceptor для обработки 401 → logout

#### [NEW] API-модули
- `authApi.ts`: login, register, getMe
- `booksApi.ts`: getBooks, getBook, createBook, updateBook, deleteBook
- `reviewsApi.ts`: getReviews, createReview, deleteReview, reactToReview
- `commentsApi.ts`: getComments, createComment, deleteComment, reactToComment
- `forumApi.ts`: getTopics, getTopic, createTopic, deleteTopic, togglePin, createMessage, deleteMessage, reactToMessage
- `usersApi.ts`: getProfile, updateProfile, changePassword
- `adminApi.ts`: getStats, getUsers, blockUser, unblockUser, createUser

#### [MODIFY] [AuthContext.tsx](file:///Users/artem/WebstormProjects/Library/src/app/context/AuthContext.tsx)
- Хранение JWT token + user object в state/localStorage
- `login(email, password)` → POST `/api/auth/login` → сохранить token
- `register(name, email, password)` → POST `/api/auth/register`
- `logout()` → очистить token

#### [MODIFY] Страницы
Каждая страница будет обновлена для загрузки данных через API вместо mock. Основные изменения:
- [Home.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/Home.tsx) — загрузка популярных/новых книг
- [Catalog.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/Catalog.tsx) — API-поиск с пагинацией
- [BookDetails.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/BookDetails.tsx) — загрузка книги, отзывов, комментариев
- [Forum.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/Forum.tsx) — загрузка тем
- [ForumTopic.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/ForumTopic.tsx) — загрузка сообщений
- [Profile.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/Profile.tsx) — загрузка профиля, избранного, истории
- [Admin.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/Admin.tsx) — загрузка статистики, книг, пользователей
- [Auth.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/Auth.tsx) — реальные login/register вызовы

#### [MODIFY] [vite.config.ts](file:///Users/artem/WebstormProjects/Library/vite.config.ts)
Добавить proxy `/api` → `http://localhost:8000`.

---

## Verification Plan

### Автоматическая проверка
1. **Запуск backend**:
   ```bash
   cd /Users/artem/WebstormProjects/Library
   pip install -r backend/requirements.txt
   python backend/init_db.py
   uvicorn backend.main:app --reload --port 8000
   ```
2. **Swagger UI**: Открыть `http://localhost:8000/docs` в браузере — все эндпоинты доступны и документированы.

### Ручная верификация через браузер
1. Запустить frontend (`npm run dev` на другом порту)
2. Открыть сайт в браузере и проверить:
   - **Гость**: каталог книг отображается, форум читается, регистрация/логин работает
   - **Пользователь**: профиль загружается, избранное работает, отзывы пишутся, форум позволяет писать
   - **Админ**: панель показывает статистику из БД, книги добавляются/редактируются/удаляются, пользователи блокируются/разблокируются
