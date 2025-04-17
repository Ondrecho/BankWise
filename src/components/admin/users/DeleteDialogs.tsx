'use client';
import { User, Account } from '@/types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteUserDialogProps {
    user: User | null;
    open: boolean;
    onConfirmAction: () => void;
    onCancelAction: () => void;
}

export function DeleteUserDialog({
                                     user,
                                     open,
                                     onConfirmAction,
                                     onCancelAction
                                 }: DeleteUserDialogProps) {
    if (!user) return null;

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete user "{user.fullName}"? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancelAction}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirmAction}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

interface DeleteAccountDialogProps {
    account: Account | null;
    open: boolean;
    onConfirmAction: () => void;
    onCancelAction: () => void;
}

export function DeleteAccountDialog({
                                        account,
                                        open,
                                        onConfirmAction,
                                        onCancelAction
                                    }: DeleteAccountDialogProps) {
    if (!account) return null;

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete account "{account.iban}"? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancelAction}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirmAction}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}