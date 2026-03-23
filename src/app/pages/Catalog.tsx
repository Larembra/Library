import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Grid, List as ListIcon, ChevronDown, Loader2 } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { booksApi, type Book } from '../api/booksApi';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

// Default genres as fallback
const DEFAULT_GENRES = ['Все', 'Фантастика', 'Фэнтези', 'Проза', 'Детектив', 'Триллер', 'Образование', 'Психология'];

export const Catalog: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Все');
  const [showFilters, setShowFilters] = useState(false);
  const genres = ["Все", "Фантастика", "Фэнтези", "Детектив", "Романтика", "Триллер", "Ужасы", "Приключения", "Научпоп", "Проза", "Классика"];
  const [sortBy, setSortBy] = useState('popular');
  
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [availableGenres, setAvailableGenres] = useState<string[]>(DEFAULT_GENRES);
  const observerTarget = useRef(null);

  const fetchBooks = async (pageNum: number, append: boolean = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const resp = await booksApi.getBooks({
        search: search || undefined,
        genre: selectedGenre !== 'Все' ? selectedGenre : undefined,
        sort: sortBy,
        page: pageNum,
        per_page: 20,
      });
      if (append) {
        setBooks(prev => [...prev, ...resp.data.books]);
      } else {
        setBooks(resp.data.books);
      }
      setTotal(resp.data.total);
      setHasMore(resp.data.books.length === 20);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and filter changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchBooks(1, false);
  }, [search, selectedGenre, sortBy]);

  // Load available genres
  useEffect(() => {
    booksApi.getGenres().then(r => {
      if (r.data.length > 0) {
        setAvailableGenres(['Все', ...r.data]);
      }
    }).catch(() => {});
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchBooks(nextPage, true);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [page, hasMore, isLoading]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search & Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Каталог</h1>
          <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx("p-2 rounded-md transition-colors", viewMode === 'grid' ? "bg-primary text-accent shadow-sm" : "text-secondary")}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx("p-2 rounded-md transition-colors", viewMode === 'list' ? "bg-primary text-accent shadow-sm" : "text-secondary")}
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              placeholder="Поиск по названию, автору или жанру..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              "flex items-center gap-2 px-6 py-3 border rounded-xl font-medium transition-all",
              showFilters ? "bg-accent text-white border-accent" : "bg-primary border-base text-primary hover:bg-secondary"
            )}
          >
            <Filter className="w-5 h-5" />
            Фильтры
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-6 bg-secondary rounded-2xl border border-base grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase text-secondary">Жанры</label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map(genre => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={clsx(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          selectedGenre === genre ? "bg-accent text-white" : "bg-primary border border-base text-secondary hover:border-accent"
                        )}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase text-secondary">Сортировка</label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 bg-primary border border-base rounded-xl text-sm outline-none"
                    >
                      <option value="popular">По популярности</option>
                      <option value="new">По новизне</option>
                      <option value="rating">По рейтингу</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid */}
      <div className={clsx("grid gap-8 mb-12", viewMode === 'grid' ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1")}>
        {books.map((book) => (
          viewMode === 'grid' ? (
            <BookCard key={book.id} book={book} />
          ) : (
            <motion.div layout key={book.id} className="flex gap-6 p-4 rounded-2xl border border-base hover:shadow-lg transition-all">
              <div className="w-32 shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 py-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1">{book.title}</h3>
                  <p className="text-secondary text-sm mb-2">{book.author}</p>
                  <p className="text-sm line-clamp-2 opacity-70 mb-4">{book.description}</p>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {(book.genre || '').split(',').map(g => g.trim()).filter(Boolean).map(label => (
                      <span key={label} className="px-2 py-1 bg-accent/5 text-accent text-[10px] font-bold rounded uppercase border border-accent/10">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium">Читать</button>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </div>

      {/* Loader for infinite scroll */}
      <div ref={observerTarget} className="flex justify-center py-8">
        {isLoading && (
          <div className="flex items-center gap-2 text-accent font-medium">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Загрузка новых книг...</span>
          </div>
        )}
      </div>
    </div>
  );
};
