import React, { useState, useEffect } from 'react';
import { BookCard } from '../components/BookCard';
import { ArrowRight, Sparkles, TrendingUp, Clock, Bookmark, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksApi, type Book } from '../api/booksApi';
import { usersApi, type ReadingHistoryItem } from '../api/usersApi';

const Section: React.FC<{ title: string; icon: React.ReactNode; books: Book[] }> = ({ title, icon, books }) => {
  const navigate = useNavigate();

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-accent">{icon}</span>
          <h2>{title}</h2>
        </div>
        <button
          onClick={() => navigate('/catalog')}
          className="text-sm font-medium text-accent hover:underline flex items-center gap-1 group"
        >
          Все <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
};

export const Home: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [lastRead, setLastRead] = useState<ReadingHistoryItem | null>(null);
  const [lastReadBook, setLastReadBook] = useState<Book | null>(null);

  useEffect(() => {
    booksApi.getBooks({ per_page: 10, sort: 'popular' }).then(r => setBooks(r.data?.books || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      usersApi.getReadingHistory().then(r => {
        if (r.data.length > 0) {
          setLastRead(r.data[0]);
          booksApi.getBook(r.data[0].book_id).then(br => setLastReadBook(br.data)).catch(() => {});
        }
      }).catch(() => {});
    }
  }, [isLoggedIn]);

  return (
    <div className="container mx-auto px-4">
      {/* Brand Hero */}
      <section className="py-16 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            Библио<span className="text-accent">Тэка</span>
          </h1>
          <p className="text-lg text-secondary mb-8">
            Современное пространство для любителей чтения. Мы создали платформу, где книги оживают, 
            а сообщество находит ответы на любые вопросы. Чистый интерфейс, отсутствие рекламы 
            и комфорт в каждой детали.
          </p>
          <Link 
            to="/about"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary border border-base rounded-2xl font-bold hover:bg-secondary transition-all group"
          >
            <Info className="w-5 h-5 text-accent" />
            Подробнее о нас
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>
      </section>

      {/* Continue Reading */}
      {isLoggedIn && lastRead && lastReadBook && (
        <section className="pb-12 border-b border-base">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-accent/5 border border-accent/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1 space-y-4">
              <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase rounded-full">Продолжить чтение</span>
              <h2 className="text-3xl font-bold leading-tight">{lastReadBook.title}</h2>
              <p className="text-secondary max-w-lg">
                Вы остановились здесь в прошлый раз. Продолжайте чтение с того же места.
              </p>
              <div className="flex items-center gap-4">
                <Link to={`/reader?bookId=${lastReadBook.id}`} className="px-6 py-3 bg-accent text-white rounded-xl font-medium shadow-lg hover:shadow-accent/20 transition-all">
                  Читать дальше
                </Link>
                <div className="flex flex-col">
                  <span className="text-xs text-secondary font-medium">Прогресс</span>
                  <div className="w-32 h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${lastRead.progress_percent}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-40 aspect-[2/3] shrink-0">
              <img
                src={lastReadBook.cover}
                alt={lastReadBook.title}
                className="w-full h-full object-cover rounded-xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </section>
      )}

      <Section title="Популярные книги" icon={<TrendingUp className="w-6 h-6" />} books={books || []} />
      <Section title="Новинки" icon={<Sparkles className="w-6 h-6" />} books={(books || []).slice(0, 3)} />
      <Section title="Рекомендовано вам" icon={<Bookmark className="w-6 h-6" />} books={(books || []).slice(2, 5)} />
    </div>
  );
};