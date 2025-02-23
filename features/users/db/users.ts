'use server'
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function insertUser(data: typeof UserTable.$inferInsert) {
    const [newUser] = await db.insert(UserTable).values(data).returning().onConflictDoUpdate({
        target: UserTable.clerkUserId,
        set: data
    });
    if (newUser) {
        return newUser
    }
    throw new Error("can not create user");
}

export async function updateUser({ clerkUserId }: { clerkUserId: string }, data: Partial<typeof UserTable.$inferInsert>) {
    const [updatedUser] = await db.update(UserTable)
        .set(data)
        .where(eq(UserTable.clerkUserId, clerkUserId))
        .returning()

    if (updatedUser) {
        return updatedUser
    }
    throw new Error("can not update user");
}


export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
    const [deletedUser] = await db.update(UserTable)
        .set({
            deletedAt: new Date(),
            email: "deleted@email.com",
            name: "deleted",
            clerkUserId: 'deleted',
            imageUrl: null
        })
        .where(eq(UserTable.clerkUserId, clerkUserId))
        .returning()

    if (deletedUser) {
        return deletedUser
    }
    throw new Error("can not delete user");
}
export async function deleteuserAction(clerkUserId: string) {
    const [deletedUser] = await db.update(UserTable)
        .set({
            deletedAt: new Date(),
            email: "deleted@email.com",
            name: "deleted",
            clerkUserId: 'deleted',
            imageUrl: null
        })
        .where(eq(UserTable.clerkUserId, clerkUserId))
        .returning()

    if (deletedUser) {
        return { error: false, message: "Successfully deleted User" }
    }
    return { error: true, message: "Failed to delete the user" }


}
