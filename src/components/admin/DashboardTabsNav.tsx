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
        <aside className="w-20 h-screen fixed left-0 bg-white border-r shadow-sm pt-4 z-20">
            <div className="flex flex-col items-center justify-start h-full gap-8 mt-24">
                {items.map(({href, label, icon: Icon}) => {
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
                            <Icon className="w-6 h-6"/>
                            <span>{label}</span>
                        </button>
                    );
                })}
            </div>
        </aside>
);
};
