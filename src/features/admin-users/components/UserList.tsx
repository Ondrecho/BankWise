// src/features/admin-users/components/UserList.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableColumn } from '@/components/shared/DataTable';
import {User} from "@/types";

export const UserList = ({
                             users,
                             onSelect,
                             onDelete,
                             currentEmail,
                         }: {
    users: User[];
    onSelect: (user: User) => void;
    onDelete: (user: User) => void;
    currentEmail?: string | null;
}) => {
    const columns: DataTableColumn<User>[] = [
        {
            header: 'Status',
            accessor: 'active',
            render: (value, row) => (
                <Badge variant={value ? 'default' : 'destructive'}>
                    {value ? 'active' : 'blocked'}
                </Badge>
            ),
        },
        { header: 'Full Name', accessor: 'fullName' },
        { header: 'Email', accessor: 'email' },
        {
            header: 'Accounts',
            accessor: 'accounts',
            render: (value) => (Array.isArray(value) ? value.length : 0),       },
        {
            header: 'Roles',
            accessor: 'roles',
            render: (value) =>
                Array.isArray(value) ? (
                    <div className="inline-flex flex-wrap gap-1">
                        {value.map((role) => (
                            <Badge key={role.id} variant="secondary" className="px-2 py-0.5 text-xs">
                                {role.description || role.name}
                            </Badge>
                        ))}
                    </div>
                ) : null,
        },
    ];

    return (
        <div className="overflow-y-auto max-h-[500px]">
            <DataTable<User>
                data={users}
                columns={columns}
                onRowClick={onSelect}
                actions={(user) => (
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={user.email === currentEmail}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(user);
                        }}
                    >
                        Delete
                    </Button>
                )}
            />
        </div>
    );
};