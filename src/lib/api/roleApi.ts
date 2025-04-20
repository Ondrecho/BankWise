import { fetchWithAuth } from './fetcher';
import {Role} from "@/types";

const API_URL = 'http://localhost:8080/api';

export async function fetchRoles(): Promise<Role[]> {
    const res = await fetchWithAuth(`${API_URL}/roles`);
    if (!res.ok) throw new Error('Failed to load roles');
    return res.json();
}


export async function createRole(name: string): Promise<void> {
    const res = await fetchWithAuth(`${API_URL}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `ROLE_${name.toUpperCase()}` }),
    });
    if (!res.ok) throw new Error('Failed to create role');
}

export async function updateRole(id: number, name: string): Promise<void> {
    const res = await fetchWithAuth(`${API_URL}/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `ROLE_${name.toUpperCase()}` }),
    });
    if (!res.ok) throw new Error('Failed to update role');
}

export async function deleteRole(id: number): Promise<void> {
    const res = await fetchWithAuth(`${API_URL}/roles/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete role');
}