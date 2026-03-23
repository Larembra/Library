# Walkthrough: Backend Implementation & Frontend Integration

## Что было сделано

В рамках этой задачи мы разработали полноценный backend для электронной библиотеки и интегрировали его с предложенным фронтендом.

### 1. Архитектура и База данных (Бэкенд)
- **Технологии**: FastAPI, PostgreSQL, SQLAlchemy, Pydantic, JWT (bcrypt).
- **Схема БД**: Была спроектирована и реализована база данных, включающая:
  - [User](file:///Users/artem/WebstormProjects/Library/backend/models/user.py#8-22): Пользователи с профилями, аватарами, ролями (admin/reader) и активностью.
  - [Book](file:///Users/artem/WebstormProjects/Library/src/app/api/booksApi.ts#3-17) и [BookTag](file:///Users/artem/WebstormProjects/Library/backend/models/book.py#25-31): Книги со всем метаописанием, тегами и текстом ([content](file:///Users/artem/WebstormProjects/Library/backend/routers/books.py#80-86)).
  - [Review](file:///Users/artem/WebstormProjects/Library/backend/models/review.py#8-19) и [ReviewReaction](file:///Users/artem/WebstormProjects/Library/backend/models/review.py#21-32): Отзывы с оценками на книги и система лайков/дизлайков.
  - [Comment](file:///Users/artem/WebstormProjects/Library/backend/models/comment.py#8-19) и [CommentReaction](file:///Users/artem/WebstormProjects/Library/backend/models/comment.py#21-32): Вложенные комментарии (с ответами) и система реакций на них.
  - [ForumTopic](file:///Users/artem/WebstormProjects/Library/backend/models/forum.py#8-19), [ForumMessage](file:///Users/artem/WebstormProjects/Library/backend/models/forum.py#21-32), [ForumMessageReaction](file:///Users/artem/WebstormProjects/Library/backend/models/forum.py#34-45): Полноценный форум с возможностью закреплять, блокировать темы и отвечать на сообщения с цитированием.
  - [Favorite](file:///Users/artem/WebstormProjects/Library/backend/models/favorite.py#8-19) и [ReadingHistory](file:///Users/artem/WebstormProjects/Library/backend/models/reading_history.py#8-21): Избранные книги и отслеживание прогресса чтения (процент, страница, время).
- **Безопасность**: Настроена JWT-аутентификация для защиты API, а также ролевая модель (простые читатели и администраторы). 

### 2. API Эндпоинты
Разработано более 40 RESTful API эндпоинтов, покрывающих весь функционал:
- Авторизация (Login, Register).
- Каталог книг с поддержкой поиска, фильтрации жанров, сортировок по рейтингу/новизне/популярности и пагинацией.
- CRUD для отзывов с автоматическим пересчетом `rating` и `reviews_count` у книги.
- Вывод и создание вложенных комментариев.
- Иерархический форум (Темы -> Сообщения -> Ответы).
- Административная панель для управления пользователями (блокировка/создание) и книгами (CRUD).
  
### 3. Интеграция с Frontend
- Создан модуль взаимодействия с API с помощью `axios`, включающий перехватчики (interceptors) для сохранения и отправки JWT-токена.
- Конфигурация Vite дополнена Development Proxy (`/api` -> `http://localhost:8000`) для избежания проблем с CORS во время разработки.
- **Все ключевые страницы переведены на реальный API**:
  - [AuthContext](file:///Users/artem/WebstormProjects/Library/src/app/context/AuthContext.tsx#4-12): полностью переписан на получение/проверку/управление токенами из API.
  - Окно авторизации/регистрации ([Auth.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/Auth.tsx)).
  - Главная страница ([Home.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/Home.tsx)) теперь подтягивает последние книги, лучшие книги и "продолжить чтение" из API.
  - Каталог ([Catalog.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/Catalog.tsx)).
  - Детальная страница книги ([BookDetails.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/BookDetails.tsx)).
  - Форум и темы форума ([Forum.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/Forum.tsx), [ForumTopic.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/ForumTopic.tsx)).
  - Личный кабинет с историей чтения и настройками ([Profile.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/Profile.tsx)).
  - Панель администратора ([Admin.tsx](file:///Users/artem/WebstormProjects/Library/src/app/pages/Admin.tsx)).

### 4. Данные для старта
Для быстрого начала работы был написан скрипт [init_db.py](file:///Users/artem/WebstormProjects/Library/backend/init_db.py), который:
- Создает необходимую базу данных в PostgreSQL (на пользователя OS).
- Генерирует таблицы.
- Наполняет таблицы 5-ю книгами с текстом, 6-ю пользователями (включая админа), темами форума, а также тестовыми отзывами и комментариями для наглядности работы приложения.

---

## Что дальше?

Бэкенд готов и соединен с фронтендом. Теперь вы можете:
- Запустить фронтенд с `npm run dev`
- Запустить бэкенд с `uvicorn backend.main:app --reload --port 8000`
- Протестировать авторизацию администратора (`admin@biblioteka.ru` / `admin123`) и других пользователей.
- Если вы встретите проблему с `python -m backend.init_db`, убедитесь, что запускаете команду именно с флагом `-m` в корневой директории проекта или настроите PYTHONPATH, как обсуждалось в нашем чате.
