'use client';
import { User } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {Button} from "@/components/ui/button";

export const UserList = ({
                             users,
                             onSelectAction,
                             onDeleteAction
                         }: {
    users: User[];
    onSelectAction: (user: User) => void;
    onDeleteAction: (user: User) => void;
}) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="pl-0">Status</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Accounts</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="pr-0">Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {users.map((user) => (
                <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onSelectAction(user)}
                >
                    <TableCell className="pl-0">
                        <Badge variant={user.active ? "default" : "destructive"}>
                            {user.active ? "active" : "blocked"}
                        </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.accounts?.length || 0}</TableCell>
                    <TableCell className="pr-0">
                        <div className="inline-flex flex-wrap gap-1">
                            {user.roles?.map((role) => (
                                <Badge
                                    key={role.id}
                                    variant="secondary"
                                    className="px-2 py-0.5 text-xs"
                                >
                                    {role.description || role.name}
                                </Badge>
                            ))}
                        </div>
                    </TableCell>
                    <TableCell className="pr-0">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteAction(user);
                            }}
                        >
                            Delete
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);