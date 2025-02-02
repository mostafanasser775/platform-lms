import { getCurrentUser } from "@/services/clerk";

export function canCreateSection(user: Awaited<ReturnType<typeof getCurrentUser>>) {
    return user?.role === "admin";
}
export function canUpdateSection(user: Awaited<ReturnType<typeof getCurrentUser>>) {
    return user?.role === "admin";
}
export function canDeleteSection(user: Awaited<ReturnType<typeof getCurrentUser>>) {
    return user?.role === "admin";
}