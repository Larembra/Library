import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Palette, User, LogOut, Menu, X, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Header: React.FC<{ isAdmin?: boolean; isLoggedIn?: boolean }> = ({ isAdmin = true, isLoggedIn = true }) => {
  const { theme, toggleTheme, accent, setAccent, accentColors } = useTheme();
  const [showAccents, setShowAccents] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Главная', path: '/' },
    { label: 'Каталог', path: '/catalog' },
    { label: 'Форум', path: '/forum' },
    ...(isAdmin ? [{ label: 'Админка', path: '/admin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-base bg-primary">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 lg:gap-12">
          <Link to="/" className="text-xl font-black tracking-tight flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-xs shadow-lg shadow-accent/20">БТ</div>
            <span className="hidden sm:inline">Библио<span className="text-accent">Тэка</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-bold transition-all hover:text-accent",
                  location.pathname === item.path ? "text-accent" : "text-secondary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowAccents(!showAccents)}
              className="p-2 rounded-full hover:bg-secondary text-secondary transition-colors"
              title="Выбор акцента"
            >
              <Palette className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {showAccents && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 p-3 bg-primary border border-base rounded-xl shadow-xl flex gap-2"
                >
                  {accentColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setAccent(color);
                        setShowAccents(false);
                      }}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                        accent.name === color.name ? "border-text-primary" : "border-transparent"
                      )}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary text-secondary transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <div className="h-6 w-px bg-border-color mx-1 hidden sm:block" />

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 hover:bg-secondary p-1 pr-3 rounded-full transition-colors">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent overflow-hidden">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium hidden sm:block">Профиль</span>
              </Link>
              <button className="p-2 rounded-full hover:bg-rose-500/10 text-secondary hover:text-rose-500 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
