import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/lib/api/authApi';

export function useRegister() {
    return useMutation({
        mutationFn: (input: {
            email: string;
            password: string;
            fullName: string;
            dateOfBirth: string;
        }) => registerUser(input),
    });
}
