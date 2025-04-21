import ChangePasswordDialog from "@/components/shared/ChangePasswordDialog";

export default function ClientPage() {
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Client Dashboard</h1>
            <p className="mb-6 text-muted-foreground">
                Welcome to your client space.
            </p>

            <ChangePasswordDialog />
        </div>
    );
}
