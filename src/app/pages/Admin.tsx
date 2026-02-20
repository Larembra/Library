import React, { useState } from 'react';
import { BookOpen, Users, MessageSquare, BarChart3, Plus, Search, Edit2, Trash2, Settings, Check, X, User, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { Checkbox } from '../components/Checkbox';

type AdminTab = 'stats' | 'library' | 'users' | 'settings';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');
  const [showAddBook, setShowAddBook] = useState(false);
  const [showEditBook, setShowEditBook] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <p className="text-secondary text-sm">Управление проектом БиблиоТэка</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddBook(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5" /> Добавить книгу
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-secondary rounded-2xl mb-8 w-fit">
        {[
          { id: 'stats', label: 'Статистика', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'library', label: 'Библиотека', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'users', label: 'Пользователи', icon: <Users className="w-4 h-4" /> },
          { id: 'settings', label: 'Настройки', icon: <Settings className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={clsx(
              "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id ? "bg-primary text-primary shadow-sm" : "text-secondary hover:text-primary"
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Всего книг', value: '1,248', icon: <BookOpen />, color: 'bg-blue-500' },
                { label: 'Пользователей', value: '5,672', icon: <Users />, color: 'bg-purple-500' },
                { label: 'Комментариев', value: '12.4k', icon: <MessageSquare />, color: 'bg-emerald-500' },
                { label: 'Прочтений книг', value: '45.2k', icon: <BarChart3 />, color: 'bg-amber-500' },
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-secondary border border-base rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-secondary uppercase mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* График активности пользователей */}
              <div className="p-6 bg-secondary border border-base rounded-2xl">
                <h3 className="font-bold mb-6">Активность пользователей</h3>
                <div className="space-y-3">
                  {[
                    { day: 'Пн', value: 65 },
                    { day: 'Вт', value: 80 },
                    { day: 'Ср', value: 45 },
                    { day: 'Чт', value: 90 },
                    { day: 'Пт', value: 75 },
                    { day: 'Сб', value: 95 },
                    { day: 'Вс', value: 85 }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-secondary w-6">{item.day}</span>
                      <div className="flex-1 h-8 bg-primary rounded-lg overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full bg-gradient-to-r from-accent to-purple-500 flex items-center justify-end px-2"
                        >
                          <span className="text-[10px] font-bold text-white">{item.value}%</span>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Популярные жанры */}
              <div className="p-6 bg-secondary border border-base rounded-2xl">
                <h3 className="font-bold mb-6">Популярные жанры</h3>
                <div className="space-y-4">
                  {[
                    { genre: 'Фантастика', count: 342, color: 'bg-blue-500' },
                    { genre: 'Детектив', count: 287, color: 'bg-purple-500' },
                    { genre: 'Роман', count: 198, color: 'bg-pink-500' },
                    { genre: 'Фэнтези', count: 156, color: 'bg-emerald-500' },
                    { genre: 'Триллер', count: 124, color: 'bg-amber-500' }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.genre}</span>
                        <span className="text-secondary">{item.count} книг</span>
                      </div>
                      <div className="h-2 bg-primary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.count / 342) * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={`h-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-secondary border border-base rounded-3xl">
              <h3 className="font-bold mb-6">Статистика прочтений за месяц</h3>
              <div className="flex items-end justify-between gap-2 h-48">
                {[32, 45, 38, 52, 48, 65, 58, 72, 68, 85, 78, 92, 88, 95, 90].map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="flex-1 bg-gradient-to-t from-accent to-purple-500 rounded-t-lg min-w-[20px] hover:opacity-80 transition-opacity cursor-pointer"
                    title={`День ${i + 1}: ${value}%`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-secondary">
                <span>1 фев</span>
                <span>15 фев</span>
                <span>28 фев</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'library' && (
          <motion.div
            key="library"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary border border-base rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-base flex flex-col md:flex-row items-center justify-between bg-secondary/30 gap-4">
              <h2 className="font-bold">Управление библиотекой</h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <input className="w-full pl-10 pr-4 py-2 bg-primary border border-base rounded-lg text-sm" placeholder="Поиск по книгам..." />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary text-secondary text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4">Название</th>
                    <th className="px-6 py-4">Автор</th>
                    <th className="px-6 py-4">Статус</th>
                    <th className="px-6 py-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base text-sm">
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 font-medium">Тайны древнего кода</td>
                      <td className="px-6 py-4 text-secondary">Алексей Иванов</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase">Активна</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingBook({ title: 'Тайны древнего кода', author: 'Алексей Иванов' });
                              setShowEditBook(true);
                            }}
                            className="p-2 hover:bg-secondary rounded-lg text-secondary hover:text-accent"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-secondary rounded-lg text-secondary hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary border border-base rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-base flex flex-col md:flex-row items-center justify-between bg-secondary/30 gap-4">
              <h2 className="font-bold">Список пользователей</h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <input className="w-full pl-10 pr-4 py-2 bg-primary border border-base rounded-lg text-sm" placeholder="Поиск..." />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary text-secondary text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4">Пользователь</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Роль</th>
                    <th className="px-6 py-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base text-sm">
                  {[
                    { name: 'Александр Ридер', email: 'alex@example.com', role: 'Админ' },
                    { name: 'Елена Книжная', email: 'elena@example.com', role: 'Читатель' },
                    { name: 'Иван Петров', email: 'ivan@example.com', role: 'Читатель' },
                  ].map((user, i) => (
                    <tr key={i} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-secondary">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "px-2 py-0.5 text-[10px] font-bold rounded uppercase",
                          user.role === 'Админ' ? "bg-accent/10 text-accent" : "bg-secondary text-secondary"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button className="p-2 hover:bg-secondary rounded-lg text-secondary hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Общие настройки */}
            <div className="bg-primary border border-base rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Общие настройки</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold mb-2 block">Название сайта</label>
                  <input
                    type="text"
                    defaultValue="БиблиоТэка"
                    className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block">Описание сайта</label>
                  <textarea
                    defaultValue="Современное пространство для любителей чтения"
                    className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold mb-2 block">Email для связи</label>
                    <input
                      type="email"
                      defaultValue="support@biblioteka.ru"
                      className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-2 block">Телефон</label>
                    <input
                      type="tel"
                      defaultValue="+7 (495) 123-45-67"
                      className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Настройки модерации */}
            <div className="bg-primary border border-base rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Модерация контента</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/70 transition-colors">
                  <div>
                    <p className="font-bold">Автоматическая модерация</p>
                    <p className="text-sm text-secondary">Проверка комментариев на нецензурную лексику</p>
                  </div>
                  <Checkbox defaultChecked />
                </label>

                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/70 transition-colors">
                  <div>
                    <p className="font-bold">Премодерация отзывов</p>
                    <p className="text-sm text-secondary">Отзывы публикуются после проверки администратором</p>
                  </div>
                  <Checkbox />
                </label>

                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/70 transition-colors">
                  <div>
                    <p className="font-bold">Уведомления о новых комментариях</p>
                    <p className="text-sm text-secondary">Отправлять email при новых комментариях</p>
                  </div>
                  <Checkbox defaultChecked />
                </label>
              </div>
            </div>

            {/* Настройки доступа */}
            <div className="bg-primary border border-base rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Настройки доступа</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/70 transition-colors">
                  <div>
                    <p className="font-bold">Регистрация открыта</p>
                    <p className="text-sm text-secondary">Разрешить регистрацию новых пользователей</p>
                  </div>
                  <Checkbox defaultChecked />
                </label>

                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/70 transition-colors">
                  <div>
                    <p className="font-bold">Комментарии для всех</p>
                    <p className="text-sm text-secondary">Незарегистрированные могут оставлять комментарии</p>
                  </div>
                  <Checkbox />
                </label>

                <div>
                  <label className="text-sm font-bold mb-2 block">Максимум книг в избранном</label>
                  <input
                    type="number"
                    defaultValue={100}
                    className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Настройки внешнего вида */}
            <div className="bg-primary border border-base rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Внешний вид</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold mb-2 block">Цветовая схема</label>
                  <select className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none">
                    <option>Светлая</option>
                    <option>Темная</option>
                    <option selected>Автоматическая (по системе)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block">Акцентный цвет</label>
                  <div className="flex gap-3">
                    {['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                      <button
                        key={color}
                        className="w-12 h-12 rounded-xl border-2 border-base hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block">Количество книг на странице</label>
                  <select className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none">
                    <option>10</option>
                    <option>20</option>
                    <option selected>30</option>
                    <option>50</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SEO настройки */}
            <div className="bg-primary border border-base rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">SEO и метатеги</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold mb-2 block">Meta Description</label>
                  <textarea
                    placeholder="Описание для поисковых систем"
                    className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block">Ключевые слова (через запятую)</label>
                  <input
                    type="text"
                    placeholder="библиотека, книги, чтение онлайн"
                    className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Резервное копирование */}
            <div className="bg-primary border border-base rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Резервное копирование</h2>
              <div className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">Последний бэкап</span>
                    <span className="text-sm text-secondary">19 февраля 2026, 23:00</span>
                  </div>
                  <div className="w-full h-2 bg-primary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full" />
                  </div>
                  <p className="text-xs text-secondary mt-2">Все данные сохранены успешно</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="px-6 py-3 bg-secondary rounded-xl font-bold hover:bg-secondary/70 transition-colors">
                    Создать бэкап сейчас
                  </button>
                  <button className="px-6 py-3 bg-secondary rounded-xl font-bold hover:bg-secondary/70 transition-colors">
                    Восстановить из бэкапа
                  </button>
                </div>
              </div>
            </div>

            {/* Кнопка сохранения */}
            <div className="flex justify-end gap-4">
              <button className="px-8 py-4 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:opacity-90 transition-all flex items-center gap-2">
                <Check className="w-5 h-5" /> Сохранить все настройки
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Book Modal */}
      <AnimatePresence>
        {showAddBook && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddBook(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-primary rounded-3xl p-8 shadow-2xl border border-base max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowAddBook(false)}
                className="absolute top-6 right-6 text-secondary hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-black mb-6">Добавить новую книгу</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-secondary mb-2 block">Название книги</label>
                    <input
                      type="text"
                      placeholder="Введите название"
                      className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-secondary mb-2 block">Автор</label>
                    <input
                      type="text"
                      placeholder="Имя автора"
                      className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-secondary mb-2 block">Жанр</label>
                    <select className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all">
                      <option>Фантастика</option>
                      <option>Детектив</option>
                      <option>Роман</option>
                      <option>Фэнтези</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-secondary mb-2 block">Год издания</label>
                    <input
                      type="number"
                      placeholder="2024"
                      className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-secondary mb-2 block">Рейтинг</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="4.5"
                      className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-secondary mb-2 block">Описание</label>
                  <textarea
                    placeholder="Краткое описание книги..."
                    className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all min-h-[120px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-secondary mb-2 block">Обложка книги</label>
                  <div className="border-2 border-dashed border-base rounded-xl p-8 text-center hover:border-accent transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-secondary" />
                    <p className="text-sm text-secondary">Нажмите или перетащите файл</p>
                    <p className="text-xs text-secondary mt-1">JPG, PNG до 5MB</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox />
                    <span className="text-sm font-medium">Бесплатная книга</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox />
                    <span className="text-sm font-medium">Опубликовать сразу</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddBook(false)}
                    className="flex-1 py-3 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Check className="w-5 h-5" /> Добавить книгу
                  </button>
                  <button
                    onClick={() => setShowAddBook(false)}
                    className="px-6 py-3 bg-secondary rounded-xl font-bold"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Book Modal */}
      <AnimatePresence>
        {showEditBook && editingBook && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditBook(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-primary rounded-3xl p-8 shadow-2xl border border-base max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowEditBook(false)}
                className="absolute top-6 right-6 text-secondary hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-black mb-6">Редактировать книгу</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-secondary mb-2 block">Название книги</label>
                    <input
                      type="text"
                      defaultValue={editingBook.title}
                      className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-secondary mb-2 block">Автор</label>
                    <input
                      type="text"
                      defaultValue={editingBook.author}
                      className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-secondary mb-2 block">Жанр</label>
                    <select className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all">
                      <option>Фантастика</option>
                      <option>Детектив</option>
                      <option>Роман</option>
                      <option>Фэнтези</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-secondary mb-2 block">Год издания</label>
                    <input
                      type="number"
                      defaultValue={2024}
                      className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-secondary mb-2 block">Рейтинг</label>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue={4.8}
                      className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-secondary mb-2 block">Описание</label>
                  <textarea
                    defaultValue="В мире, где информация стала ценнее золота, один хакер находит код, способный изменить реальность."
                    className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all min-h-[120px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-secondary mb-2 block">Обложка книги</label>
                  <div className="border-2 border-dashed border-base rounded-xl p-8 text-center hover:border-accent transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-secondary" />
                    <p className="text-sm text-secondary">Нажмите чтобы изменить обложку</p>
                    <p className="text-xs text-secondary mt-1">JPG, PNG до 5MB</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox defaultChecked />
                    <span className="text-sm font-medium">Бесплатная книга</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox defaultChecked />
                    <span className="text-sm font-medium">Активна</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowEditBook(false)}
                    className="flex-1 py-3 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Check className="w-5 h-5" /> Сохранить изменения
                  </button>
                  <button
                    onClick={() => setShowEditBook(false)}
                    className="px-6 py-3 bg-secondary rounded-xl font-bold"
                  >
                    Отмена
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
