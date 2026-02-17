import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { BookDetails } from './pages/BookDetails';
import { Reader } from './pages/Reader';
import { Admin } from './pages/Admin';
import { Forum } from './pages/Forum';
import { ForumTopic } from './pages/ForumTopic';
import { Profile } from './pages/Profile';
import { Auth } from './pages/Auth';
import { MessageSquare, Plus, Filter, Search, Pin, Lock, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-primary text-primary transition-colors duration-300">
          <Header />
          <main className="flex-1 pb-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/reader" element={<Reader />} />
              <Route path="/forum" element={<Forum isAdmin={true} />} />
              <Route path="/forum/topic/:id" element={<ForumTopic />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/about" element={<div className="container mx-auto p-12 text-center"><h1 className="text-4xl font-bold mb-4">О проекте БиблиоТэка</h1><p className="text-secondary">Мы — локальный учебный проект, созданный с любовью к чтению.</p></div>} />
              <Route path="/faq" element={<div className="container mx-auto p-12 text-center"><h1 className="text-4xl font-bold mb-4">Помощь</h1><p className="text-secondary">Здесь будут ответы на часто задаваемые вопросы.</p></div>} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
          
          <footer className="border-t border-base py-8 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-secondary">
                <p>© 2026 БиблиоТэка. Все права защищены.</p>
                <div className="flex flex-wrap justify-center gap-6">
                  <Link to="/policy" className="hover:text-accent">Политика конфиденциальности</Link>
                  <Link to="/terms" className="hover:text-accent">Условия использования</Link>
                  <Link to="/faq" className="hover:text-accent">Помощь</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
