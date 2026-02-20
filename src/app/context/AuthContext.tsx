import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type AuthContextValue = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = 'auth:isLoggedIn';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
