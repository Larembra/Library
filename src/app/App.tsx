import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';

// Ленивая загрузка страниц для оптимизации
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Catalog = lazy(() => import('./pages/Catalog').then(module => ({ default: module.Catalog })));
const BookDetails = lazy(() => import('./pages/BookDetails').then(module => ({ default: module.BookDetails })));
const Reader = lazy(() => import('./pages/Reader').then(module => ({ default: module.Reader })));
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));
const Forum = lazy(() => import('./pages/Forum').then(module => ({ default: module.Forum })));
const ForumTopic = lazy(() => import('./pages/ForumTopic').then(module => ({ default: module.ForumTopic })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const UserProfile = lazy(() => import('./pages/UserProfile').then(module => ({ default: module.UserProfile })));
const Auth = lazy(() => import('./pages/Auth').then(module => ({ default: module.Auth })));
const Privacy = lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));

// Компонент загрузки
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-primary">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-secondary">Загрузка...</p>
    </div>
  </div>
);

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppShell: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-primary text-primary transition-colors duration-300">
        <Header />
        <main className="flex-1 pb-20">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/reader" element={<Reader />} />
              <Route path="/forum" element={<Forum isAdmin={true} />} />
              <Route path="/forum/topic/:id" element={<ForumTopic />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user/:id" element={<UserProfile />} />
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <Admin />
                  </RequireAuth>
                }
              />
              <Route path="/about" element={<div className="container mx-auto p-12 text-center"><h1 className="text-4xl font-bold mb-4">О проекте БиблиоТэка</h1><p className="text-secondary">Мы — локальный учебный проект, созданный с любовью к чтению.</p></div>} />
              <Route path="/faq" element={<div className="container mx-auto p-12 text-center"><h1 className="text-4xl font-bold mb-4">Помощь</h1><p className="text-secondary">Здесь будут ответы на часто задаваемые вопросы.</p></div>} />
              <Route path="/policy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </Suspense>
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
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;