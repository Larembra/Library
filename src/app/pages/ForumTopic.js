import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, ThumbsDown, Trash2, Pin, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
export const ForumTopic = () => {
    const { id } = useParams();
    const { isLoggedIn } = useAuth();
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'Константин В.',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&auto=format&fit=crop',
            content: 'Кто что думает о финальном твисте в Тайны древнего кода? Мне кажется, автор оставил слишком много вопросов для сиквела, или я что-то упустил в 12 главе?',
            date: 'Сегодня, 14:20',
            likes: 24,
            dislikes: 1,
            role: 'Участник',
            isAdmin: false,
            reaction: null,
        },
        {
            id: 2,
            author: 'Мария П.',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop',
            content: 'Я согласна, финал открытый. Но если перечитать момент с письмом в начале книги, то многие детали становятся понятнее. Это классический прием "ненадежного рассказчика".',
            date: 'Сегодня, 15:45',
            likes: 12,
            dislikes: 0,
            role: 'Модератор',
            isAdmin: true,
            reaction: null,
        }
    ]);
    const handleReaction = (postId, type) => {
        if (!isLoggedIn)
            return;
        setPosts(prev => prev.map(post => {
            if (post.id !== postId)
                return post;
            const next = { ...post };
            if (type === 'like') {
                if (next.reaction === 'like') {
                    next.likes -= 1;
                    next.reaction = null;
                }
                else {
                    if (next.reaction === 'dislike') {
                        next.dislikes -= 1;
                    }
                    next.likes += 1;
                    next.reaction = 'like';
                }
            }
            else {
                if (next.reaction === 'dislike') {
                    next.dislikes -= 1;
                    next.reaction = null;
                }
                else {
                    if (next.reaction === 'like') {
                        next.likes -= 1;
                    }
                    next.dislikes += 1;
                    next.reaction = 'dislike';
                }
            }
            return next;
        }));
    };
    return (_jsxs("div", { className: "container mx-auto px-4 py-8 max-w-5xl", children: [_jsxs(Link, { to: "/forum", className: "inline-flex items-center gap-2 text-sm text-secondary hover:text-accent mb-6 transition-colors group", children: [_jsx(ChevronLeft, { className: "w-4 h-4 transition-transform group-hover:-translate-x-1" }), " \u041D\u0430\u0437\u0430\u0434 \u043A \u0441\u043F\u0438\u0441\u043A\u0443 \u0442\u0435\u043C"] }), _jsxs("div", { className: "flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex gap-2 mb-2", children: [_jsxs("span", { className: "p-1 bg-amber-500/10 text-amber-500 rounded text-xs flex items-center gap-1 font-bold", children: [_jsx(Pin, { className: "w-3 h-3" }), " \u0417\u0430\u043A\u0440\u0435\u043F\u043B\u0435\u043D\u043E"] }), _jsx("span", { className: "px-2 py-1 bg-secondary text-secondary rounded text-[10px] font-bold uppercase tracking-wider", children: "\u0422\u0435\u043E\u0440\u0438\u0438" })] }), _jsx("h1", { className: "text-3xl font-black", children: "\u041E\u0431\u0441\u0443\u0436\u0434\u0435\u043D\u0438\u0435 \u043A\u043E\u043D\u0446\u043E\u0432\u043A\u0438 \u00AB\u0422\u0430\u0439\u043D\u044B \u0434\u0440\u0435\u0432\u043D\u0435\u0433\u043E \u043A\u043E\u0434\u0430\u00BB (\u0441\u043F\u043E\u0439\u043B\u0435\u0440\u044B!)" })] }), isLoggedIn && (_jsxs("div", { className: "flex gap-2 shrink-0", children: [_jsxs("button", { className: "flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl hover:text-amber-500 transition-colors text-sm font-bold border border-base", title: "\u0417\u0430\u043A\u0440\u0435\u043F\u0438\u0442\u044C/\u041E\u0442\u043A\u0440\u0435\u043F\u0438\u0442\u044C", children: [_jsx(Pin, { className: "w-4 h-4" }), " \u0417\u0430\u043A\u0440\u0435\u043F\u0438\u0442\u044C"] }), _jsxs("button", { className: "flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl hover:text-rose-500 transition-colors text-sm font-bold border border-base", title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0442\u0435\u043C\u0443", children: [_jsx(Trash2, { className: "w-4 h-4" }), " \u0423\u0434\u0430\u043B\u0438\u0442\u044C"] })] }))] }), _jsx("div", { className: "space-y-6 mb-12", children: posts.map((post) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex flex-col md:flex-row gap-6 p-6 bg-primary border border-base rounded-3xl", children: [_jsxs("div", { className: "md:w-32 shrink-0 flex flex-col items-center gap-3", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl overflow-hidden border-2 border-base", children: _jsx("img", { src: post.avatar, alt: "", className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "font-bold text-sm truncate w-24", children: post.author }), _jsx("span", { className: `text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${post.isAdmin ? 'bg-accent/10 text-accent' : 'bg-secondary text-secondary'}`, children: post.role })] })] }), _jsxs("div", { className: "flex-1 flex flex-col justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-secondary mb-3", children: post.date }), _jsx("div", { className: "text-lg leading-relaxed text-secondary-foreground", children: post.content })] }), _jsxs("div", { className: "flex items-center justify-between mt-6 pt-6 border-t border-base", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { type: "button", onClick: () => handleReaction(post.id, 'like'), className: `flex items-center gap-1 text-sm font-medium transition-colors ${post.reaction === 'like' ? 'text-accent' : 'text-secondary hover:text-accent'} ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`, "aria-disabled": !isLoggedIn, children: [_jsx(ThumbsUp, { className: "w-4 h-4" }), " ", post.likes] }), _jsxs("button", { type: "button", onClick: () => handleReaction(post.id, 'dislike'), className: `flex items-center gap-1 text-sm font-medium transition-colors ${post.reaction === 'dislike' ? 'text-rose-500' : 'text-secondary hover:text-rose-500'} ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`, "aria-disabled": !isLoggedIn, children: [post.dislikes, " ", _jsx(ThumbsDown, { className: "w-4 h-4" })] }), isLoggedIn && (_jsx("button", { onClick: () => setReplyingTo(replyingTo === post.id ? null : post.id), className: "text-sm font-bold text-accent ml-2", children: "\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C" }))] }), isLoggedIn && post.isAdmin && (_jsx("button", { className: "p-2 text-secondary hover:text-rose-500 transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) }))] }), isLoggedIn && replyingTo === post.id && (_jsxs("div", { className: "mt-4 pl-8 space-y-3 border-l-2 border-accent/20", children: [_jsx("textarea", { value: replyText, onChange: (e) => setReplyText(e.target.value), placeholder: "\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043E\u0442\u0432\u0435\u0442...", className: "w-full p-4 bg-secondary border border-base rounded-2xl outline-none focus:ring-2 focus:ring-accent min-h-[100px] text-sm" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => {
                                                        // Здесь будет логика отправки ответа
                                                        setReplyText('');
                                                        setReplyingTo(null);
                                                    }, className: "px-4 py-2 bg-accent text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg", children: [_jsx(Send, { className: "w-4 h-4" }), " \u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C"] }), _jsx("button", { onClick: () => {
                                                        setReplyText('');
                                                        setReplyingTo(null);
                                                    }, className: "px-4 py-2 bg-secondary border border-base rounded-xl font-bold text-sm", children: "\u041E\u0442\u043C\u0435\u043D\u0430" })] })] }))] })] }, post.id))) }), isLoggedIn && (_jsxs("div", { className: "p-8 bg-secondary rounded-3xl border border-base", children: [_jsx("h3", { className: "font-bold mb-4", children: "\u0412\u0430\u0448 \u043E\u0442\u0432\u0435\u0442" }), _jsxs("div", { className: "relative", children: [_jsx("textarea", { placeholder: "\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435, \u0447\u0442\u043E \u0432\u044B \u0434\u0443\u043C\u0430\u0435\u0442\u0435...", className: "w-full p-4 bg-primary border border-base rounded-2xl outline-none focus:ring-2 focus:ring-accent min-h-[150px] transition-all" }), _jsxs("button", { className: "absolute bottom-4 right-4 px-6 py-2 bg-accent text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-accent/20", children: [_jsx(Send, { className: "w-4 h-4" }), " \u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C"] })] })] }))] }));
};
