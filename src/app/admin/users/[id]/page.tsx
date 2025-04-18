'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function UserRedirectPage() {
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        router.replace(`/admin/users/${id}/info`);
    }, [id, router]);

    return null;
}
