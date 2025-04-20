export type User = {
    id: number;
    fullName: string;
    email: string;
    dateOfBirth: string;
    active: boolean;
    roles: Role[];
    accounts?: Account[];
}

export type CreateUserDto = {
    fullName: string;
    email: string;
    dateOfBirth: string;
    password: string;
    roles: { name: string }[];
}

export type Role = {
    id: number;
    name: string;
    description?: string;
    usersCount?: number;
}

export type Account = {
    createdAt: string;
    id: number;
    iban: string;
    balance: number;
    currency: string;
    status: 'ACTIVE' | 'CLOSED';
    userId: number;
}

export type PageStat = {
    url: string;
    visits: number;
}