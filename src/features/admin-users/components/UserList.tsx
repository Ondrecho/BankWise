// src/features/admin-users/components/UserList.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableColumn } from '@/components/shared/DataTable';
import {User} from "@/types";
import { formatRoleLabel } from '@/lib/utils/formatRoleLabel';

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
            render: (value) =>
                <div className="w-full text-center">
                    {Array.isArray(value) ? value.length : 0}
                </div>,
        },
        {
            header: 'Roles',
            accessor: 'roles',
            render: (value) =>
                Array.isArray(value) ? (
                    <div className="flex flex-wrap gap-1 max-w-[200px] truncate">
                        {value.map((role) => (
                            <Badge
                                key={role.id}
                                variant="secondary"
                                className="px-2 py-0.5 text-xs whitespace-nowrap"
                            >
                                {formatRoleLabel(role)}
                            </Badge>
                        ))}
                    </div>
                ) : null,
        },
    ];

    return (
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
    );
};