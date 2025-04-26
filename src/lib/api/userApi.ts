import { fetchWithAuth } from '@/lib/api/fetcher';
import {User} from "@/types";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

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
    const res = await fetchWithAuth(`${API_URL}/admin/users?page=${page}&size=${size}`);

    if (!res.ok) {
        throw new Error('Failed to load users');
    }

    return res.json();
}

export async function fetchUserById(id: number): Promise<User> {
    const res = await fetchWithAuth(`${API_URL}/admin/users/${id}`);
    if (!res.ok) throw new Error('Failed to load user');
    return res.json();
}

export async function updateUser(user: User): Promise<User> {
    const res = await fetchWithAuth(`${API_URL}/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });

    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
}

export async function createUser(user: User & { password: string }) {
    const res = await fetchWithAuth(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...user,
            roles: user.roles.map((r) => ({ name: r.name })),
        }),
    });

    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
}


export async function deleteUser(id: number) {
    const res = await fetchWithAuth(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error('Failed to delete user');
    }

    return true;
}