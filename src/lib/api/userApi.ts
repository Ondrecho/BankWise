import { fetchWithAuth } from '@/lib/api/fetcher';

export interface User {
    id: number;
    fullName: string;
    email: string;
    dateOfBirth: string;
    active: boolean;
    roles: { id: number; name: string }[];
    accounts: any[];
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}


export async function fetchUsers(page = 0, size = 10): Promise<PaginatedResponse<User>> {
    const res = await fetchWithAuth(`http://localhost:8080/api/admin/users?page=${page}&size=${size}`);

    if (!res.ok) {
        throw new Error('Failed to load users');
    }

    return res.json();
}
