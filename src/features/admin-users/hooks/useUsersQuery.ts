import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api/userApi';

export function useUsersQuery(page: number, size: number) {
    return useQuery({
        queryKey: ['users', page, size],
        queryFn: () => fetchUsers(page, size),
        placeholderData: (previousData) => previousData,
    });
}