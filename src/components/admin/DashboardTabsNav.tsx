'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChartIcon, FileTextIcon, ShieldIcon, UsersIcon } from '@/components/icons';

export function DashboardTabsNav() {
    const router = useRouter();
    const pathname = usePathname();

    const tabMap: Record<string, string> = {
        '/admin/users': 'users',
        '/admin/roles': 'roles',
        '/admin/logs': 'logs',
        '/admin/stats': 'stats',
    };

    const current = Object.keys(tabMap).find(key => pathname.startsWith(key)) || '/admin/users';

    return (
        <div className="bg-white shadow-sm">
            <div className="max-w mx-auto px-4">
                <Tabs value={tabMap[current]} className="w-full">
                    <TabsList className="h-auto w-full grid grid-cols-4 bg-transparent px-0 gap-1">
                        <TabsTrigger
                            value="users"
                            onClick={() => router.push('/admin/users')}
                            className="py-3 px-4 rounded-t-lg border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                        >
              <span className="flex items-center">
                <UsersIcon className="h-4 w-4 mr-2" />
                User Management
              </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="roles"
                            onClick={() => router.push('/admin/roles')}
                            className="py-3 px-4 rounded-t-lg border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                        >
              <span className="flex items-center">
                <ShieldIcon className="h-4 w-4 mr-2" />
                Role Management
              </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="logs"
                            onClick={() => router.push('/admin/logs')}
                            className="py-3 px-4 rounded-t-lg border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                        >
              <span className="flex items-center">
                <FileTextIcon className="h-4 w-4 mr-2" />
                Logs
              </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="stats"
                            onClick={() => router.push('/admin/stats')}
                            className="py-3 px-4 rounded-t-lg border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                        >
              <span className="flex items-center">
                <BarChartIcon className="h-4 w-4 mr-2" />
                Statistics
              </span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
}
