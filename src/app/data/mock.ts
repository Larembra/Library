export interface Book {
  id: string;
  title: string;
  author: string;
  rating: number;
  reviewsCount: number;
  cover: string;
  tags: string[];
  genre: string;
  year: number;
  isFree: boolean;
  description: string;
}

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Тайны древнего кода',
    author: 'Алексей Иванов',
    rating: 4.8,
    reviewsCount: 124,
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&h=600&auto=format&fit=crop',
    tags: ['Киберпанк', 'Детектив'],
    genre: 'Фантастика',
    year: 2024,
    isFree: true,
    description: 'В мире, где информация стала ценнее золота, один хакер находит код, способный изменить реальность.'
  },
  {
    id: '2',
    title: 'Ветер перемен',
    author: 'Мария Петрова',
    rating: 4.5,
    reviewsCount: 89,
    cover: 'https://images.unsplash.com/photo-1543004471-240ce44a4732?q=80&w=400&h=600&auto=format&fit=crop',
    tags: ['Романтика', 'Драма'],
    genre: 'Проза',
    year: 2023,
    isFree: false,
    description: 'История о поиске себя в стремительно меняющемся мире постмодерна.'
  },
  {
    id: '3',
    title: 'Забытые миры',
    author: 'Дмитрий Соколов',
    rating: 4.9,
    reviewsCount: 256,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&h=600&auto=format&fit=crop',
    tags: ['Эпическое фэнтези'],
    genre: 'Фэнтези',
    year: 2025,
    isFree: true,
    description: 'Древние боги пробуждаются, и только один человек может остановить грядущий хаос.'
  },
  {
    id: '4',
    title: 'Алгоритмы жизни',
    author: 'Елена Кузнецова',
    rating: 4.2,
    reviewsCount: 45,
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&h=600&auto=format&fit=crop',
    tags: ['Научпоп', 'Психология'],
    genre: 'Образование',
    year: 2024,
    isFree: false,
    description: 'Как наш мозг принимает решения и можно ли запрограммировать счастье?'
  },
  {
    id: '5',
    title: 'Тени прошлого',
    author: 'Виктор Смирнов',
    rating: 4.7,
    reviewsCount: 167,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&h=600&auto=format&fit=crop',
    tags: ['Триллер', 'Мистика'],
    genre: 'Детектив',
    year: 2022,
    isFree: true,
    description: 'Старый заброшенный дом хранит тайны, о которых лучше было бы забыть.'
  },
];
