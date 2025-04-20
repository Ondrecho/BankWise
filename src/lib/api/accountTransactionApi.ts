import {fetchWithAuth} from "@/lib/api/fetcher";

const API_URL = 'http://localhost:8080/api';

export async function transfer(fromIban: string, toIban: string, currency: string, amount: number) {
    return fetchWithAuth(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            transactionType: 'TRANSFER',
            fromIban,
            toIban,
            currency,
            amount,
        }),
    });
}

export async function deposit(iban: string, currency: string, amount: number) {
    return fetchWithAuth(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            transactionType: 'DEPOSIT',
            iban,
            currency,
            amount,
        }),
    });
}

export async function withdraw(iban: string, currency: string, amount: number) {
    return fetchWithAuth(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            transactionType: 'WITHDRAWAL',
            iban,
            currency,
            amount,
        }),
    });
}
