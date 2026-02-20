import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Palette, User, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export const Header = ({ isAdmin = true }) => {
    const { theme, toggleTheme, accent, setAccent, accentColors } = useTheme();
    const { isLoggedIn, logout } = useAuth();
    const [showAccents, setShowAccents] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const navItems = [
        { label: 'Главная', path: '/' },
        { label: 'Каталог', path: '/catalog' },
        { label: 'Форум', path: '/forum' },
        ...(isAdmin && isLoggedIn ? [{ label: 'Админка', path: '/admin' }] : []),
    ];
    return (_jsx("header", { className: "sticky top-0 z-50 w-full border-b border-base bg-primary", children: _jsxs("div", { className: "container mx-auto px-4 h-16 flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-6 lg:gap-12", children: [_jsxs(Link, { to: "/", className: "text-xl font-black tracking-tight flex items-center gap-2 shrink-0", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-xs shadow-lg shadow-accent/20", children: "\u0411\u0422" }), _jsxs("span", { className: "hidden sm:inline", children: ["\u0411\u0438\u0431\u043B\u0438\u043E", _jsx("span", { className: "text-accent", children: "\u0422\u044D\u043A\u0430" })] })] }), _jsx("nav", { className: "hidden md:flex items-center gap-6", children: navItems.map((item) => (_jsx(Link, { to: item.path, className: cn("text-sm font-bold transition-all hover:text-accent", location.pathname === item.path ? "text-accent" : "text-secondary"), children: item.label }, item.path))) })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx("button", { onClick: () => setShowAccents(!showAccents), className: "p-2 rounded-full hover:bg-secondary text-secondary transition-colors", title: "\u0412\u044B\u0431\u043E\u0440 \u0430\u043A\u0446\u0435\u043D\u0442\u0430", children: _jsx(Palette, { className: "w-5 h-5" }) }), _jsx(AnimatePresence, { children: showAccents && (_jsx(motion.div, { initial: { opacity: 0, y: 10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 10, scale: 0.95 }, className: "absolute right-0 mt-2 p-3 bg-primary border border-base rounded-xl shadow-xl flex gap-2", children: accentColors.map((color) => (_jsx("button", { onClick: () => {
                                                setAccent(color);
                                                setShowAccents(false);
                                            }, className: cn("w-6 h-6 rounded-full border-2 transition-transform hover:scale-110", accent.name === color.name ? "border-text-primary" : "border-transparent"), style: { backgroundColor: color.value } }, color.name))) })) })] }), _jsx("button", { onClick: toggleTheme, className: "p-2 rounded-full hover:bg-secondary text-secondary transition-colors", children: theme === 'light' ? _jsx(Moon, { className: "w-5 h-5" }) : _jsx(Sun, { className: "w-5 h-5" }) }), _jsx("div", { className: "h-6 w-px bg-border-color mx-1 hidden sm:block" }), isLoggedIn ? (_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Link, { to: "/profile", className: "flex items-center gap-2 hover:bg-secondary p-1 pr-3 rounded-full transition-colors", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent overflow-hidden", children: _jsx(User, { className: "w-5 h-5" }) }), _jsx("span", { className: "text-sm font-medium hidden sm:block", children: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C" })] }), _jsx("button", { type: "button", onClick: () => {
                                        logout();
                                        navigate('/auth');
                                    }, className: "p-2 rounded-full hover:bg-rose-500/10 text-secondary hover:text-rose-500 transition-colors", "aria-label": "\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u043F\u0440\u043E\u0444\u0438\u043B\u044F", children: _jsx(LogOut, { className: "w-5 h-5" }) })] })) : (_jsx(Link, { to: "/auth", className: "px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity", children: "\u0412\u043E\u0439\u0442\u0438" }))] })] }) }));
};
