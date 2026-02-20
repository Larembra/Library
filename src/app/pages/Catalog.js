import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Grid, List as ListIcon, ChevronDown, Loader2 } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { MOCK_BOOKS } from '../data/mock';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
const GENRES = ['Все', 'Фантастика', 'Фэнтези', 'Проза', 'Детектив', 'Триллер', 'Образование', 'Психология'];
export const Catalog = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [search, setSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('Все');
    const [showFilters, setShowFilters] = useState(false);
    // Infinite scroll logic
    const [books, setBooks] = useState(MOCK_BOOKS);
    const [isLoading, setIsLoading] = useState(false);
    const observerTarget = useRef(null);
    const loadMoreBooks = () => {
        if (isLoading)
            return;
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setBooks(prev => [...prev, ...MOCK_BOOKS.map(b => ({ ...b, id: Math.random().toString() }))]);
            setIsLoading(false);
        }, 800);
    };
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMoreBooks();
            }
        }, { threshold: 1.0 });
        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }
        return () => observer.disconnect();
    }, [isLoading]);
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase());
        const matchesGenre = selectedGenre === 'Все' || book.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex flex-col gap-6 mb-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-3xl font-bold", children: "\u041A\u0430\u0442\u0430\u043B\u043E\u0433" }), _jsxs("div", { className: "flex items-center gap-2 bg-secondary p-1 rounded-lg", children: [_jsx("button", { onClick: () => setViewMode('grid'), className: clsx("p-2 rounded-md transition-colors", viewMode === 'grid' ? "bg-primary text-accent shadow-sm" : "text-secondary"), children: _jsx(Grid, { className: "w-5 h-5" }) }), _jsx("button", { onClick: () => setViewMode('list'), className: clsx("p-2 rounded-md transition-colors", viewMode === 'list' ? "bg-primary text-accent shadow-sm" : "text-secondary"), children: _jsx(ListIcon, { className: "w-5 h-5" }) })] })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" }), _jsx("input", { type: "text", placeholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E, \u0430\u0432\u0442\u043E\u0440\u0443 \u0438\u043B\u0438 \u0436\u0430\u043D\u0440\u0443...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-12 pr-4 py-3 bg-secondary border border-base rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all" })] }), _jsxs("button", { onClick: () => setShowFilters(!showFilters), className: clsx("flex items-center gap-2 px-6 py-3 border rounded-xl font-medium transition-all", showFilters ? "bg-accent text-white border-accent" : "bg-primary border-base text-primary hover:bg-secondary"), children: [_jsx(Filter, { className: "w-5 h-5" }), "\u0424\u0438\u043B\u044C\u0442\u0440\u044B"] })] }), _jsx(AnimatePresence, { children: showFilters && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "overflow-hidden", children: _jsxs("div", { className: "p-6 bg-secondary rounded-2xl border border-base grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("label", { className: "text-xs font-bold uppercase text-secondary", children: "\u0416\u0430\u043D\u0440\u044B" }), _jsx("div", { className: "flex flex-wrap gap-2", children: GENRES.map(genre => (_jsx("button", { onClick: () => setSelectedGenre(genre), className: clsx("px-3 py-1.5 rounded-full text-xs font-medium transition-colors", selectedGenre === genre ? "bg-accent text-white" : "bg-primary border border-base text-secondary hover:border-accent"), children: genre }, genre))) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("label", { className: "text-xs font-bold uppercase text-secondary", children: "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430" }), _jsxs("div", { className: "relative", children: [_jsxs("select", { className: "w-full appearance-none px-4 py-2.5 bg-primary border border-base rounded-xl text-sm outline-none", children: [_jsx("option", { children: "\u041F\u043E \u043F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u0438" }), _jsx("option", { children: "\u041F\u043E \u043D\u043E\u0432\u0438\u0437\u043D\u0435" }), _jsx("option", { children: "\u041F\u043E \u0440\u0435\u0439\u0442\u0438\u043D\u0433\u0443" })] }), _jsx(ChevronDown, { className: "absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" })] })] })] }) })) })] }), _jsx("div", { className: clsx("grid gap-8 mb-12", viewMode === 'grid' ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1"), children: filteredBooks.map((book) => (viewMode === 'grid' ? (_jsx(BookCard, { book: book }, book.id)) : (_jsxs(motion.div, { layout: true, className: "flex gap-6 p-4 rounded-2xl border border-base hover:shadow-lg transition-all", children: [_jsx("div", { className: "w-32 shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-secondary", children: _jsx("img", { src: book.cover, alt: book.title, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "flex-1 py-2 flex flex-col justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold mb-1", children: book.title }), _jsx("p", { className: "text-secondary text-sm mb-2", children: book.author }), _jsx("p", { className: "text-sm line-clamp-2 opacity-70 mb-4", children: book.description })] }), _jsx("div", { className: "flex items-center gap-4", children: _jsx("button", { className: "px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium", children: "\u0427\u0438\u0442\u0430\u0442\u044C" }) })] })] }, book.id)))) }), _jsx("div", { ref: observerTarget, className: "flex justify-center py-8", children: isLoading && (_jsxs("div", { className: "flex items-center gap-2 text-accent font-medium", children: [_jsx(Loader2, { className: "w-6 h-6 animate-spin" }), _jsx("span", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043D\u043E\u0432\u044B\u0445 \u043A\u043D\u0438\u0433..." })] })) })] }));
};
