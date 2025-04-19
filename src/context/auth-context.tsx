'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    token: string | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    login: (token: string, isAdmin: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedAdmin = localStorage.getItem('isAdmin') === 'true';
        if (savedToken) {
            setToken(savedToken);
            setIsAdmin(savedAdmin);
        }
    }, []);

    const login = (token: string, isAdmin: boolean) => {
        localStorage.setItem('token', token);
        localStorage.setItem('isAdmin', String(isAdmin));
        setToken(token);
        setIsAdmin(isAdmin);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        setToken(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                isAdmin,
                isAuthenticated: !!token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
    return context;
};
