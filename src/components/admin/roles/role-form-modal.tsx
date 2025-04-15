import { Role } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useEffect, useState} from "react";

interface RoleFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role?: Role;
    onCreate: (name: string) => Promise<boolean>;
    onUpdate: (id: number, name: string) => Promise<boolean>;
}

export function RoleFormModal({
                                  open,
                                  onOpenChange,
                                  role,
                                  onCreate,
                                  onUpdate
                              }: RoleFormModalProps) {
    const [name, setName] = useState(role?.name || "");

    useEffect(() => {
        setName(role?.name || "");
    }, [role]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = role
            ? await onUpdate(role.id, name)
            : await onCreate(name);
        if (success) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{role ? "Edit Role" : "Create New Role"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            required
                        />
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
                            {role ? "Save Changes" : "Create Role"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}