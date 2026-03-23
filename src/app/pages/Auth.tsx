import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

export const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-primary border border-base rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full -ml-16 -mb-16 blur-3xl" />

        <div className="relative z-10 text-center mb-10">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-accent/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black mb-2">
            {mode === 'login' ? 'С возвращением!' : 'Присоединяйтесь'}
          </h1>
          <p className="text-secondary text-sm">
            {mode === 'login' 
              ? 'Войдите в свой аккаунт БиблиоТэка' 
              : 'Создайте аккаунт, чтобы начать чтение'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 text-rose-500 text-sm rounded-xl text-center relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input
                    required
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-secondary border border-base rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              required
              type="email"
              placeholder="Email адрес"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-secondary border border-base rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              required
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-secondary border border-base rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <button type="button" className="text-xs font-bold text-accent hover:underline">Забыли пароль?</button>
            </div>
          )}

          <button
            disabled={isLoading}
            type="submit"
            className={clsx(
              "w-full py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-2 shadow-lg",
              isLoading ? "bg-accent/70 cursor-wait" : "bg-accent shadow-accent/20 hover:scale-[1.02] active:scale-95"
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-secondary text-sm">
            {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="ml-2 font-black text-accent hover:underline"
            >
              {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-base flex items-center justify-center gap-2 text-[10px] text-secondary font-bold uppercase tracking-widest relative z-10">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Безопасное соединение БиблиоТэка
        </div>
      </motion.div>
    </div>
  );
};