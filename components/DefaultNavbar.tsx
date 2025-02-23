import Image from "next/image";

async function AdminLink() {
    const user = await getCurrentUser()
    if (user.role !== 'admin') return null
    return (
        <Button variant="light" as={Link} href={'/admin'}>Dashboard</Button>
    )
}

import { Navbar, NavbarBrand, NavbarContent } from "@heroui/navbar";
import { getCurrentUser } from "@/services/clerk"
import Link from "next/link";
import { Suspense } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@heroui/button";

export const LMSLOGO = () => {
    return (
        <Button variant="light" as={Link} href="/">
            <div className="max-h-12 h-12 w-36 flex items-center pointer-events-none 2xl:ml-4">
                <Image alt="logo" src='/images/logo.webp' width={512} height={125} />
            </div>
        </Button>

    );
};



export default function NavBar() {
    return (
        <Navbar maxWidth={'2xl'} className="shadow-md">
            <NavbarContent justify="start" className="items-center">
                <NavbarBrand >
                    <LMSLOGO />
                </NavbarBrand>

            </NavbarContent>


            <NavbarContent as="div" >
                <NavbarContent className=" hidden sm:flex gap-3 items-center" justify="center">
                    <Suspense fallback={<div>...</div>}>
                        <SignedIn>
                            <AdminLink />
                            <Button variant="light" as={Link} href={'/products'}>Courses</Button>
                            <Button variant="light" as={Link} href={'/courses'}>My Learning</Button>
                            <Button variant="light" as={Link} href={'/purchases'}>My Purchases</Button>
                        </SignedIn>
                    </Suspense>
                </NavbarContent>
            </NavbarContent>


            <NavbarContent as="div" className="items-center" justify="end">
                <div className="size-8 self-center">
                    <UserButton appearance={{ elements: { userButtonAvatarBox: { width: "100%", height: "100%" } } }} />
                </div>
                <Suspense>
                    <SignedOut>
                        <div className="border rounded-medium self-center py-2 px-3 bg-gray-950 text-white">
                            <SignInButton />
                        </div>
                    </SignedOut>
                </Suspense>
            </NavbarContent>
        </Navbar>
    );
}
