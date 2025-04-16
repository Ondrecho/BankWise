// components/admin/users-management.tsx

import { useState, useEffect } from "react";
import { User, Role } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UserFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User;
    roles: Role[];
    onCreate: (userData: Omit<User, "id"> & { password: string }) => Promise<boolean>;
    onUpdate: (id: number, userData: Partial<User>) => Promise<boolean>;
}

export function UserFormModal({
                                  open,
                                  onOpenChange,
                                  user,
                                  roles,
                                  onCreate,
                                  onUpdate
                              }: UserFormModalProps) {
    const [formData, setFormData] = useState<Omit<User, "id"> & { password: string }>({
        fullName: "",
        email: "",
        dateOfBirth: "",
        password: "",
        active: true,
        roles: [],
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                password: "",
                active: user.active,
                roles: user.roles,
            });
        } else {
            setFormData({
                fullName: "",
                email: "",
                dateOfBirth: "",
                password: "",
                active: true,
                roles: [],
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = user
            ? await onUpdate(user.id, formData)
            : await onCreate(formData);
        if (success) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fullName" className="text-right">
                            Full Name
                        </Label>
                        <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="col-span-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="col-span-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dateOfBirth" className="text-right">
                            Date of Birth
                        </Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                            className="col-span-3"
                            required
                        />
                    </div>

                    {!user && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="col-span-3"
                                required
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="roles" className="text-right">
                            Roles
                        </Label>
                        <Select
                            value={formData.roles[0]?.name || ""}
                            onValueChange={(value) => {
                                const selectedRole = roles.find(r => r.name === value);
                                if (selectedRole) {
                                    setFormData({...formData, roles: [selectedRole]});
                                }
                            }}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.name}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {user ? "Save Changes" : "Create User"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}