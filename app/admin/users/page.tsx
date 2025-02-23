/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { and, eq, not } from "drizzle-orm";
import { UsersTable } from "./UsersTable";
import { PageHeader } from "@/components/PageHeader";
export default async function UsersPage() {
    const Users = await getUsers()
    return <div>
        <PageHeader title={'Users'} />
        <hr className="my-4" />
        <UsersTable Users={Users} />
    </div>
}
async function getUsers() {

    const users = await db.query.UserTable.findMany({
        columns: {
            id: true,
            name: true,
            imageUrl: true,
            createdAt: true,
            email: true,
            clerkUserId: true
        },
        where: and(eq(UserTable.role, 'user'), not(eq(UserTable.name, 'deleted')))

    })
    console.log(users)
    return users
}
