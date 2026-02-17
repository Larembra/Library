import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Users, MessageSquare, BarChart3, Plus, Search, Edit2, Trash2, Shield, Settings, Check, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

type AdminTab = 'stats' | 'library' | 'users' | 'settings';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <p className="text-secondary text-sm">Управление проектом БиблиоТэка</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 transition-transform active:scale-95">
            <Plus className="w-5 h-5" /> Добавить книгу
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-secondary rounded-2xl mb-8 w-fit">
        {[
          { id: 'stats', label: 'Статистик��', icon: <BarChart3 className="w-4 h-4" /> },
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
            
            <div className="p-8 bg-secondary border border-base rounded-3xl h-64 flex items-center justify-center">
              <p className="text-secondary">Графики активности будут здесь...</p>
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
                          <button className="p-2 hover:bg-secondary rounded-lg text-secondary hover:text-accent"><Edit2 className="w-4 h-4" /></button>
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
      </AnimatePresence>
    </div>
  );
};
