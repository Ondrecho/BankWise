'use client';

import { User, Role } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Card, CardContent } from '@/components/ui/card';
import {Button} from "@/components/ui/button";

interface UserFormProps {
    user: User;
    roles: Role[];
    onChangeAction: (user: User) => void;
}

export const UserForm = ({
                             user,
                             roles,
                             onChangeAction,
                         }: UserFormProps) => {
    const roleOptions = roles.map(role => ({
        value: role.id.toString(),
        label: role.description || role.name,
    }));

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                value={user.fullName}
                                onChange={(e) =>
                                    onChangeAction({ ...user, fullName: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={user.email}
                                onChange={(e) =>
                                    onChangeAction({ ...user, email: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                value={user.dateOfBirth}
                                onChange={(e) =>
                                    onChangeAction({ ...user, dateOfBirth: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Button
                                variant={user.active ? 'default' : 'destructive'}
                                className="w-full"
                                onClick={() => onChangeAction({...user, active: !user.active})}
                            >
                                {user.active
                                    ? 'Active'
                                    : 'Blocked'}
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="roles">Roles</Label>
                            <MultiSelect
                                options={roleOptions}
                                selected={
                                    user.roles?.map(role => ({
                                        value: role.id.toString(),
                                        label: role.description || role.name,
                                    })) || []
                                }
                                onChangeAction={(selected) => {
                                    const selectedRoles = roles.filter(role =>
                                        selected.some(s => s.value === role.id.toString())
                                    );
                                    onChangeAction({...user, roles: selectedRoles});
                                }}
                                placeholder="Select roles..."
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
