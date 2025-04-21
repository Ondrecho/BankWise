'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    token: string | null;
    isAdmin: boolean;
    currentEmail: string | null;
    isAuthenticated: boolean;
    initialized: boolean;
    login: (token: string, isAdmin: boolean, email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentEmail, setCurrentEmail] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedAdmin = localStorage.getItem('isAdmin') === 'true';
        const savedEmail = localStorage.getItem('email');

        if (savedToken) {
            setToken(savedToken);
            setIsAdmin(savedAdmin);
            setCurrentEmail(savedEmail);
        }
        setInitialized(true);
    }, []);

    const login = (token: string, isAdmin: boolean, email: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('isAdmin', String(isAdmin));
        localStorage.setItem('email', email);
        setToken(token);
        setIsAdmin(isAdmin);
        setCurrentEmail(email);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('email');
        setToken(null);
        setIsAdmin(false);
        setCurrentEmail(null);
    };
    return (
        <AuthContext.Provider
            value={{
                token,
                isAdmin,
                isAuthenticated: !!token,
                currentEmail,
                initialized,
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
