'use server';
import { AdminWrapperLayout } from "@/components/AdminWrapperLayout";
import NextTopLoader from "nextjs-toploader";


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>
       <NextTopLoader
                color="#2299DD"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={true}
                easing="ease"
                speed={200}
                shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            />
        <AdminWrapperLayout>
            {children}
        </AdminWrapperLayout>

    </>;
}






