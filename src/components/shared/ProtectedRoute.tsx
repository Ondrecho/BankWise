'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, initialized } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (initialized && !isAuthenticated) {
            router.replace('/auth/login');
        }
    }, [initialized, isAuthenticated]);

    if (!initialized) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Checking authentication...
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return <>{children}</>;
}