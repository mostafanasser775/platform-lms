'use server';
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";

export default async function ConsumerLayout({ children }: { children: React.ReactNode }) {
    return <>
        <NavBar />
        {children}
    </>;
}
function NavBar() {
    return <header className="flex shadow-md h-12  bg-background z-10">
        <nav className="flex gap-4 container ">
            <Link className="mr-auto text-lg hover:underline px-2 flex items-center" href="/admin">LMS</Link>
            <Suspense>
                <SignedIn>
                    <AdminLink />
                    <Link className=" hover:bg-red-200 px-2 flex items-center" href={'/courses'}>My Courses</Link>
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
                    <Button className="self-center" asChild>
                        <SignInButton />
                    </Button>
                </SignedOut>
            </Suspense>
        </nav>

    </header>
}
async function AdminLink() {
    const user = await getCurrentUser()
    if(user.role !== 'admin') return null
    return (
        <Link className=" hover:bg-red-200 px-2 flex items-center" href={'/admin'}>Admin Panel</Link>

    )
}