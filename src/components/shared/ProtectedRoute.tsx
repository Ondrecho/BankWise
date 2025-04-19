'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/auth/login');
        } else {
            setChecked(true);
        }
    }, [isAuthenticated]);

    if (!checked) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Checking authentication...
            </div>
        );
    }

    return <>{children}</>;
}
