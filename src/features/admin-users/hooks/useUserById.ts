import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from '@/lib/api/userApi';

export function useUserById(id: number) {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => fetchUserById(id),
        enabled: !!id,
    });
}
