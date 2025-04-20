// src/lib/api/accountApi.ts
import { fetchWithAuth } from '@/lib/api/fetcher';
import {Account} from "@/types";

const API_URL = 'http://localhost:8080/api';

export async function getUserAccounts(userId: number): Promise<Account[]> {
    const res = await fetchWithAuth(`${API_URL}/admin/users/${userId}/accounts`);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch accounts');
    }
    return res.json();
}

export async function createAccount(userId: number, currency: string): Promise<Account> {
    const res = await fetchWithAuth(`${API_URL}/admin/users/${userId}/accounts?currency=${currency}`, {
        method: 'POST',
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create account');
    }
    return res.json();
}

export async function deleteAccount(userId: number, iban: string): Promise<void> {
    const res = await fetchWithAuth(`${API_URL}/accounts/${iban}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete account');
    }
}

export async function toggleAccountStatus(
    iban: string,
    status: 'open' | 'close'
): Promise<void> {
    const res = await fetchWithAuth(`${API_URL}/accounts/${iban}/${status}`, {
        method: 'PATCH',
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to toggle account status');
    }
}
