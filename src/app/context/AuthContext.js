import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
const AUTH_STORAGE_KEY = 'auth:isLoggedIn';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    });
    const login = useCallback(() => {
        setIsLoggedIn(true);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        }
    }, []);
    const logout = useCallback(() => {
        setIsLoggedIn(false);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(AUTH_STORAGE_KEY, 'false');
        }
    }, []);
    const value = useMemo(() => ({ isLoggedIn, login, logout }), [isLoggedIn, login, logout]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
