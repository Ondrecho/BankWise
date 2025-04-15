import { AccountsManagement  } from "@/components/admin/users/user-accounts";

export default function UserAccountsPage({ params }: { params: { id: string } }) {
    return <AccountsManagement userId={parseInt(params.id)} />;
}