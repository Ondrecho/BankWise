// app/admin/users/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User, Account } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function UserProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        // Заменить на реальный API
        const fetchUser = async () => {
            const mockUser: User = {
                id: Number(id),
                fullName: "John Doe",
                email: "john@example.com",
                dateOfBirth: "1990-01-01",
                active: true,
                roles: [{ id: 1, name: "Admin" }],
                accounts: [],
            };

            const mockAccounts: Account[] = [
                {
                    iban: "DE1234567890123456",
                    currency: "EUR",
                    balance: 1200.5,
                    status: "ACTIVE",
                    createdAt: "2024-01-01",
                    id: 1,
                    userId: 1
                },
                {
                    iban: "DE9876543210987654",
                    currency: "USD",
                    balance: 300,
                    status: "CLOSED",
                    createdAt: "2023-07-15",
                    id: 2,
                    userId: 2
                },
            ];

            setUser(mockUser);
            setAccounts(mockAccounts);
        };

        fetchUser();
    }, [id]);

    if (!user) return <div>Загрузка...</div>;

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Профиль пользователя</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                    <div>
                        <Label>Полное имя</Label>
                        <Input value={user.fullName} readOnly />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input value={user.email} readOnly />
                    </div>
                    <div>
                        <Label>Дата рождения</Label>
                        <Input value={user.dateOfBirth} readOnly />
                    </div>
                    <div>
                        <Label>Статус</Label>
                        <Badge variant={user.active ? "default" : "destructive"}>
                            {user.active ? "Активен" : "Заблокирован"}
                        </Badge>
                    </div>
                    <div className="col-span-2">
                        <Label>Роли</Label>
                        <div className="flex gap-2 mt-1">
                            {user.roles.map(role => (
                                <Badge key={role.id} variant="secondary">{role.name}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-2 flex justify-end gap-2 mt-4">
                        <Button variant="outline">Редактировать</Button>
                        <Button variant="destructive">Заблокировать</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Банковские счета</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>IBAN</TableHead>
                                <TableHead>Валюта</TableHead>
                                <TableHead>Баланс</TableHead>
                                <TableHead>Статус</TableHead>
                                <TableHead>Создан</TableHead>
                                <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.map(account => (
                                <TableRow key={account.iban}>
                                    <TableCell>{account.iban}</TableCell>
                                    <TableCell>{account.currency}</TableCell>
                                    <TableCell>{account.balance} {account.currency}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                account.status === "ACTIVE" ? "default" : "secondary"
                                            }
                                        >
                                            {account.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{account.createdAt}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="sm" variant="outline">Операции</Button>
                                        <Button size="sm" variant="destructive">Удалить</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-end mt-4">
                        <Button>Открыть новый счёт</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
