'use server';
import { Providers } from "@/lib/Providers";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";

export default async function ConsumerLayout({ children }: { children: React.ReactNode }) {
    return <>
        <Providers>
            <NavBar />
            {children}
        </Providers>




    </>;
}
function NavBar() {
    return <header className="flex shadow-md h-12  bg-background z-10">
        <nav className="flex gap-4 container ">
            <Link className="mr-auto text-lg hover:underline px-2 flex items-center" href="/">LMS</Link>
            <Suspense fallback={<div>...</div>}>
                <SignedIn>
                    <AdminLink />
                    <Link className=" hover:bg-red-200 px-2 flex items-center" href={'/courses'}>Courses</Link>
                    <Link className="hover:bg-red-200  px-2 flex items-center" href={'/purchases'}>Purchase History</Link>
                    <div className="size-8 self-center">
                        <UserButton appearance={{
                            elements: {
                                userButtonAvatarBox: { width: "100%", height: "100%" }
                            }
                        }} />
                    </div>
                </SignedIn>
            </Suspense>
            <Suspense>
                <SignedOut>
                    <div className="border rounded-medium self-center py-2 px-3 ">
                        <SignInButton />

                    </div>
                </SignedOut>
            </Suspense>
        </nav>

    </header>
}
async function AdminLink() {
    const user = await getCurrentUser()
    if (user.role !== 'admin') return null
    return (
        <Link className=" hover:bg-red-200 px-2 flex items-center" href={'/admin'}>Admin Panel</Link>

    )
}