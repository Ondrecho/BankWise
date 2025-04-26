'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';

export const DashboardHeader = () => {
    const {logout} = useAuth();
    const router = useRouter();
    return (
        <header className="sticky top-0 z-20 bg-white shadow-sm">
            <div className="container flex items-center justify-between h-16 px-24 mx-auto">
                <a href="/admin" className="text-3xl font-bold text-gray-800 hover:underline">
                    Admin Dashboard
                </a> <Button
                variant="outline"
                onClick={() => {
                    logout();
                    router.push('/auth/login');
                }}
                className="text-gray-600 hover:bg-gray-300 hover:text-gray-900"
            >
                Logout
            </Button>
            </div>
        </header>
    );
}