'use client';

import { useUsersQuery } from '@/features/admin-users/hooks/useUsersQuery';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
    const [page, setPage] = useState(0);
    const size = 10;
    const { data, isLoading, isError } = useUsersQuery(page, size);
    const router = useRouter();

    const handleSelectUser = (id: number) => {
        router.push(`/admin/users/${id}/info`);
    };

    if (isLoading) return <div className="p-6 text-gray-500">Loading users...</div>;
    if (isError || !data) return <div className="p-6 text-red-600">Failed to load users.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">User Management</h1>
                <Button onClick={() => router.push('/admin/users/new')}>Create New User</Button>
            </div>

            <ul className="border rounded-lg divide-y bg-white shadow-sm">
                {data.content.map((user) => (
                    <li
                        key={user.id}
                        className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectUser(user.id)}
                    >
                        <div>
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <span className="text-sm text-gray-600">{user.roles.map((r) => r.name).join(', ')}</span>
                    </li>
                ))}
            </ul>

            <div className="flex justify-between items-center pt-4">
                <Button variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                    Previous
                </Button>
                <span className="text-sm text-gray-600">
          Page {data.number + 1} of {data.totalPages}
        </span>
                <Button variant="outline" disabled={data.last} onClick={() => setPage((p) => p + 1)}>
                    Next
                </Button>
            </div>
        </div>
    );
}
