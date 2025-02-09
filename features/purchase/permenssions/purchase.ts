import { getCurrentUser } from "@/services/clerk";

export function canrefundPurchase(user: Awaited<ReturnType<typeof getCurrentUser>>) {
    return user?.role === "admin";
}