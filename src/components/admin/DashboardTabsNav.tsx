'use client';

import { usePathname, useRouter } from 'next/navigation';
import { UsersIcon, ShieldIcon, FileTextIcon, BarChartIcon } from '@/components/icons';
import clsx from 'clsx';

const items = [
    { href: '/admin/users', label: 'Users', icon: UsersIcon },
    { href: '/admin/roles', label: 'Roles', icon: ShieldIcon },
    { href: '/admin/logs', label: 'Logs', icon: FileTextIcon },
    { href: '/admin/stats', label: 'Stats', icon: BarChartIcon },
];

export const DashboardTabsNav = () => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="w-20 bg-white border-r shadow-sm flex flex-col items-center pt-24 pb-4 space-y-6">
            {items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href);

                return (
                    <button
                        key={href}
                        onClick={() => router.push(href)}
                        className={clsx(
                            'flex flex-col items-center text-xs gap-1',
                            'text-gray-500 hover:text-black transition-colors',
                            isActive && 'text-green-500'
                        )}
                    >
                        <Icon className="w-6 h-6" />
                        <span>{label}</span>
                    </button>
                );
            })}
        </aside>
    );
};
