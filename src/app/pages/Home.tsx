import React from 'react';
import { BookCard } from '../components/BookCard';
import { MOCK_BOOKS } from '../data/mock';
import { ArrowRight, Sparkles, TrendingUp, Clock, Bookmark, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Section: React.FC<{ title: string; icon: React.ReactNode; books: typeof MOCK_BOOKS }> = ({ title, icon, books }) => (
  <section className="py-8">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2 text-xl font-bold">
        <span className="text-accent">{icon}</span>
        <h2>{title}</h2>
      </div>
      <button className="text-sm font-medium text-accent hover:underline flex items-center gap-1 group">
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

export const Home: React.FC = () => {
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
      <section className="pb-12 border-b border-base">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-accent/5 border border-accent/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="flex-1 space-y-4">
            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase rounded-full">Продолжить чтение</span>
            <h2 className="text-3xl font-bold leading-tight">Тайны древнего кода</h2>
            <p className="text-secondary max-w-lg">
              Вы остановились на 14-й главе. Мир киберпанка ждет вашего возвращения...
            </p>
            <div className="flex items-center gap-4">
              <Link to="/reader" className="px-6 py-3 bg-accent text-white rounded-xl font-medium shadow-lg hover:shadow-accent/20 transition-all">
                Читать дальше
              </Link>
              <div className="flex flex-col">
                <span className="text-xs text-secondary font-medium">Прогресс</span>
                <div className="w-32 h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-accent w-[65%]" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-40 aspect-[2/3] shrink-0">
            <img
              src={MOCK_BOOKS[0].cover}
              alt="Current book"
              className="w-full h-full object-cover rounded-xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </motion.div>
      </section>

      <Section title="Популярные книги" icon={<TrendingUp className="w-6 h-6" />} books={MOCK_BOOKS} />
      <Section title="Новинки" icon={<Sparkles className="w-6 h-6" />} books={MOCK_BOOKS.slice(0, 3)} />
      <Section title="Рекомендовано вам" icon={<Bookmark className="w-6 h-6" />} books={MOCK_BOOKS.slice(2, 5)} />
    </div>
  );
};
