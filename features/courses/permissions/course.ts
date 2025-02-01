import { getCurrentUser } from "@/services/clerk";

export function canCreateCourse(user: Awaited<ReturnType<typeof getCurrentUser>>) {
    return user?.role === "admin";
}
export function candeleteCourse(user: Awaited<ReturnType<typeof getCurrentUser>>) {
    return user?.role === "admin";
}
export function canUpdateCourses(user: Awaited<ReturnType<typeof getCurrentUser>>) {
    return user?.role === "admin";
}