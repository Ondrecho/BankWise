'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import LoginForm from '@/features/auth/components/LoginForm';

export default function LoginPage() {
    const { isAuthenticated, isAdmin, initialized } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (initialized && isAuthenticated) {
            router.replace(isAdmin ? '/admin' : '/client');
        }
    }, [initialized, isAuthenticated, isAdmin, router]);

    if (!initialized || isAuthenticated) {
        return null;
    }

    return <LoginForm />;
}
