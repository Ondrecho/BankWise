'use client';

import { useUsersQuery } from '@/features/admin-users/hooks/useUsersQuery';
import { useDeleteUser } from '@/features/admin-users/hooks/useDeleteUser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserList } from '@/features/admin-users/components/UserList';
import { Button } from '@/components/ui/button';
import {useAuth} from "@/context/auth-context";
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import {User} from "@/types";

export default function UsersPage() {
    const [page, setPage] = useState(0);
    const size = 10;
    const { data, isLoading, isError } = useUsersQuery(page, size);
    const deleteMutation = useDeleteUser();
    const router = useRouter();
    const auth = useAuth();
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    if (isLoading) return <div className="p-6 text-gray-500">Loading users...</div>;
    if (isError || !data) return <div className="p-6 text-red-600">Failed to load users.</div>;

    const handleDelete = (user: User) => {
        setUserToDelete(user);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            deleteMutation.mutate(userToDelete.id);
            setUserToDelete(null);
        }
    };

    const handleSelect = (user: { id: number }) => {
        router.push(`/admin/users/${user.id}/info`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">User Management</h1>
                <Button onClick={() => router.push('/admin/users/new')}>Create New User</Button>
            </div>

            <div className="bg-white border rounded-xl p-4 shadow-sm max-h-[600px] overflow-y-auto">
                <UserList
                    users={data.content}
                    onSelect={handleSelect}
                    onDelete={handleDelete}
                    currentEmail={auth.currentEmail}
                />

                <ConfirmDialog
                    open={!!userToDelete}
                    title="Delete User"
                    description={`Are you sure you want to delete ${userToDelete?.fullName}?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setUserToDelete(null)}
                />
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
                {/* Левая стрелка */}
                <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                >
                    <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
                </button>

                <span className="text-sm text-gray-600">
    Page {data.number + 1} of {data.totalPages}
  </span>

                <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
                    disabled={data.last}
                    onClick={() => setPage((p) => p + 1)}
                >
                    <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                </button>
            </div>


        </div>
    );
}
