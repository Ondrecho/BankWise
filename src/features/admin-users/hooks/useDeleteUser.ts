import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '@/lib/api/userApi';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
