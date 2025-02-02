'use server';
import { Toaster } from "@/components/ui/toaster";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>
        <NavBar />
        <Toaster />
        {children}
    </>;
}
function NavBar() {
    
    return <header className="flex shadow-md h-12  bg-background z-10">
        <nav className="flex gap-4 container " suppressHydrationWarning>
            <Link className="mr-auto text-lg hover:underline flex items-center" href="/admin">LMS</Link>
            <Suspense>
                <SignedIn>
                    <Link className=" hover:bg-red-200 px-2 flex items-center" href={'/admin/courses'}>My Courses</Link>
                    <Link className="hover:bg-red-200  px-2 flex items-center" href={'/admin/sales'}>Sales</Link>
                    <Link className="hover:bg-red-200  px-2 flex items-center" href={'/admin/products'}>Products</Link>
                    <div className="size-8 self-center">
                        <UserButton appearance={{
                            elements: {
                                userButtonAvatarBox: { width: "100%", height: "100%" }
                            }
                        }} />
                    </div>
                </SignedIn>
            </Suspense>

        </nav>

    </header>
}
