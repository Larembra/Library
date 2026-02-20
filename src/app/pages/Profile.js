import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Mail, Shield, BookOpen, MessageSquare, History, Heart, Edit2, Camera, Key, X, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { MOCK_BOOKS } from '../data/mock';
import { BookCard } from '../components/BookCard';
export const Profile = () => {
    const [activeTab, setActiveTab] = useState('books');
    const [user, setUser] = useState({
        name: 'Александр Ридер',
        email: 'alex.reader@example.com',
        bio: 'Люблю научную фантастику и киберпанк. Собираю коллекцию редких изданий. Всегда открыт для обсуждения интересных теорий на форуме!',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop',
        banner: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&h=400&auto=format&fit=crop',
        stats: {
            readCount: 124,
            avgRating: 4.7,
            forumActivity: 856
        }
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user.name,
        email: user.email
    });
    const [bioText, setBioText] = useState(user.bio);
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUser(prev => ({ ...prev, avatar: event.target?.result }));
            };
            reader.readAsDataURL(file);
        }
    };
    const handleBannerChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUser(prev => ({ ...prev, banner: event.target?.result }));
            };
            reader.readAsDataURL(file);
        }
    };
    const saveProfile = () => {
        setUser(prev => ({
            ...prev,
            name: editForm.name,
            email: editForm.email
        }));
        setIsEditingProfile(false);
    };
    const saveBio = () => {
        setUser(prev => ({ ...prev, bio: bioText }));
        setIsEditingBio(false);
    };
    const cancelEdit = () => {
        setEditForm({
            name: user.name,
            email: user.email
        });
        setIsEditingProfile(false);
    };
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "relative mb-8", children: [_jsxs("div", { className: "h-48 md:h-64 rounded-3xl overflow-hidden border border-base relative group", children: [_jsx("img", { src: user.banner, alt: "Banner", className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-black/20" }), _jsx("input", { type: "file", id: "bannerInput", accept: "image/*", onChange: handleBannerChange, className: "hidden" }), _jsx("label", { htmlFor: "bannerInput", className: "absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white/30", children: _jsx(Camera, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex flex-col md:flex-row items-end gap-6 px-8 -mt-12 relative z-10", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-primary bg-primary overflow-hidden shadow-xl", children: _jsx("img", { src: user.avatar, alt: "Avatar", className: "w-full h-full object-cover" }) }), _jsx("input", { type: "file", id: "avatarInput", accept: "image/*", onChange: handleAvatarChange, className: "hidden" }), _jsx("label", { htmlFor: "avatarInput", className: "absolute bottom-2 right-2 p-2 bg-accent text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-accent/90", children: _jsx(Edit2, { className: "w-4 h-4" }) })] }), _jsx("div", { className: "flex-1 pb-2", children: !isEditingProfile ? (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-3xl font-black mb-1", children: user.name }), _jsxs("p", { className: "text-secondary text-sm flex items-center gap-2", children: [_jsx(Mail, { className: "w-4 h-4" }), " ", user.email] })] })) : (_jsxs("div", { className: "space-y-2", children: [_jsx("input", { type: "text", value: editForm.name, onChange: (e) => setEditForm(prev => ({ ...prev, name: e.target.value })), className: "text-2xl font-black bg-secondary border border-base rounded-xl px-3 py-1 outline-none focus:ring-2 focus:ring-accent w-full", placeholder: "\u0418\u043C\u044F" }), _jsx("input", { type: "email", value: editForm.email, onChange: (e) => setEditForm(prev => ({ ...prev, email: e.target.value })), className: "text-sm bg-secondary border border-base rounded-xl px-3 py-1 outline-none focus:ring-2 focus:ring-accent w-full", placeholder: "Email" })] })) }), _jsx("div", { className: "flex gap-3 pb-2", children: !isEditingProfile ? (_jsx("button", { onClick: () => setIsEditingProfile(true), className: "px-6 py-2.5 bg-accent text-white rounded-xl font-bold text-sm shadow-lg shadow-accent/20 hover:bg-accent/90 transition-colors", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" })) : (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: saveProfile, className: "px-4 py-2.5 bg-accent text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2", children: [_jsx(Check, { className: "w-4 h-4" }), " \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C"] }), _jsxs("button", { onClick: cancelEdit, className: "px-4 py-2.5 bg-secondary rounded-xl font-bold text-sm flex items-center gap-2", children: [_jsx(X, { className: "w-4 h-4" }), " \u041E\u0442\u043C\u0435\u043D\u0430"] })] })) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-6 bg-secondary rounded-2xl border border-base", children: [_jsx("h3", { className: "font-bold mb-4", children: "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm text-secondary flex items-center gap-2", children: [_jsx(BookOpen, { className: "w-4 h-4" }), " \u041F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043E"] }), _jsx("span", { className: "font-bold", children: user.stats.readCount })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm text-secondary flex items-center gap-2", children: [_jsx(Heart, { className: "w-4 h-4" }), " \u0421\u0440\u0435\u0434\u043D\u044F\u044F \u043E\u0446\u0435\u043D\u043A\u0430"] }), _jsx("span", { className: "font-bold text-accent", children: user.stats.avgRating })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm text-secondary flex items-center gap-2", children: [_jsx(MessageSquare, { className: "w-4 h-4" }), " \u0410\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C"] }), _jsx("span", { className: "font-bold", children: user.stats.forumActivity })] })] })] }), _jsxs("div", { className: "p-6 bg-secondary rounded-2xl border border-base", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-bold", children: "\u041E \u0441\u0435\u0431\u0435" }), !isEditingBio && (_jsx("button", { onClick: () => {
                                                    setIsEditingBio(true);
                                                    setBioText(user.bio);
                                                }, className: "p-1 hover:bg-primary rounded-lg transition-colors", children: _jsx(Edit2, { className: "w-4 h-4 text-accent" }) }))] }), !isEditingBio ? (_jsx("p", { className: "text-sm text-secondary leading-relaxed mb-4", children: user.bio })) : (_jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { value: bioText, onChange: (e) => setBioText(e.target.value), className: "w-full p-3 bg-primary border border-base rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm h-32", placeholder: "\u0420\u0430\u0441\u0441\u043A\u0430\u0436\u0438\u0442\u0435 \u043E \u0441\u0435\u0431\u0435..." }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: saveBio, className: "flex-1 py-2 bg-accent text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1", children: [_jsx(Check, { className: "w-3 h-3" }), " \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C"] }), _jsxs("button", { onClick: () => {
                                                            setBioText(user.bio);
                                                            setIsEditingBio(false);
                                                        }, className: "flex-1 py-2 bg-primary border border-base rounded-lg font-bold text-xs flex items-center justify-center gap-1", children: [_jsx(X, { className: "w-3 h-3" }), " \u041E\u0442\u043C\u0435\u043D\u0430"] })] })] }))] })] }), _jsxs("div", { className: "lg:col-span-3 space-y-6", children: [_jsx("div", { className: "flex border-b border-base gap-8 overflow-x-auto no-scrollbar", children: [
                                    { id: 'books', label: 'Избранное', icon: _jsx(Heart, { className: "w-4 h-4" }) },
                                    { id: 'reviews', label: 'Мои отзывы', icon: _jsx(MessageSquare, { className: "w-4 h-4" }) },
                                    { id: 'history', label: 'История', icon: _jsx(History, { className: "w-4 h-4" }) },
                                    { id: 'settings', label: 'Безопасность', icon: _jsx(Shield, { className: "w-4 h-4" }) }
                                ].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: clsx("flex items-center gap-2 pb-4 text-sm font-bold transition-all relative whitespace-nowrap", activeTab === tab.id ? "text-primary" : "text-secondary hover:text-primary"), children: [tab.icon, " ", tab.label, activeTab === tab.id && (_jsx(motion.div, { layoutId: "profileTab", className: "absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-full" }))] }, tab.id))) }), _jsxs("div", { className: "min-h-[400px]", children: [activeTab === 'books' && (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: MOCK_BOOKS.map(book => _jsx(BookCard, { book: book }, book.id)) })), activeTab === 'reviews' && (_jsx("div", { className: "space-y-4", children: [
                                            { title: 'Тайны древнего кода', rating: 5, text: 'Потрясающая книга! Сюжет держит в напряжении до самого конца. Очень понравилась проработка мира.', date: '10 фев 2026' },
                                            { title: 'Путь к звездам', rating: 4, text: 'Интересная научная фантастика, но местами слишком много технических подробностей.', date: '1 фев 2026' },
                                        ].map((review, i) => (_jsxs("div", { className: "p-6 bg-secondary/50 rounded-2xl border border-base", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-bold", children: review.title }), _jsx("div", { className: "flex text-amber-500 mt-1", children: [...Array(5)].map((_, j) => (_jsx("span", { className: j < review.rating ? "fill-current" : "opacity-20", children: "\u2605" }, j))) })] }), _jsx("span", { className: "text-xs text-secondary", children: review.date })] }), _jsx("p", { className: "text-secondary text-sm leading-relaxed", children: review.text }), _jsxs("div", { className: "flex gap-4 mt-4", children: [_jsx("button", { className: "text-[10px] font-bold uppercase text-accent hover:underline", children: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C" }), _jsx("button", { className: "text-[10px] font-bold uppercase text-rose-500 hover:underline", children: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C" })] })] }, i))) })), activeTab === 'history' && (_jsx("div", { className: "space-y-4", children: MOCK_BOOKS.slice(0, 3).map(book => (_jsxs("div", { className: "p-4 bg-secondary/50 rounded-2xl border border-base flex items-center gap-4", children: [_jsx("img", { src: book.cover, className: "w-12 h-16 object-cover rounded-lg", alt: "" }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-bold text-sm", children: book.title }), _jsx("div", { className: "w-full h-1 bg-primary rounded-full mt-2", children: _jsx("div", { className: "h-full bg-accent w-2/3 rounded-full" }) })] }), _jsx("span", { className: "text-xs text-secondary font-medium whitespace-nowrap", children: "2 \u0434\u043D\u044F \u043D\u0430\u0437\u0430\u0434" })] }, book.id))) })), activeTab === 'settings' && (_jsx("div", { className: "max-w-md space-y-6", children: _jsxs("div", { className: "p-6 bg-secondary/50 rounded-2xl border border-base space-y-4", children: [_jsxs("h4", { className: "font-bold flex items-center gap-2", children: [_jsx(Key, { className: "w-4 h-4" }), " \u0421\u043C\u0435\u043D\u0430 \u043F\u0430\u0440\u043E\u043B\u044F"] }), _jsxs("div", { className: "space-y-2", children: [_jsx("input", { type: "password", placeholder: "\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u043F\u0430\u0440\u043E\u043B\u044C", className: "w-full px-4 py-2.5 bg-primary border border-base rounded-xl text-sm" }), _jsx("input", { type: "password", placeholder: "\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C", className: "w-full px-4 py-2.5 bg-primary border border-base rounded-xl text-sm" }), _jsx("button", { className: "w-full py-2.5 bg-primary border border-base rounded-xl font-bold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all", children: "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C" })] })] }) }))] })] })] })] }));
};
