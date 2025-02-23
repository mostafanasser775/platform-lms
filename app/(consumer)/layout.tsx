'use server';
import NavBar from "@/components/DefaultNavbar";
import { Providers } from "@/lib/Providers";

import NextTopLoader from 'nextjs-toploader';

export default async function ConsumerLayout({ children }: { children: React.ReactNode }) {
    return <>
        <Providers>
            <NextTopLoader
                color="#2299DD"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                easing="ease"
                speed={200}
                shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            />
            <NavBar />
            {children}
        </Providers>




    </>;
}
