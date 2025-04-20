// src/features/admin-users/components/UserList.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableColumn } from '@/components/shared/DataTable';
import {User} from "@/types";
import { formatRoleLabel } from '@/lib/utils/formatRoleLabel';
import {useState} from "react";
import {cn} from "@/lib/utils/uiUtils";

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
    const [expandedUserIds, setExpandedUserIds] = useState<number[]>([]);
    const toggleExpand = (id: number) =>
        setExpandedUserIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );

    const columns: DataTableColumn<User>[] = [
        {
            header: 'Status',
            accessor: 'active',
            render: (value) => (
                <Badge variant={value ? 'default' : 'destructive'}>
                    {value ? 'active' : 'blocked'}
                </Badge>
            ),
        },
        { header: 'Full Name', accessor: 'fullName' },
        {
            header: 'Email',
            accessor: 'email',
            render: (value) => (
                <div className="whitespace-normal break-words text-sm">{value}</div>
            ),
        },
        {
            header: 'Accounts',
            accessor: 'accounts',
            render: (value) => (
                <div className="text-center">{Array.isArray(value) ? value.length : 0}</div>
            ),
        },
        {
            header: 'Roles',
            accessor: 'roles',
            render: (value, row) => {
                const roles = Array.isArray(value) ? value : [];
                const isExpanded = expandedUserIds.includes(row.id);
                const VISIBLE_COUNT = 2;

                const toShow = isExpanded ? roles : roles.slice(0, VISIBLE_COUNT);

                return (
                    <div
                        onClick={e => e.stopPropagation()}
                        className="flex flex-wrap gap-1"
                    >
                        {toShow.map(role => (
                            <Badge
                                key={role.id}
                                variant="secondary"
                                className="px-2 py-0.5 text-xs whitespace-nowrap"
                            >
                                {formatRoleLabel(role)}
                            </Badge>
                        ))}

                        {!isExpanded && roles.length > VISIBLE_COUNT && (
                            <Badge
                                variant="outline"
                                className="px-2 py-0.5 text-xs cursor-pointer"
                                onClick={() => toggleExpand(row.id)}
                            >
                                +{roles.length - VISIBLE_COUNT}
                            </Badge>
                        )}

                        {isExpanded && roles.length > VISIBLE_COUNT && (
                            <Badge
                                variant="outline"
                                className="px-2 py-0.5 text-xs cursor-pointer"
                                onClick={() => toggleExpand(row.id)}
                            >
                                Hide
                            </Badge>
                        )}
                    </div>
                );
            },
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
