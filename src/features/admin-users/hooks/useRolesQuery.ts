import { useQuery } from '@tanstack/react-query';
import { fetchRoles } from '@/lib/api/roleApi';

export function useRolesQuery() {
    return useQuery({
        queryKey: ['roles'],
        queryFn: fetchRoles,
    });
}
