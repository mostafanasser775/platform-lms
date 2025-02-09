'use client'
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode, Suspense, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BookOpen, LayoutDashboard, Menu, Package, ShoppingBag, X, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
export function AdminWrapperLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex">
            {/* Sidebar Container */}
            <Sidebar />

            {/* Main Content Area */}

            <div className="w-full h-full min-h-screen overflow-auto">
                <Toaster />
                <NavBar /> 
                {children}</div>
        </div>
    );
}

function NavBar() {
    return (
        <header className="flex w-full h-14 border-b z-10 bg-white">
            <nav className="flex gap-4 container items-center px-4" suppressHydrationWarning>
                <Suspense>
                    <SignedIn>
                        <div className="size-8 self-center ml-auto mr-4">
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
    );
}

const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'My Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Sales', href: '/admin/sales', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <aside className={cn(
            "bg-gray-100 min-h-screen  flex flex-col transition-all duration-300 border-r overflow-auto",
            isOpen ? "w-72" : "w-20"
        )}>
            {/* Sidebar Header */}
            <div className="border-b p-4 flex items-center justify-between border-gray-300">
                {isOpen && <Link href="/admin" className="font-bold text-xl hidden md:block">EduNexus</Link>}
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md focus:outline-none">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Menu */}
            <SignedIn>
                <nav className="flex flex-col gap-3 mt-4 p-4">
                    {menuItems.map(({ name, href, icon: Icon }) => (
                        <Link key={href} href={href} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-300 transition-all">
                            <Icon size={24} />
                            <span className={cn("transition-all", isOpen ? "block" : "hidden")}>{name}</span>
                        </Link>
                    ))}
                </nav>
            </SignedIn>

            {/* Back Button */}
            <Button className="mt-auto p-4 rounded-none w-full" variant="outline" asChild>
                <Link href="/">Back</Link>
            </Button>
        </aside>
    );
}

export default Sidebar;
