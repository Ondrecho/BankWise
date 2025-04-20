// src/features/admin-users/hooks/useToggleAccountStatus.ts
import { useMutation } from '@tanstack/react-query';
import { toggleAccountStatus } from '@/lib/api/accountApi';

export function useToggleAccountStatus() {
    return useMutation({
        mutationFn: ({ iban, status }: { iban: string; status: 'open' | 'close' }) =>
            toggleAccountStatus(iban, status),
    });
}
