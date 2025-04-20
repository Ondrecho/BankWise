// src/features/admin-users/hooks/useUserAccounts.ts
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {createAccount, getUserAccounts} from '@/lib/api/accountApi';
import {Account} from "@/types";

export function useUserAccounts(userId: number) {
    const queryClient = useQueryClient();

    const accountsQuery = useQuery<Account[]>({
        queryKey: ['accounts', userId],
        queryFn: () => getUserAccounts(userId),
        enabled: !!userId,
    });

    const createMutation = useMutation({
        mutationFn: (currency: string) => createAccount(userId, currency),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts', userId] });
        },
    });

    return {
        accounts: accountsQuery.data ?? [],
        isLoading: accountsQuery.isLoading,
        error: accountsQuery.error,
        createAccount: createMutation.mutate,
        isCreating: createMutation.isPending,
        refetch: accountsQuery.refetch
    };

}
