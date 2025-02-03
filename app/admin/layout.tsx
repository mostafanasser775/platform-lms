'use server';
import { AdminWrapperLayout } from "@/components/AdminWrapperLayout";


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>
        <AdminWrapperLayout>
            {children}
        </AdminWrapperLayout>

    </>;
}
