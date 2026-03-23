import React, { useState, useEffect } from 'react';
import { BarChart3, BookOpen, Users, Settings, Plus, Trash2, Edit3, Lock, Unlock, Search, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';
import { adminApi, type StatsResponse } from '../api/adminApi';
import { booksApi, type Book, type BookCreateData } from '../api/booksApi';
import type { UserProfile } from '../api/authApi';

export const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  // Book modal state
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookForm, setBookForm] = useState<BookCreateData>({ title: '', author: '', description: '', cover: '', genre: '', year: 2024, is_free: false, tags: [] });

  // User create modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  const [searchBooks, setSearchBooks] = useState('');
  const [searchUsers, setSearchUsers] = useState('');

  useEffect(() => {
    adminApi.getStats().then(r => setStats(r.data)).catch(() => {});
    booksApi.getBooks({ per_page: 100 }).then(r => setBooks(r.data.books)).catch(() => {});
    adminApi.getUsers().then(r => setUsers(r.data)).catch(() => {});
  }, []);

  const handleDeleteBook = async (bookId: number) => {
    try {
      await booksApi.deleteBook(bookId);
      setBooks(prev => prev.filter(b => b.id !== bookId));
    } catch {}
  };

  const handleSaveBook = async () => {
    try {
      if (editingBook) {
        const resp = await booksApi.updateBook(editingBook.id, bookForm);
        setBooks(prev => prev.map(b => b.id === editingBook.id ? resp.data : b));
      } else {
        const resp = await booksApi.createBook(bookForm);
        setBooks(prev => [resp.data, ...prev]);
      }
      setShowBookModal(false);
      setEditingBook(null);
      setBookForm({ title: '', author: '', description: '', cover: '', genre: '', year: 2024, is_free: false, tags: [] });
    } catch {}
  };

  const handleOpenEditBook = (book: Book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description,
      cover: book.cover,
      genre: book.genre,
      year: book.year,
      is_free: book.is_free,
      tags: book.tags,
    });
    setShowBookModal(true);
  };

  const handleBlockUser = async (userId: number) => {
    try {
      await adminApi.blockUser(userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: false } : u));
    } catch {}
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      await adminApi.unblockUser(userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: true } : u));
    } catch {}
  };

  const handleCreateUser = async () => {
    try {
      const resp = await adminApi.createUser({ username: newUserName, email: newUserEmail, password: newUserPassword });
      setUsers(prev => [resp.data, ...prev]);
      setShowUserModal(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
    } catch {}
  };

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchBooks.toLowerCase()) ||
    b.author.toLowerCase().includes(searchBooks.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const tabs = [
    { key: 'stats', label: 'Статистика', icon: BarChart3 },
    { key: 'library', label: 'Библиотека', icon: BookOpen },
    { key: 'users', label: 'Пользователи', icon: Users },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 shrink-0 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all",
                activeTab === tab.key ? "bg-accent text-white shadow-lg shadow-accent/20" : "hover:bg-secondary"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Stats Tab */}
          {activeTab === 'stats' && stats && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Книги', value: stats.total_books, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { label: 'Пользователи', value: stats.total_users, color: 'text-green-500', bg: 'bg-green-500/10' },
                  { label: 'Отзывы и комменты', value: stats.total_comments, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                  { label: 'Книг читается', value: stats.total_readings, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map(stat => (
                  <div key={stat.label} className="bg-primary border border-base rounded-2xl p-6">
                    <p className={clsx("text-4xl font-black", stat.color)}>{stat.value}</p>
                    <p className="text-xs font-bold text-secondary uppercase mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Library Tab */}
          {activeTab === 'library' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input type="text" value={searchBooks} onChange={(e) => setSearchBooks(e.target.value)} placeholder="Поиск книг..." className="w-full pl-12 pr-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none" />
                </div>
                <button onClick={() => { setEditingBook(null); setBookForm({ title: '', author: '', description: '', cover: '', genre: '', year: 2024, is_free: false, tags: [] }); setShowBookModal(true); }} className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-bold shadow-lg">
                  <Plus className="w-5 h-5" /> Добавить книгу
                </button>
              </div>
              <div className="space-y-3">
                {filteredBooks.map(book => (
                  <div key={book.id} className="flex items-center justify-between p-4 bg-primary border border-base rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                        <img src={book.cover} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold">{book.title}</p>
                        <p className="text-sm text-secondary">{book.author} • {book.genre} • {book.year}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEditBook(book)} className="p-2 rounded-lg hover:bg-secondary text-accent"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteBook(book.id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input type="text" value={searchUsers} onChange={(e) => setSearchUsers(e.target.value)} placeholder="Поиск пользователей..." className="w-full pl-12 pr-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none" />
                </div>
                <button onClick={() => setShowUserModal(true)} className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-bold shadow-lg">
                  <Plus className="w-5 h-5" /> Создать пользователя
                </button>
              </div>
              <div className="space-y-3">
                {filteredUsers.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-4 bg-primary border border-base rounded-2xl">
                    <div className="flex items-center gap-4">
                      <img src={u.avatar || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-sm">{u.username} {u.role === 'admin' && <span className="text-accent text-xs">(admin)</span>}</p>
                        <p className="text-xs text-secondary">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={clsx("text-xs font-bold px-2 py-1 rounded", u.is_active ? "bg-green-500/10 text-green-500" : "bg-rose-500/10 text-rose-500")}>
                        {u.is_active ? 'Активен' : 'Заблокирован'}
                      </span>
                      {u.role !== 'admin' && (
                        u.is_active ? (
                          <button onClick={() => handleBlockUser(u.id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500" title="Заблокировать"><Lock className="w-4 h-4" /></button>
                        ) : (
                          <button onClick={() => handleUnblockUser(u.id)} className="p-2 rounded-lg hover:bg-green-500/10 text-green-500" title="Разблокировать"><Unlock className="w-4 h-4" /></button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Book Modal */}
      <AnimatePresence>
        {showBookModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBookModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-primary rounded-3xl p-8 shadow-2xl border border-base max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowBookModal(false)} className="absolute top-6 right-6 text-secondary hover:text-primary"><X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-black mb-6">{editingBook ? 'Редактировать книгу' : 'Добавить книгу'}</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Название" value={bookForm.title} onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none" />
                <input type="text" placeholder="Автор" value={bookForm.author} onChange={(e) => setBookForm(prev => ({ ...prev, author: e.target.value }))} className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none" />
                <textarea placeholder="Описание" value={bookForm.description} onChange={(e) => setBookForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none h-24" />
                <input type="text" placeholder="Ссылка на обложку" value={bookForm.cover} onChange={(e) => setBookForm(prev => ({ ...prev, cover: e.target.value }))} className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Жанр" value={bookForm.genre} onChange={(e) => setBookForm(prev => ({ ...prev, genre: e.target.value }))} className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none" />
                  <input type="number" placeholder="Год" value={bookForm.year} onChange={(e) => setBookForm(prev => ({ ...prev, year: parseInt(e.target.value) || 2024 }))} className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none" />
                </div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={bookForm.is_free} onChange={(e) => setBookForm(prev => ({ ...prev, is_free: e.target.checked }))} className="w-4 h-4 accent-accent" />
                  <span className="text-sm font-medium">Бесплатная книга</span>
                </label>
                <button onClick={handleSaveBook} className="w-full py-3 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> {editingBook ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Create Modal */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUserModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md bg-primary rounded-3xl p-8 shadow-2xl border border-base">
              <button onClick={() => setShowUserModal(false)} className="absolute top-6 right-6 text-secondary hover:text-primary"><X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-black mb-6">Новый пользователь</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Имя" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none" />
                <input type="email" placeholder="Email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none" />
                <input type="password" placeholder="Пароль" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} className="w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none" />
                <button onClick={handleCreateUser} className="w-full py-3 bg-accent text-white rounded-xl font-bold">Создать</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
