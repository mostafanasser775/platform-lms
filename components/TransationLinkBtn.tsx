'use client'
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
export function TransationLinkBtn({ link, title, color, variant, icon }: {

    link: string,
    title: string,
    variant: "flat" | "solid" | "bordered" | "light" | "faded" | "shadow" | "ghost",
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger",
    icon?: React.ReactNode; // or JSX.Element
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const Linking = async () => startTransition(() => router.push(link))

    return (
        <Button radius="sm" color={color} variant={variant} startContent={icon}
            onPress={Linking} isLoading={isPending}>{!isPending && title}</Button>
    );
}