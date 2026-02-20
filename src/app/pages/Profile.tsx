import React, { useState } from 'react';
import { Mail, Shield, BookOpen, MessageSquare, History, Heart, Edit2, Camera, Key, X, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { MOCK_BOOKS } from '../data/mock';
import { BookCard } from '../components/BookCard';

export const Profile: React.FC = () => {
  type TabId = 'books' | 'reviews' | 'history' | 'activity' | 'settings';
  const [activeTab, setActiveTab] = useState<TabId>('books');

  const [user, setUser] = useState({
    name: 'Александр Ридер',
    email: 'alex.reader@example.com',
    bio: 'Люблю научную фантастику и киберпанк. Собираю коллекцию редких изданий. Всегда открыт для обсуждения интересных теорий на форуме!',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&h=400&auto=format&fit=crop',
    stats: {
      readCount: 124,
      avgRating: 4.7,
      forumActivity: 856
    }
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email
  });
  const [bioText, setBioText] = useState(user.bio);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUser(prev => ({ ...prev, avatar: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUser(prev => ({ ...prev, banner: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: editForm.name,
      email: editForm.email
    }));
    setIsEditingProfile(false);
  };

  const saveBio = () => {
    setUser(prev => ({ ...prev, bio: bioText }));
    setIsEditingBio(false);
  };

  const cancelEdit = () => {
    setEditForm({
      name: user.name,
      email: user.email
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="relative mb-8">
        <div className="h-48 md:h-64 rounded-3xl overflow-hidden border border-base relative group">
          <img src={user.banner} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
          <input
            type="file"
            id="bannerInput"
            accept="image/*"
            onChange={handleBannerChange}
            className="hidden"
          />
          <label
            htmlFor="bannerInput"
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white/30"
          >
            <Camera className="w-5 h-5" />
          </label>
        </div>
        
        <div className="flex flex-col md:flex-row items-end gap-6 px-8 -mt-12 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-primary bg-primary overflow-hidden shadow-xl">
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <label
              htmlFor="avatarInput"
              className="absolute bottom-2 right-2 p-2 bg-accent text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-accent/90"
            >
              <Edit2 className="w-4 h-4" />
            </label>
          </div>
          <div className="flex-1 pb-2">
            {!isEditingProfile ? (
              <>
                <h1 className="text-3xl font-black mb-1">{user.name}</h1>
                <p className="text-secondary text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {user.email}
                </p>
              </>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="text-2xl font-black bg-secondary border border-base rounded-xl px-3 py-1 outline-none focus:ring-2 focus:ring-accent w-full"
                  placeholder="Имя"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="text-sm bg-secondary border border-base rounded-xl px-3 py-1 outline-none focus:ring-2 focus:ring-accent w-full"
                  placeholder="Email"
                />
              </div>
            )}
          </div>
          <div className="flex gap-3 pb-2">
            {!isEditingProfile ? (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-6 py-2.5 bg-accent text-white rounded-xl font-bold text-sm shadow-lg shadow-accent/20 hover:bg-accent/90 transition-colors"
              >
                Редактировать
              </button>
            ) : (
              <>
                <button
                  onClick={saveProfile}
                  className="px-4 py-2.5 bg-accent text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Сохранить
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2.5 bg-secondary rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Отмена
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="p-6 bg-secondary rounded-2xl border border-base">
            <h3 className="font-bold mb-4">Статистика</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Прочитано
                </span>
                <span className="font-bold">{user.stats.readCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Средняя оценка
                </span>
                <span className="font-bold text-accent">{user.stats.avgRating}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Активность
                </span>
                <span className="font-bold">{user.stats.forumActivity}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-secondary rounded-2xl border border-base">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">О себе</h3>
              {!isEditingBio && (
                <button
                  onClick={() => {
                    setIsEditingBio(true);
                    setBioText(user.bio);
                  }}
                  className="p-1 hover:bg-primary rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-accent" />
                </button>
              )}
            </div>
            {!isEditingBio ? (
              <p className="text-sm text-secondary leading-relaxed mb-4">{user.bio}</p>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full p-3 bg-primary border border-base rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm h-32"
                  placeholder="Расскажите о себе..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveBio}
                    className="flex-1 py-2 bg-accent text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setBioText(user.bio);
                      setIsEditingBio(false);
                    }}
                    className="flex-1 py-2 bg-primary border border-base rounded-lg font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <X className="w-3 h-3" /> Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex border-b border-base gap-8 overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'books', label: 'Избранное', icon: <Heart className="w-4 h-4" /> },
                { id: 'reviews', label: 'Мои отзывы', icon: <MessageSquare className="w-4 h-4" /> },
                { id: 'history', label: 'История', icon: <History className="w-4 h-4" /> },
                { id: 'settings', label: 'Безопасность', icon: <Shield className="w-4 h-4" /> }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 pb-4 text-sm font-bold transition-all relative whitespace-nowrap",
                  activeTab === tab.id ? "text-primary" : "text-secondary hover:text-primary"
                )}
              >
                {tab.icon} {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'books' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {MOCK_BOOKS.map(book => <BookCard key={book.id} book={book} />)}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {[
                  { title: 'Тайны древнего кода', rating: 5, text: 'Потрясающая книга! Сюжет держит в напряжении до самого конца. Очень понравилась проработка мира.', date: '10 фев 2026' },
                  { title: 'Путь к звездам', rating: 4, text: 'Интересная научная фантастика, но местами слишком много технических подробностей.', date: '1 фев 2026' },
                ].map((review, i) => (
                  <div key={i} className="p-6 bg-secondary/50 rounded-2xl border border-base">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold">{review.title}</h4>
                        <div className="flex text-amber-500 mt-1">
                          {[...Array(5)].map((_, j) => (
                            <span key={j} className={j < review.rating ? "fill-current" : "opacity-20"}>★</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-secondary">{review.date}</span>
                    </div>
                    <p className="text-secondary text-sm leading-relaxed">{review.text}</p>
                    <div className="flex gap-4 mt-4">
                      <button className="text-[10px] font-bold uppercase text-accent hover:underline">Изменить</button>
                      <button className="text-[10px] font-bold uppercase text-rose-500 hover:underline">Удалить</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {MOCK_BOOKS.slice(0, 3).map(book => (
                  <div key={book.id} className="p-4 bg-secondary/50 rounded-2xl border border-base flex items-center gap-4">
                    <img src={book.cover} className="w-12 h-16 object-cover rounded-lg" alt="" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{book.title}</h4>
                      <div className="w-full h-1 bg-primary rounded-full mt-2">
                        <div className="h-full bg-accent w-2/3 rounded-full" />
                      </div>
                    </div>
                    <span className="text-xs text-secondary font-medium whitespace-nowrap">2 дня назад</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-md space-y-6">
                <div className="p-6 bg-secondary/50 rounded-2xl border border-base space-y-4">
                  <h4 className="font-bold flex items-center gap-2"><Key className="w-4 h-4" /> Смена пароля</h4>
                  <div className="space-y-2">
                    <input type="password" placeholder="Текущий пароль" className="w-full px-4 py-2.5 bg-primary border border-base rounded-xl text-sm" />
                    <input type="password" placeholder="Новый пароль" className="w-full px-4 py-2.5 bg-primary border border-base rounded-xl text-sm" />
                    <button className="w-full py-2.5 bg-primary border border-base rounded-xl font-bold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all">Обновить пароль</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};