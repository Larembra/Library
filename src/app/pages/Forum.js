import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pin, Lock, MessageCircle, Loader2, X, Send, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';
export const Forum = ({ isAdmin = true }) => {
    const [topics, setTopics] = useState([...Array(6)].map((_, i) => ({
        id: i,
        title: i === 0 ? "Обсуждение концовки «Тайны древнего кода»" : `Тема форума #${i + 1}`,
        pinned: i === 0,
        locked: i === 2,
        replies: 42 + i,
        lastActivity: '2 часа назад'
    })));
    const [isLoading, setIsLoading] = useState(false);
    const [showNewTopic, setShowNewTopic] = useState(false);
    const observerTarget = useRef(null);
    const { isLoggedIn } = useAuth();
    const loadMoreTopics = () => {
        if (isLoading)
            return;
        setIsLoading(true);
        setTimeout(() => {
            const newTopics = [...Array(5)].map((_, i) => ({
                id: topics.length + i,
                title: `Еще одна интересная тема #${topics.length + i + 1}`,
                pinned: false,
                locked: false,
                replies: Math.floor(Math.random() * 100),
                lastActivity: 'Недавно'
            }));
            setTopics(prev => [...prev, ...newTopics]);
            setIsLoading(false);
        }, 1000);
    };
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting)
                loadMoreTopics();
        }, { threshold: 1.0 });
        if (observerTarget.current)
            observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [isLoading]);
    const togglePin = (id, e) => {
        e.preventDefault();
        setTopics(prev => prev.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
    };
    const deleteTopic = (id, e) => {
        e.preventDefault();
        setTopics(prev => prev.filter(t => t.id !== id));
    };
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "\u0424\u043E\u0440\u0443\u043C \u0411\u0438\u0431\u043B\u0438\u043E\u0422\u044D\u043A\u0430" }), _jsx("p", { className: "text-secondary", children: "\u041E\u0431\u0441\u0443\u0436\u0434\u0430\u0439\u0442\u0435 \u043A\u043D\u0438\u0433\u0438 \u0438 \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0435 \u0435\u0434\u0438\u043D\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u0438\u043A\u043E\u0432" })] }), isLoggedIn && (_jsxs("button", { onClick: () => setShowNewTopic(true), className: "flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 transition-transform active:scale-95", children: [_jsx(Plus, { className: "w-5 h-5" }), " \u041D\u043E\u0432\u0430\u044F \u0442\u0435\u043C\u0430"] }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [_jsxs("div", { className: "lg:col-span-3 space-y-4", children: [topics.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map((topic) => (_jsxs(Link, { to: `/forum/topic/${topic.id}`, className: "block p-6 bg-primary border border-base rounded-2xl hover:border-accent transition-all group relative", children: [_jsxs("div", { className: "flex items-start justify-between gap-4 mb-3", children: [_jsxs("div", { className: "flex flex-wrap gap-2 pr-20", children: [topic.pinned && _jsx("span", { className: "p-1 bg-amber-500/10 text-amber-500 rounded", children: _jsx(Pin, { className: "w-4 h-4" }) }), topic.locked && _jsx("span", { className: "p-1 bg-secondary text-secondary rounded", children: _jsx(Lock, { className: "w-4 h-4" }) }), _jsx("h3", { className: "text-lg font-bold group-hover:text-accent transition-colors", children: topic.title })] }), isAdmin && isLoggedIn && (_jsxs("div", { className: "absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: (e) => togglePin(topic.id, e), className: clsx("p-2 rounded-lg border border-base bg-primary hover:bg-amber-500/10", topic.pinned ? "text-amber-500 border-amber-500/30" : "text-secondary hover:text-amber-500"), title: topic.pinned ? "Открепить" : "Закрепить", children: _jsx(Pin, { className: "w-4 h-4" }) }), _jsx("button", { onClick: (e) => deleteTopic(topic.id, e), className: "p-2 rounded-lg border border-base bg-primary hover:bg-rose-500/10 text-secondary hover:text-rose-500", title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4 text-xs text-secondary", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(MessageCircle, { className: "w-4 h-4" }), " ", topic.replies, " \u043E\u0442\u0432\u0435\u0442\u043E\u0432"] }), _jsxs("div", { children: ["\u0410\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C: ", topic.lastActivity] })] }), _jsx("span", { className: "px-2 py-1 bg-secondary text-[10px] font-bold rounded uppercase", children: "\u041E\u0431\u0441\u0443\u0436\u0434\u0435\u043D\u0438\u0435" })] })] }, topic.id))), _jsx("div", { ref: observerTarget, className: "flex justify-center py-8", children: isLoading && _jsx(Loader2, { className: "w-6 h-6 animate-spin text-accent" }) })] }), _jsx("aside", { className: "space-y-6", children: _jsxs("div", { className: "p-6 bg-secondary rounded-2xl border border-base sticky top-24", children: [_jsx("h4", { className: "font-bold mb-4", children: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0442\u0435\u043C\u0430\u043C" }), _jsxs("div", { className: "relative mb-6", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" }), _jsx("input", { className: "w-full pl-10 pr-4 py-2 bg-primary border border-base rounded-lg text-sm", placeholder: "\u041D\u0430\u0439\u0442\u0438..." })] }), _jsx("h4", { className: "font-bold mb-4", children: "\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0442\u0435\u0433\u0438" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ['Теории', 'Спойлеры', 'Поиск книг', 'Конкурсы', 'Оффтоп'].map(t => (_jsx("button", { className: "px-3 py-1.5 bg-primary border border-base rounded-lg text-xs hover:border-accent transition-colors", children: t }, t))) })] }) })] }), _jsx(AnimatePresence, { children: showNewTopic && isLoggedIn && (_jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setShowNewTopic(false), className: "absolute inset-0 bg-black/60 backdrop-blur-sm" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.9, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9, y: 20 }, className: "relative w-full max-w-lg bg-primary rounded-3xl p-8 shadow-2xl border border-base", children: [_jsx("button", { onClick: () => setShowNewTopic(false), className: "absolute top-6 right-6 text-secondary hover:text-primary transition-colors", children: _jsx(X, { className: "w-6 h-6" }) }), _jsx("h2", { className: "text-2xl font-black mb-6", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u0443\u044E \u0442\u0435\u043C\u0443" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold uppercase text-secondary mb-2 block", children: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0442\u0435\u043C\u044B" }), _jsx("input", { type: "text", placeholder: "\u041E \u0447\u0435\u043C \u0432\u044B \u0445\u043E\u0442\u0438\u0442\u0435 \u043F\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u044C?", className: "w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold uppercase text-secondary mb-2 block", children: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435" }), _jsx("textarea", { placeholder: "\u041E\u043F\u0438\u0448\u0438\u0442\u0435 \u0432\u0430\u0448\u0443 \u0438\u0434\u0435\u044E \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435...", className: "w-full px-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all min-h-[150px]" })] }), _jsx("div", { className: "pt-2", children: _jsxs("button", { onClick: () => setShowNewTopic(false), className: "w-full py-4 bg-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:opacity-90 transition-all", children: [_jsx(Send, { className: "w-5 h-5" }), " \u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0442\u0435\u043C\u0443"] }) })] })] })] })) })] }));
};
