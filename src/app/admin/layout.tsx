'use client';

import { ReactNode } from 'react';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { DashboardTabsNav } from '@/components/admin/DashboardTabsNav';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardTabsNav />
            <div className="flex flex-col flex-1">
                <DashboardHeader onLogoutAction={() => {
                    localStorage.removeItem('credentials');
                    window.location.href = '/auth/login';
                }} />
                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto bg-white border rounded-2xl shadow-sm p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
