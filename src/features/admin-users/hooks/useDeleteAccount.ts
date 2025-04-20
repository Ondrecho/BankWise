// src/features/admin-users/hooks/useDeleteAccount.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAccount } from '@/lib/api/accountApi';

export function useDeleteAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, iban }: { userId: number; iban: string }) =>
            deleteAccount(userId, iban),
        onSuccess: (_, { userId }) => {
            queryClient.invalidateQueries({ queryKey: ['accounts', userId] });
        },
    });
}
