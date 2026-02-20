import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Suspense, lazy } from 'react';
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
const Auth = lazy(() => import('./pages/Auth').then(module => ({ default: module.Auth })));
const Privacy = lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));
// Компонент загрузки
const LoadingFallback = () => (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-primary", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-secondary", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." })] }) }));
const RequireAuth = ({ children }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/auth", replace: true });
};
const AppShell = () => {
    return (_jsx(Router, { children: _jsxs("div", { className: "min-h-screen flex flex-col bg-primary text-primary transition-colors duration-300", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 pb-20", children: _jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/catalog", element: _jsx(Catalog, {}) }), _jsx(Route, { path: "/book/:id", element: _jsx(BookDetails, {}) }), _jsx(Route, { path: "/reader", element: _jsx(Reader, {}) }), _jsx(Route, { path: "/forum", element: _jsx(Forum, { isAdmin: true }) }), _jsx(Route, { path: "/forum/topic/:id", element: _jsx(ForumTopic, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/admin", element: _jsx(RequireAuth, { children: _jsx(Admin, {}) }) }), _jsx(Route, { path: "/about", element: _jsxs("div", { className: "container mx-auto p-12 text-center", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "\u041E \u043F\u0440\u043E\u0435\u043A\u0442\u0435 \u0411\u0438\u0431\u043B\u0438\u043E\u0422\u044D\u043A\u0430" }), _jsx("p", { className: "text-secondary", children: "\u041C\u044B \u2014 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0443\u0447\u0435\u0431\u043D\u044B\u0439 \u043F\u0440\u043E\u0435\u043A\u0442, \u0441\u043E\u0437\u0434\u0430\u043D\u043D\u044B\u0439 \u0441 \u043B\u044E\u0431\u043E\u0432\u044C\u044E \u043A \u0447\u0442\u0435\u043D\u0438\u044E." })] }) }), _jsx(Route, { path: "/faq", element: _jsxs("div", { className: "container mx-auto p-12 text-center", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "\u041F\u043E\u043C\u043E\u0449\u044C" }), _jsx("p", { className: "text-secondary", children: "\u0417\u0434\u0435\u0441\u044C \u0431\u0443\u0434\u0443\u0442 \u043E\u0442\u0432\u0435\u0442\u044B \u043D\u0430 \u0447\u0430\u0441\u0442\u043E \u0437\u0430\u0434\u0430\u0432\u0430\u0435\u043C\u044B\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B." })] }) }), _jsx(Route, { path: "/policy", element: _jsx(Privacy, {}) }), _jsx(Route, { path: "/terms", element: _jsx(Terms, {}) }), _jsx(Route, { path: "/auth", element: _jsx(Auth, {}) })] }) }) }), _jsx("footer", { className: "border-t border-base py-8 bg-secondary/30", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-secondary", children: [_jsx("p", { children: "\u00A9 2026 \u0411\u0438\u0431\u043B\u0438\u043E\u0422\u044D\u043A\u0430. \u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B." }), _jsxs("div", { className: "flex flex-wrap justify-center gap-6", children: [_jsx(Link, { to: "/policy", className: "hover:text-accent", children: "\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438" }), _jsx(Link, { to: "/terms", className: "hover:text-accent", children: "\u0423\u0441\u043B\u043E\u0432\u0438\u044F \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F" }), _jsx(Link, { to: "/faq", className: "hover:text-accent", children: "\u041F\u043E\u043C\u043E\u0449\u044C" })] })] }) }) })] }) }));
};
const App = () => {
    return (_jsx(ThemeProvider, { children: _jsx(AuthProvider, { children: _jsx(AppShell, {}) }) }));
};
export default App;
