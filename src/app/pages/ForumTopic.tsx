import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, ThumbsDown, Trash2, Pin, Lock, User, Send } from 'lucide-react';
import { motion } from 'motion/react';

export const ForumTopic: React.FC = () => {
  const { id } = useParams();

  const posts = [
    {
      id: 1,
      author: 'Константин В.',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&auto=format&fit=crop',
      content: 'Кто что думает о финальном твисте в Тайны древнего кода? Мне кажется, автор оставил слишком много вопросов для сиквела, или я что-то упустил в 12 главе?',
      date: 'Сегодня, 14:20',
      likes: 24,
      role: 'Участник',
      isAdmin: false
    },
    {
      id: 2,
      author: 'Мария П.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop',
      content: 'Я согласна, финал открытый. Но если перечитать момент с письмом в начале книги, то многие детали становятся понятнее. Это классический прием "ненадежного рассказчика".',
      date: 'Сегодня, 15:45',
      likes: 12,
      role: 'Модератор',
      isAdmin: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/forum" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-accent mb-6 transition-colors group">
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Назад к списку тем
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex gap-2 mb-2">
            <span className="p-1 bg-amber-500/10 text-amber-500 rounded text-xs flex items-center gap-1 font-bold">
              <Pin className="w-3 h-3" /> Закреплено
            </span>
            <span className="px-2 py-1 bg-secondary text-secondary rounded text-[10px] font-bold uppercase tracking-wider">
              Теории
            </span>
          </div>
          <h1 className="text-3xl font-black">Обсуждение концовки «Тайны древнего кода» (спойлеры!)</h1>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl hover:text-amber-500 transition-colors text-sm font-bold border border-base" title="Закрепить/Открепить">
            <Pin className="w-4 h-4" /> Закрепить
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl hover:text-rose-500 transition-colors text-sm font-bold border border-base" title="Удалить тему">
            <Trash2 className="w-4 h-4" /> Удалить
          </button>
        </div>
      </div>

      <div className="space-y-6 mb-12">
        {posts.map((post) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={post.id}
            className="flex flex-col md:flex-row gap-6 p-6 bg-primary border border-base rounded-3xl"
          >
            <div className="md:w-32 shrink-0 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-base">
                <img src={post.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm truncate w-24">{post.author}</p>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${post.isAdmin ? 'bg-accent/10 text-accent' : 'bg-secondary text-secondary'}`}>
                  {post.role}
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-secondary mb-3">{post.date}</p>
                <div className="text-lg leading-relaxed text-secondary-foreground">
                  {post.content}
                </div>
              </div>
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-base">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-accent transition-colors">
                    <ThumbsUp className="w-4 h-4" /> {post.likes}
                  </button>
                  <button className="text-sm font-medium text-secondary hover:text-rose-500 transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button className="text-sm font-bold text-accent ml-2">Ответить</button>
                </div>
                {post.isAdmin && (
                  <button className="p-2 text-secondary hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reply Section */}
      <div className="p-8 bg-secondary rounded-3xl border border-base">
        <h3 className="font-bold mb-4">Ваш ответ</h3>
        <div className="relative">
          <textarea
            placeholder="Напишите, что вы думаете..."
            className="w-full p-4 bg-primary border border-base rounded-2xl outline-none focus:ring-2 focus:ring-accent min-h-[150px] transition-all"
          />
          <button className="absolute bottom-4 right-4 px-6 py-2 bg-accent text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-accent/20">
            <Send className="w-4 h-4" /> Отправить
          </button>
        </div>
      </div>
    </div>
  );
};
