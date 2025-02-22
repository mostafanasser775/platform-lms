'use client'
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
export function TransationLinkBtn({ link, title, color, variant }: { 
    link: string, 
    title: string, 
    variant: "flat" | "solid" | "bordered" | "light" | "faded" | "shadow" | "ghost", 
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" 
  }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const Linking = async () => startTransition(() => router.push(link))

    return (
        <Button radius="sm" color={color} variant={variant}
            onPress={Linking} isLoading={isPending}>{!isPending && title}</Button>
    );
}