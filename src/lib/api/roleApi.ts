import { fetchWithAuth } from './fetcher';
import {Role} from "@/types";

export async function fetchRoles(): Promise<Role[]> {
    const res = await fetchWithAuth('http://localhost:8080/api/roles');
    if (!res.ok) throw new Error('Failed to load roles');
    return res.json();
}
