// components/admin/users/UserList.tsx

import { useRouter } from "next/navigation";
import { User } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Wallet } from "lucide-react";

interface UserListProps {
    users: User[];
    onDelete: (id: number) => void;
}

export function UserList({ users, onDelete }: UserListProps) {
    const router = useRouter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Accounts</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="text-right">Delete</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow
                        key={user.id}
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                    >
                        <TableCell>
                            {user.active ? (
                                <Badge className="bg-green-500">
                                    <UserCheck className="h-4 w-4 mr-1" /> Active
                                </Badge>
                            ) : (
                                <Badge variant="destructive">
                                    <UserX className="h-4 w-4 mr-1" /> Inactive
                                </Badge>
                            )}
                        </TableCell>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <div className="flex items-center">
                                <Wallet className="h-4 w-4 mr-1" />
                                {user.accounts?.length || 0}
                            </div>
                        </TableCell>
                        <TableCell>
                            {user.roles.map((role) => (
                                <Badge key={role.id} variant="secondary" className="mr-1">
                                    {role.name}
                                </Badge>
                            ))}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(user.id);
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
}
