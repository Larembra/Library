import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_BOOKS } from '../data/mock';
import { Rating } from '../components/Rating';
import { Header } from '../components/Header';
import { Heart, Share2, BookOpen, MessageSquare, Star, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const BookDetails: React.FC = () => {
  const { id } = useParams();
  const book = MOCK_BOOKS.find(b => b.id === id) || MOCK_BOOKS[0];
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'comments'>('desc');

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Book Cover & Main Actions */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-base">
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/reader" className="w-full py-4 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
                <BookOpen className="w-5 h-5" /> Читать книгу
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 border border-base rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-secondary transition-colors">
                  <Heart className="w-4 h-4" /> В избранное
                </button>
                <button className="py-3 border border-base rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-secondary transition-colors">
                  <Share2 className="w-4 h-4" /> Поделиться
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-secondary rounded-xl border border-base space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Год издания</span>
                <span className="font-medium">{book.year}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Жанр</span>
                <span className="font-medium text-accent">{book.genre}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Возрастное ограничение</span>
                <span className="font-medium">16+</span>
              </div>
            </div>
          </div>

          {/* Right: Book Info & Interactive Blocks */}
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="text-4xl font-black mb-2">{book.title}</h1>
              <p className="text-xl text-secondary font-medium mb-6">{book.author}</p>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold">{book.rating}</div>
                  <div className="flex flex-col">
                    <Rating rating={book.rating} size={16} />
                    <span className="text-xs text-secondary">{book.reviewsCount} отзывов</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-border-color" />
                <div className="flex gap-2">
                  {book.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-base flex gap-8">
              {(['desc', 'reviews', 'comments'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "pb-4 text-sm font-bold transition-all relative",
                    activeTab === tab ? "text-primary" : "text-secondary"
                  )}
                >
                  {tab === 'desc' ? 'О книге' : tab === 'reviews' ? `Отзывы (${book.reviewsCount})` : 'Комментарии'}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[300px]">
              {activeTab === 'desc' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <p className="text-lg leading-relaxed text-secondary">{book.description}</p>
                  <div className="p-6 bg-secondary/50 rounded-2xl border border-dashed border-base">
                    <h3 className="font-bold mb-3">Почему стоит прочитать?</h3>
                    <ul className="space-y-2 text-sm text-secondary list-disc pl-4">
                      <li>Уникальный авторский стиль и глубокая проработка персонажей.</li>
                      <li>Захватывающий сюжет с неожиданными поворотами.</li>
                      <li>Актуальные темы, которые заставляют задуматься.</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'comments' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="space-y-4">
                    <textarea 
                      placeholder="Поделитесь вашим мнением..."
                      className="w-full p-4 bg-secondary border border-base rounded-2xl outline-none focus:ring-2 focus:ring-accent h-32"
                    />
                    <button className="px-6 py-2 bg-accent text-white rounded-xl font-bold ml-auto block">Отправить</button>
                  </div>
                  
                  {/* Mock Comment */}
                  <div className="p-4 rounded-xl border border-base space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/20" />
                        <div>
                          <p className="text-sm font-bold">Константин В.</p>
                          <p className="text-[10px] text-secondary">2 часа назад</p>
                        </div>
                      </div>
                      <button className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm">Книга просто потрясающая! Не мог оторваться до самого утра. Особенно понравилась развязка в 14 главе.</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-xs text-secondary hover:text-accent">
                        <ThumbsUp className="w-3 h-3" /> 24
                      </button>
                      <button className="flex items-center gap-1 text-xs text-secondary hover:text-rose-500">
                        <ThumbsDown className="w-3 h-3" /> 2
                      </button>
                      <button className="text-xs font-bold text-accent ml-2">Ответить</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
