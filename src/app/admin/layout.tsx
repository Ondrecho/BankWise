'use client';

import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { BarChartIcon, FileTextIcon, ShieldIcon, UsersIcon } from '@/components/icons';

const routes = [
    { value: 'users', label: 'User Management', icon: UsersIcon },
    { value: 'roles', label: 'Role Management', icon: ShieldIcon },
    { value: 'logs', label: 'Logs', icon: FileTextIcon },
    { value: 'stats', label: 'Statistics', icon: BarChartIcon },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        if (pathname.includes('/users')) setActiveTab('users');
        else if (pathname.includes('/roles')) setActiveTab('roles');
        else if (pathname.includes('/logs')) setActiveTab('logs');
        else if (pathname.includes('/stats')) setActiveTab('stats');
    }, [pathname]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.push(`/admin/${value}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <DashboardHeader onLogoutAction={() => {
                localStorage.removeItem('credentials');
                router.push('/auth/login');
            }} />

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full border-b bg-white shadow-sm">
                <TabsList className="container flex w-full max-w-6xl mx-auto px-4 gap-1 bg-transparent h-14">
                    {routes.map(({ value, label, icon: Icon }) => (
                        <TabsTrigger
                            key={value}
                            value={value}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <main className="flex-1 w-full px-4 py-6">
                <div className="container max-w-6xl mx-auto">
                    <div className="bg-white border rounded-2xl shadow-sm p-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
