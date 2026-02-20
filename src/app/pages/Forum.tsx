import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pin, Lock, MessageCircle, Loader2, X, Send, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

export const Forum: React.FC<{ isAdmin?: boolean }> = ({ isAdmin = true }) => {
  const [topics, setTopics] = useState([...Array(6)].map((_, i) => ({
    id: i,
    title: i === 0 ? "Обсуждение концовки «Тайны древнего кода»" : `Тема форума #${i + 1}`,
    pinned: i === 0,
    locked: i === 2,
    replies: 42 + i,
    lastActivity: '2 часа назад'
  })));
  const [isLoading, setIsLoading] = useState(false);
  const [showNewTopic, setShowNewTopic] = useState(false);
  const observerTarget = useRef(null);
  const { isLoggedIn } = useAuth();

  const loadMoreTopics = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      const newTopics = [...Array(5)].map((_, i) => ({
        id: topics.length + i,
        title: `Еще одна интересная тема #${topics.length + i + 1}`,
        pinned: false,
        locked: false,
        replies: Math.floor(Math.random() * 100),
        lastActivity: 'Недавно'
      }));
      setTopics(prev => [...prev, ...newTopics]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMoreTopics();
      },
      { threshold: 1.0 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [isLoading]);

  const togglePin = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setTopics(prev => prev.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
  };

  const deleteTopic = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Форум БиблиоТэка</h1>
          <p className="text-secondary">Обсуждайте книги и находите единомышленников</p>
        </div>
        {isLoggedIn && (
          <button 
            onClick={() => setShowNewTopic(true)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5" /> Новая тема
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          {topics.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map((topic) => (
            <Link 
              key={topic.id}
              to={`/forum/topic/${topic.id}`}
              className="block p-6 bg-primary border border-base rounded-2xl hover:border-accent transition-all group relative"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex flex-wrap gap-2 pr-20">
                  {topic.pinned && <span className="p-1 bg-amber-500/10 text-amber-500 rounded"><Pin className="w-4 h-4" /></span>}
                  {topic.locked && <span className="p-1 bg-secondary text-secondary rounded"><Lock className="w-4 h-4" /></span>}
                  <h3 className="text-lg font-bold group-hover:text-accent transition-colors">{topic.title}</h3>
                </div>
                
                {isAdmin && isLoggedIn && (
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => togglePin(topic.id, e)}
                      className={clsx(
                        "p-2 rounded-lg border border-base bg-primary hover:bg-amber-500/10",
                        topic.pinned ? "text-amber-500 border-amber-500/30" : "text-secondary hover:text-amber-500"
                      )}
                      title={topic.pinned ? "Открепить" : "Закрепить"}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => deleteTopic(topic.id, e)}
                      className="p-2 rounded-lg border border-base bg-primary hover:bg-rose-500/10 text-secondary hover:text-rose-500"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-secondary">
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" /> {topic.replies} ответов
                  </div>
                  <div>Активность: {topic.lastActivity}</div>
                </div>
                <span className="px-2 py-1 bg-secondary text-[10px] font-bold rounded uppercase">Обсуждение</span>
              </div>
            </Link>
          ))}
          
          <div ref={observerTarget} className="flex justify-center py-8">
            {isLoading && <Loader2 className="w-6 h-6 animate-spin text-accent" />}
          </div>
        </div>
        
        <aside className="space-y-6">
          <div className="p-6 bg-secondary rounded-2xl border border-base sticky top-24">
            <h4 className="font-bold mb-4">Поиск по темам</h4>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input className="w-full pl-10 pr-4 py-2 bg-primary border border-base rounded-lg text-sm" placeholder="Найти..." />
            </div>
            <h4 className="font-bold mb-4">Популярные теги</h4>
            <div className="flex flex-wrap gap-2">
              {['Теории', 'Спойлеры', 'Поиск книг', 'Конкурсы', 'Оффтоп'].map(t => (
                <button key={t} className="px-3 py-1.5 bg-primary border border-base rounded-lg text-xs hover:border-accent transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* New Topic Modal */}
      <AnimatePresence>
        {showNewTopic && isLoggedIn && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowNewTopic(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-primary rounded-3xl p-8 shadow-2xl border border-base"
            >
              <button onClick={() => setShowNewTopic(false)} className="absolute top-6 right-6 text-secondary hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-black mb-6">Создать новую тему</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-secondary mb-2 block">Заголовок темы</label>
                  <input 
                    type="text" 
                    placeholder="О чем вы хотите поговорить?" 
                    className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-secondary mb-2 block">Сообщение</label>
                  <textarea 
                    placeholder="Опишите вашу идею подробнее..." 
                    className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all min-h-[150px]"
                  />
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setShowNewTopic(false)}
                    className="w-full py-4 bg-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:opacity-90 transition-all"
                  >
                    <Send className="w-5 h-5" /> Опубликовать тему
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};