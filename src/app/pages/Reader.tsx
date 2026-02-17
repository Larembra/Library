import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Settings, List, Bookmark, Maximize2, Minimize2, Type, MoveVertical, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { clsx } from 'clsx';

interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  lineWidth: 'narrow' | 'medium' | 'wide';
  fontFamily: 'sans' | 'serif' | 'mono';
  readerTheme: 'light' | 'dark' | 'sepia';
}

export const Reader: React.FC = () => {
  const { theme: appTheme } = useTheme();
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 18,
    lineHeight: 1.6,
    lineWidth: 'medium',
    fontFamily: 'serif',
    readerTheme: 'light',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [progress, setProgress] = useState(35);
  const [currentPage, setCurrentPage] = useState(1);

  // Prevention of selection and context menu
  useEffect(() => {
    const preventAction = (e: any) => e.preventDefault();
    document.addEventListener('contextmenu', preventAction);
    return () => document.removeEventListener('contextmenu', preventAction);
  }, []);

  const readerThemeStyles = {
    light: 'bg-[#ffffff] text-[#1a1a1a]',
    dark: 'bg-[#0f172a] text-[#e2e8f0]',
    sepia: 'bg-[#f4ecd8] text-[#5b4636]',
  };

  const lineWidthStyles = {
    narrow: 'max-w-xl',
    medium: 'max-w-3xl',
    wide: 'max-w-5xl',
  };

  return (
    <div className={clsx(
      "fixed inset-0 z-[60] flex flex-col transition-colors duration-300 select-none",
      readerThemeStyles[settings.readerTheme]
    )}>
      {/* Top Bar */}
      <AnimatePresence>
        {!isFocusMode && (
          <motion.div
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            exit={{ y: -60 }}
            className="h-14 flex items-center justify-between px-4 border-b border-black/5 backdrop-blur-sm sticky top-0 z-10"
          >
            <div className="flex items-center gap-4">
              <button onClick={() => window.history.back()} className="p-2 hover:bg-black/5 rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-sm font-semibold opacity-80">Тайны древнего кода — Глава 14</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-black/5 rounded-full">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-black/5 rounded-full">
                <List className="w-5 h-5" />
              </button>
              <button onClick={() => setIsFocusMode(true)} className="p-2 hover:bg-black/5 rounded-full">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reader Content */}
      <main className="flex-1 overflow-y-auto px-4 py-12 flex justify-center">
        <article
          className={clsx(
            "w-full transition-all duration-300",
            lineWidthStyles[settings.lineWidth],
            settings.fontFamily === 'serif' ? 'font-serif' : settings.fontFamily === 'mono' ? 'font-mono' : 'font-sans'
          )}
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
          }}
        >
          <div className="mb-12 border-l-4 border-accent pl-6 py-2 opacity-50 text-sm font-sans uppercase tracking-widest">
            Контент защищен законом об авторском праве «БиблиоТэка»
          </div>

          <h2 className="text-4xl font-bold mb-8 font-sans">Глава 14: Голос из Бездны</h2>

          {[...Array(10)].map((_, i) => (
            <p key={i} className="mb-6 leading-relaxed">
              В этом месте текст будет заменен на реальное содержание книги. Представьте захватывающий сюжет,
              наполненный деталями и эмоциями. Мы используем адаптивные настройки, чтобы чтение было максимально
              комфортным для каждого пользователя. Настраивайте шрифт, цвет фона и ширину строки под себя.
              «БиблиоТэка» заботится о вашем зрении и удобстве.
            </p>
          ))}
        </article>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-20 right-4 w-72 p-6 bg-primary border border-base rounded-2xl shadow-2xl z-[70] text-primary"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Настройки</h3>
                <button onClick={() => setShowSettings(false)} className="text-secondary hover:text-primary">×</button>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-secondary">Тема</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['light', 'sepia', 'dark'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSettings({ ...settings, readerTheme: t })}
                      className={clsx(
                        "h-10 rounded-lg border-2 flex items-center justify-center text-xs font-medium",
                        t === 'light' ? 'bg-white text-black' : t === 'sepia' ? 'bg-[#f4ecd8] text-[#5b4636]' : 'bg-[#0f172a] text-white',
                        settings.readerTheme === t ? 'border-accent' : 'border-transparent'
                      )}
                    >
                      {t === 'light' ? 'День' : t === 'sepia' ? 'Бумага' : 'Ночь'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-secondary flex justify-between">
                  Размер шрифта <span>{settings.fontSize}px</span>
                </label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setSettings({ ...settings, fontSize: Math.max(12, settings.fontSize - 1) })} className="p-2 bg-secondary rounded-lg">A-</button>
                  <input
                    type="range"
                    min="12"
                    max="32"
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                    className="flex-1 accent-accent"
                  />
                  <button onClick={() => setSettings({ ...settings, fontSize: Math.min(32, settings.fontSize + 1) })} className="p-2 bg-secondary rounded-lg">A+</button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-secondary">Ширина строки</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['narrow', 'medium', 'wide'] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => setSettings({ ...settings, lineWidth: w })}
                      className={clsx(
                        "h-10 rounded-lg bg-secondary text-xs font-medium border-2",
                        settings.lineWidth === w ? 'border-accent' : 'border-transparent'
                      )}
                    >
                      {w === 'narrow' ? 'Узкая' : w === 'medium' ? 'Средняя' : 'Широкая'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Progress Bar */}
      <div className="h-16 flex items-center justify-between px-4 md:px-8 border-t border-black/5">
        <div className="flex items-center gap-4 text-xs font-medium opacity-60">
          <span className="whitespace-nowrap">Стр. {currentPage} из 452</span>
          <div className="hidden md:block w-48 h-1 bg-black/10 rounded-full overflow-hidden">
            <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}%</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 hover:bg-black/5 rounded-lg text-sm font-medium">
            <Bookmark className="w-4 h-4" /> <span className="hidden md:inline">Закладка</span>
          </button>
          <div className="flex gap-1 md:gap-2">
            <button className="p-2 hover:bg-black/5 rounded-full"><ChevronLeft className="w-6 h-6" /></button>
            <button className="p-2 hover:bg-black/5 rounded-full"><ChevronRight className="w-6 h-6" /></button>
          </div>
        </div>
      </div>

      {isFocusMode && (
        <button
          onClick={() => setIsFocusMode(false)}
          className="fixed top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md opacity-0 hover:opacity-100 transition-opacity"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
